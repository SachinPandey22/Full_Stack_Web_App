package com.example.watchtoweb

import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.lifecycle.lifecycleScope
import com.example.watchtoweb.ui.theme.WatchToWebTheme
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.logging.HttpLoggingInterceptor
import org.json.JSONArray
import org.json.JSONObject
import java.time.ZoneOffset
import java.time.ZonedDateTime

private const val SERVER = "http://10.0.2.2:8000" // <-- PUT YOUR PC's LAN IP here for real phone. (Emulator = http://10.0.2.2:8000)

class MainActivity : ComponentActivity() {

    private val hcClient by lazy { HealthConnectClient.getOrCreate(this) }

    // OkHttp with logging for easy debugging
    private val http by lazy {
        OkHttpClient.Builder()
            .addInterceptor(
                HttpLoggingInterceptor().apply { level = HttpLoggingInterceptor.Level.BODY }
            ).build()
    }

    private var jwt: String? = null

    private val deviceId by lazy {
        Settings.Secure.getString(contentResolver, Settings.Secure.ANDROID_ID) ?: "unknown-device"
    }

    private val permissions = setOf(
        HealthPermission.getReadPermission(StepsRecord::class)
    )

    private val requestPermissions =
        registerForActivityResult(PermissionController.createRequestPermissionResultContract()) { granted ->
            if (granted.containsAll(permissions)) {
                syncOnce()
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            WatchToWebTheme {
                var code by remember { mutableStateOf("") }
                var status by remember { mutableStateOf("Ready") }
                var isBusy by remember { mutableStateOf(false) }

                fun log(msg: String) { status = msg }

                Surface(Modifier.fillMaxSize()) {
                    Column(Modifier.padding(20.dp)) {
                        Text("Link phone → web", style = MaterialTheme.typography.titleLarge)
                        Spacer(Modifier.height(12.dp))

                        OutlinedTextField(
                            value = code,
                            onValueChange = { code = it },
                            label = { Text("Pairing code") },
                            singleLine = true,
                            keyboardOptions = KeyboardOptions(
                                capitalization = KeyboardCapitalization.Characters
                            ),
                            modifier = Modifier.fillMaxWidth()
                        )

                        Spacer(Modifier.height(12.dp))

                        Button(
                            enabled = !isBusy && code.isNotBlank(),
                            onClick = {
                                lifecycleScope.launch {
                                    isBusy = true
                                    try {
                                        log("Linking…")
                                        linkThenSync(code.trim().uppercase()) { m -> log(m) }
                                    } finally {
                                        isBusy = false
                                    }
                                }
                            },
                            modifier = Modifier.fillMaxWidth()
                        ) { Text("Link & Sync") }

                        Spacer(Modifier.height(16.dp))
                        Text(status)
                    }
                }
            }
        }
    }

    /** 1) Exchange pairing code for JWT, 2) ask permissions, 3) read + POST */
    private suspend fun linkThenSync(pairingCode: String, log: (String) -> Unit) {
        // Quick availability check
        if (HealthConnectClient.getSdkStatus(this) != HealthConnectClient.SDK_AVAILABLE) {
            log("Health Connect not available. Install/enable it and allow Samsung Health to share.")
            return
        }

        // 1) Link → get JWT
        val body = JSONObject().apply {
            put("pairing_code", pairingCode)
            put("device_id", deviceId)
            put("platform", "android")
        }.toString().toRequestBody("application/json".toMediaType())

        val linkReq = Request.Builder()
            .url("$SERVER/api/mobile/link")
            .post(body)
            .build()

        http.newCall(linkReq).execute().use { resp ->
            if (!resp.isSuccessful) {
                log("Link failed: ${resp.code}")
                return
            }
            val txt = resp.body?.string().orEmpty()
            jwt = JSONObject(txt).getString("token")
        }

        // 2) Permissions
        val granted = hcClient.permissionController.getGrantedPermissions()
        if (!granted.containsAll(permissions)) {
            log("Requesting Health Connect permissions…")
            requestPermissions.launch(permissions)
        } else {
            syncOnce()
        }
    }

    /** Read last 24h steps and send to server */
    private fun syncOnce() {
        lifecycleScope.launch {
            val token = jwt ?: return@launch
            val end = ZonedDateTime.now(ZoneOffset.UTC).toInstant()
            val start = ZonedDateTime.now(ZoneOffset.UTC).minusHours(24).toInstant()

            // 3a) Read Steps from Health Connect
            val read = hcClient.readRecords(
                ReadRecordsRequest(
                    recordType = StepsRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(start, end)
                )
            )

            // Build payload
            val stepsArray = JSONArray()
            read.records.forEach { r ->
                stepsArray.put(JSONObject().apply {
                    put("start", r.startTime.toString())
                    put("end", r.endTime.toString())
                    put("steps", r.count)
                    put("ext_id", "hc:steps:${r.startTime}-${r.endTime}-$deviceId")
                })
            }

            val payload = JSONObject().apply {
                put("source", "health_connect")
                put("steps", stepsArray)
            }.toString().toRequestBody("application/json".toMediaType())

            // 3b) POST to backend
            val ingestReq = Request.Builder()
                .url("$SERVER/api/mobile/ingest")
                .addHeader("Authorization", "Bearer $token")
                .post(payload)
                .build()

            http.newCall(ingestReq).execute().use { /* ignore body; check logs/server */ }
        }
    }
}

