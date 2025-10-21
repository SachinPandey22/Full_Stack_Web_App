import os
import django

# Setup Django - Your settings module is 'gymlog.settings'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gymlog.settings')
django.setup()

from exercises.models import Exercise

print("🔄 Clearing existing exercises...")
Exercise.objects.all().delete()

print("📝 Adding new exercises...")



# Add new exercises with images
exercises_created = Exercise.objects.bulk_create([
    # CHEST EXERCISES
    Exercise(
        name="Barbell Bench Press",
        category="strength",
        muscle_group="chest",
        description="Lie on bench, lower bar to chest, press up",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg",
        steps="1. Lie flat on bench with feet planted firmly on floor\n2. Grip bar slightly wider than shoulder width\n3. Lower bar slowly to mid-chest\n4. Press bar up explosively until arms fully extended\n5. Repeat for desired reps",
        tips="Keep back flat | Elbows at 45 degrees | Breathe out on press | Control the descent"
    ),
    Exercise(
        name="Dumbbell Flyes",
        category="strength",
        muscle_group="chest",
        description="Arc dumbbells out and bring together",
        equipment="Dumbbells",
        difficulty="beginner",
        image="https://s3assets.skimble.com/assets/1472075/image_iphone.jpg",
        steps="1. Lie on flat bench with dumbbells above chest\n2. Slightly bend elbows and lower dumbbells in arc\n3. Feel stretch in chest at bottom\n4. Bring dumbbells back together above chest\n5. Squeeze chest at top",
        tips="Keep slight bend in elbows | Do not go too heavy | Control the movement | Focus on chest stretch"
    ),
    Exercise(
        name="Push-ups",
        category="strength",
        muscle_group="chest",
        description="Classic bodyweight chest exercise",
        equipment="Bodyweight",
        difficulty="beginner",
        image="https://images.pexels.com/photos/2780762/pexels-photo-2780762.jpeg",
        steps="1. Start in plank position with hands shoulder-width apart\n2. Lower body until chest nearly touches floor\n3. Keep core tight and back straight\n4. Push back up to starting position\n5. Repeat",
        tips="Keep core engaged | Do not let hips sag | Elbows slightly tucked | Full range of motion"
    ),
    Exercise(
        name="Incline Bench Press",
        category="strength",
        muscle_group="chest",
        description="Press on incline bench for upper chest",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://blogscdn.thehut.net/app/uploads/sites/478/2021/07/shutterstock_68880238opt_featured_1625232235_1200x672_acf_cropped.jpg",
        steps="1. Set bench to 30-45 degree incline\n2. Lie back with feet flat on floor\n3. Lower bar to upper chest\n4. Press up until arms extended\n5. Repeat",
        tips="Target upper chest | Do not arch back excessively | Control the weight | Squeeze at top"
    ),
    Exercise(
        name="Cable Crossover",
        category="strength",
        muscle_group="chest",
        description="Cross cables in front of body",
        equipment="Cables",
        difficulty="intermediate",
        image="https://image.boxrox.com/2021/10/cable-crossover.jpg",
        steps="1. Stand between cable machines with handles high\n2. Step forward with slight lean\n3. Bring handles together in front of chest\n4. Squeeze chest muscles\n5. Return to start with control",
        tips="Keep slight bend in elbows | Lean forward slightly | Focus on chest contraction | Smooth motion"
    ),
    Exercise(
        name="Decline Bench Press",
        category="strength",
        muscle_group="chest",
        description="Press on decline bench for lower chest",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://imagely.mirafit.co.uk/wp/wp-content/uploads/2024/06/dumbbell-bench-press-on-a-Mirafit-Decline-Weight-Bench-1024x683.jpg",
        steps="1. Secure feet on decline bench\n2. Lower bar to lower chest\n3. Press bar up until arms extended\n4. Control descent\n5. Repeat",
        tips="Target lower chest | Keep control | Do not bounce bar | Secure your position"
    ),

    # BACK EXERCISES
    Exercise(
        name="Pull-ups",
        category="strength",
        muscle_group="back",
        description="Pull body up until chin over bar",
        equipment="Bodyweight",
        difficulty="intermediate",
        image="https://hips.hearstapps.com/hmg-prod/images/mh0418-fit-pul-01-1558554157.jpg",
        steps="1. Hang from bar with arms fully extended\n2. Grip bar slightly wider than shoulders\n3. Pull yourself up until chin clears bar\n4. Lower with control back to starting position\n5. Repeat",
        tips="Do not swing | Engage lats first | Full extension at bottom | Controlled descent"
    ),
    Exercise(
        name="Barbell Rows",
        category="strength",
        muscle_group="back",
        description="Pull barbell to lower chest",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://thefitnessmaverick.com/wp-content/uploads/2020/10/F265CF38-5010-4DBF-BE3A-68C68A2A7E02_1_201_a-1024x598.jpeg",
        steps="1. Bend at hips with back straight\n2. Grip bar with hands shoulder-width apart\n3. Pull bar to lower chest or upper abs\n4. Squeeze shoulder blades together\n5. Lower bar with control",
        tips="Keep back straight | Pull with elbows not hands | Squeeze at top | Do not jerk the weight"
    ),
    Exercise(
        name="Lat Pulldown",
        category="strength",
        muscle_group="back",
        description="Pull bar down to chest",
        equipment="Machines",
        difficulty="beginner",
        image="https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2Fj8TroKCQxtcHCSG7qRXQ9%2Ff11076a19165cd299eaa3ee2609b10c6%2Fdesktop-lat-pulldown.jpg&w=3840&q=85",
        steps="1. Sit with thighs secured under pad\n2. Grip bar wider than shoulders\n3. Pull bar down to upper chest\n4. Squeeze shoulder blades\n5. Return with control",
        tips="Do not lean back too much | Pull to chest not neck | Squeeze lats | Controlled return"
    ),
    Exercise(
        name="Deadlifts",
        category="strength",
        muscle_group="back",
        description="Lift barbell from ground to standing",
        equipment="Barbell",
        difficulty="advanced",
        image="https://media.istockphoto.com/id/891602094/photo/spotive-man-and-woman-lifting-heavy-barbells.jpg?s=612x612&w=0&k=20&c=rW-K_ao8hhO6rnoLJ0km_tVZfQY9i7xq8EfgHcEW-0s=",
        steps="1. Stand with feet hip-width, bar over mid-foot\n2. Grip bar outside legs, chest up\n3. Drive through heels, extend hips and knees\n4. Stand fully upright, squeeze glutes\n5. Lower bar with control",
        tips="Keep bar close to body | Neutral spine | Drive through heels | Breathe and brace core"
    ),
    Exercise(
        name="Dumbbell Rows",
        category="strength",
        muscle_group="back",
        description="Single-arm rowing movement",
        equipment="Dumbbells",
        difficulty="beginner",
        image="https://cdn.mos.cms.futurecdn.net/zzFwwkQgCNMtmWQ7aQSxXe.jpg",
        steps="1. Place one knee and hand on bench\n2. Hold dumbbell in other hand\n3. Pull dumbbell to hip\n4. Squeeze back at top\n5. Lower with control",
        tips="Keep back flat | Pull with elbow | Do not rotate torso | Focus on lat contraction"
    ),
    Exercise(
        name="T-Bar Rows",
        category="strength",
        muscle_group="back",
        description="Rowing movement using T-bar",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://gmwdfitness.com/cdn/shop/files/GMWD-TBARROWMACHINE-TB01-MAIN-3.jpg?v=1703751739&width=1600",
        steps="1. Straddle bar with feet shoulder-width\n2. Bend at hips, grip handles\n3. Pull bar to chest\n4. Squeeze back muscles\n5. Lower with control",
        tips="Keep back straight | Pull to lower chest | Squeeze shoulder blades | Control the weight"
    ),
    Exercise(
        name="Face Pulls",
        category="strength",
        muscle_group="back",
        description="Pull rope towards face for rear delts",
        equipment="Cables",
        difficulty="beginner",
        image="https://flex-web-media-prod.storage.googleapis.com/2024/12/face-pull-cable-exercise-cover.webp",
        steps="1. Set cable at upper chest height\n2. Grip rope with thumbs pointing back\n3. Pull rope to face, elbows high\n4. Squeeze rear delts\n5. Return with control",
        tips="Keep elbows high | Pull rope apart at face | Focus on rear delts | Light weight, high reps"
    ),

    # LEGS EXERCISES
    Exercise(
        name="Barbell Squats",
        category="strength",
        muscle_group="legs",
        description="Lower hips with barbell on back",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://cdn.mos.cms.futurecdn.net/v2/t:0,l:463,cw:1194,ch:1194,q:80,w:1194/77ZsKt8cMrnqqNsQnhZsy7.jpg",
        steps="1. Bar on upper back, feet shoulder-width\n2. Break at hips and knees simultaneously\n3. Lower until thighs parallel to ground\n4. Drive through heels to stand\n5. Repeat",
        tips="Chest up | Knees track over toes | Full depth | Drive through whole foot"
    ),
    Exercise(
        name="Leg Press",
        category="strength",
        muscle_group="legs",
        description="Push weight with legs while seated",
        equipment="Machines",
        difficulty="beginner",
        image="https://imagely.mirafit.co.uk/wp/wp-content/uploads/2023/03/woman-using-Mirafit-Leg-Press-Machine.jpg",
        steps="1. Sit with back flat against pad\n2. Place feet shoulder-width on platform\n3. Lower weight by bending knees\n4. Press back up through heels\n5. Do not lock knees at top",
        tips="Full range of motion | Do not lock knees | Keep back against pad | Control the weight"
    ),
    Exercise(
        name="Lunges",
        category="strength",
        muscle_group="legs",
        description="Step forward and lower back knee",
        equipment="Dumbbells",
        difficulty="beginner",
        image="https://trainingstation.co.uk/cdn/shop/articles/Lunges-movment_d958998d-2a9f-430e-bdea-06f1e2bcc835_900x.webp?v=1741687877",
        steps="1. Stand with feet hip-width apart\n2. Step forward with one leg\n3. Lower back knee toward ground\n4. Push off front foot to return\n5. Alternate legs",
        tips="Keep torso upright | Front knee over ankle | Push through front heel | Balance is key"
    ),
    Exercise(
        name="Romanian Deadlifts",
        category="strength",
        muscle_group="legs",
        description="Hip hinge for hamstrings",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://www.puregym.com/media/5gwmhhys/romanian-deadlift.jpg?quality=80",
        steps="1. Hold bar at hip level\n2. Hinge at hips, push hips back\n3. Lower bar along legs\n4. Feel hamstring stretch\n5. Drive hips forward to stand",
        tips="Keep back straight | Push hips back | Feel hamstring stretch | Do not round back"
    ),
    Exercise(
        name="Leg Curls",
        category="strength",
        muscle_group="legs",
        description="Isolation for hamstrings",
        equipment="Machines",
        difficulty="beginner",
        image="https://www.prowolf.in/cdn/shop/articles/5-reasons-why-you-should-use-the-leg-extension-leg-curl-machine-236554_68cccfa0-2a04-462f-81d9-405ef04681dd.jpg?v=1750227447",
        steps="1. Lie face down on machine\n2. Secure legs under pad\n3. Curl legs up toward glutes\n4. Squeeze hamstrings at top\n5. Lower with control",
        tips="Control the movement | Squeeze at top | Do not lift hips | Full range of motion"
    ),
    Exercise(
        name="Leg Extensions",
        category="strength",
        muscle_group="legs",
        description="Isolation for quadriceps",
        equipment="Machines",
        difficulty="beginner",
        image="https://physiotutors.com/wp-content/uploads/2022/01/Seated-Leg-Extension-featured.jpg",
        steps="1. Sit with back against pad\n2. Place ankles under lower pad\n3. Extend legs until straight\n4. Squeeze quads at top\n5. Lower with control",
        tips="Control the movement | Squeeze at top | Do not lock knees | Focus on quads"
    ),
    Exercise(
        name="Bulgarian Split Squats",
        category="strength",
        muscle_group="legs",
        description="Single-leg squat with rear foot elevated",
        equipment="Dumbbells",
        difficulty="intermediate",
        image="https://images.ctfassets.net/8urtyqugdt2l/3oIGFmfVB3rDEw6JHaONKL/24094350711db6c12fc6ee0b0c7fb5ce/mobile-bulgarian-split-squats.jpg",
        steps="1. Place rear foot on bench behind you\n2. Lower back knee toward ground\n3. Keep front knee over ankle\n4. Drive through front heel to stand\n5. Complete reps then switch legs",
        tips="Keep torso upright | Front knee over ankle | Balance is key | Go deep"
    ),
    Exercise(
        name="Calf Raises",
        category="strength",
        muscle_group="legs",
        description="Rise up on toes to work calves",
        equipment="Machines",
        difficulty="beginner",
        image="https://hips.hearstapps.com/hmg-prod/images/calf-raises-exercise-royalty-free-image-803023396-1559861323.jpg?crop=0.630xw:0.948xh;0,0&resize=640:*",
        steps="1. Stand with balls of feet on platform\n2. Lower heels below platform level\n3. Rise up on toes as high as possible\n4. Squeeze calves at top\n5. Lower with control",
        tips="Full range of motion | Squeeze at top | Control descent | Pause at top"
    ),

    # ARMS EXERCISES
    Exercise(
        name="Barbell Curls",
        category="strength",
        muscle_group="arms",
        description="Classic bicep exercise",
        equipment="Barbell",
        difficulty="beginner",
        image="https://barbend.com/wp-content/uploads/2024/01/barbell-curl-336330392.jpg",
        steps="1. Stand with feet shoulder-width\n2. Grip bar with underhand grip\n3. Curl bar up to shoulders\n4. Squeeze biceps at top\n5. Lower with control",
        tips="Keep elbows stationary | No swinging | Control the negative | Full range of motion"
    ),
    Exercise(
        name="Tricep Dips",
        category="strength",
        muscle_group="arms",
        description="Lower and raise between parallel bars",
        equipment="Bodyweight",
        difficulty="intermediate",
        image="https://hips.hearstapps.com/hmg-prod/images/tricep-dips-67ec0fe6ea221.jpg?crop=0.568xw:0.850xh;0.284xw,0.104xh&resize=640:*",
        steps="1. Support body on parallel bars\n2. Lower body by bending elbows\n3. Go until upper arms parallel to ground\n4. Push back up to starting position\n5. Repeat",
        tips="Keep elbows tucked | Lean slightly forward | Control the descent | Do not lock out elbows"
    ),
    Exercise(
        name="Hammer Curls",
        category="strength",
        muscle_group="arms",
        description="Curl with neutral grip",
        equipment="Dumbbells",
        difficulty="beginner",
        image="https://www.trainheroic.com/wp-content/uploads/2023/02/AdobeStock_417412809-TH-jpg.webp",
        steps="1. Stand with dumbbells at sides, palms facing in\n2. Curl dumbbells up\n3. Keep palms facing each other\n4. Squeeze biceps at top\n5. Lower with control",
        tips="Keep palms facing in | No swinging | Elbows stationary | Control the movement"
    ),
    Exercise(
        name="Overhead Tricep Extension",
        category="strength",
        muscle_group="arms",
        description="Extend weight overhead",
        equipment="Dumbbells",
        difficulty="beginner",
        image="https://cdn.muscleandstrength.com/sites/default/files/seated-overhead-dumbbell-tricep-extension_0.jpg",
        steps="1. Hold dumbbell overhead with both hands\n2. Lower weight behind head\n3. Keep elbows pointing forward\n4. Extend arms back to start\n5. Squeeze triceps at top",
        tips="Keep elbows in | Do not flare elbows | Full extension | Control the weight"
    ),
    Exercise(
        name="Cable Tricep Pushdown",
        category="strength",
        muscle_group="arms",
        description="Push cable down for triceps",
        equipment="Cables",
        difficulty="beginner",
        image="https://www.puregym.com/media/0kujs5ev/tricep-pushdowns.jpg?quality=80",
        steps="1. Stand facing cable machine\n2. Grip bar with hands close together\n3. Push bar down until arms extended\n4. Squeeze triceps at bottom\n5. Return with control",
        tips="Keep elbows at sides | Do not lean forward | Full extension | Squeeze at bottom"
    ),
    Exercise(
        name="Preacher Curls",
        category="strength",
        muscle_group="arms",
        description="Bicep isolation on preacher bench",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://cdn.shopify.com/s/files/1/0618/9462/3460/articles/pc_d32d967a-ee41-4b98-87ec-700ff079b0f0.jpg?v=1753097583",
        steps="1. Sit at preacher bench with arms on pad\n2. Grip bar with underhand grip\n3. Curl bar up\n4. Squeeze biceps at top\n5. Lower with control",
        tips="Keep arms on pad | No cheating | Strict form | Control the negative"
    ),
    Exercise(
        name="Close-Grip Bench Press",
        category="strength",
        muscle_group="arms",
        description="Bench press with narrow grip for triceps",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://www.puregym.com/media/5xkmtt4d/close-grip-bench-press.jpg?quality=80",
        steps="1. Lie on bench, grip bar shoulder-width\n2. Lower bar to lower chest\n3. Keep elbows tucked\n4. Press up until arms extended\n5. Repeat",
        tips="Keep elbows tucked | Target triceps | Do not go too wide | Control the weight"
    ),

    # SHOULDERS EXERCISES
    Exercise(
        name="Overhead Press",
        category="strength",
        muscle_group="shoulders",
        description="Press barbell overhead",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://media.post.rvohealth.io/wp-content/uploads/2019/04/overhead_press-732x549-thumbnail.jpg",
        steps="1. Hold bar at shoulder height\n2. Brace core and glutes\n3. Press bar overhead until arms extended\n4. Lower bar back to shoulders with control\n5. Repeat",
        tips="Keep core tight | Do not arch back excessively | Press in straight line | Full lockout at top"
    ),
    Exercise(
        name="Lateral Raises",
        category="strength",
        muscle_group="shoulders",
        description="Raise dumbbells to sides",
        equipment="Dumbbells",
        difficulty="beginner",
        image="https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2F4yx2hx2bseOyDZmqFk32za%2Fb177c068d64a4df9f9c305cddcfd9c41%2Fdesktop-lateral-raises.jpg&w=3840&q=85",
        steps="1. Stand with dumbbells at sides\n2. Raise arms out to sides to shoulder height\n3. Keep slight bend in elbows\n4. Lower with control\n5. Repeat",
        tips="Do not go too heavy | Control the movement | Raise to shoulder height | Avoid momentum"
    ),
    Exercise(
        name="Front Raises",
        category="strength",
        muscle_group="shoulders",
        description="Raise dumbbells to front",
        equipment="Dumbbells",
        difficulty="beginner",
        image="https://i.ytimg.com/vi/sOcYlBI85hc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCtq82bX41oMXW41eG-W8eY7ZH8Gg",
        steps="1. Stand with dumbbells at thighs\n2. Raise arms forward to shoulder height\n3. Keep slight bend in elbows\n4. Lower with control\n5. Repeat",
        tips="Do not swing | Raise to shoulder height | Control the movement | Light weight"
    ),
    Exercise(
        name="Arnold Press",
        category="strength",
        muscle_group="shoulders",
        description="Rotating dumbbell press",
        equipment="Dumbbells",
        difficulty="intermediate",
        image="https://lh7-rt.googleusercontent.com/docsz/AD_4nXdfbq9n46w176V4H7Hzn8N5TCTaNoFiQjNfMk1BykQnNvoju4_KZ6zBoBWIE3JVs1ZYLWH0sNb799MX8Tz5aE7044qEvA9IE0-56qieLL1wV8GTEDofDdcJEXrK-sL9Dv7nKv5fZQ?key=XGkZY7BzwzcneOvxMm8j5A",
        steps="1. Start with dumbbells at shoulders, palms facing you\n2. Press up while rotating palms forward\n3. End with palms facing forward at top\n4. Reverse motion on descent\n5. Repeat",
        tips="Smooth rotation | Control the weight | Full range of motion | Do not rush"
    ),
    Exercise(
        name="Rear Delt Flyes",
        category="strength",
        muscle_group="shoulders",
        description="Bent-over flyes for rear delts",
        equipment="Dumbbells",
        difficulty="beginner",
        image="https://www.performancelab.com/cdn/shop/articles/DumbbellRearDeltFly_1_970e4feb-ae42-450d-95de-4e0730e760de_480x.jpg?v=1753882776",
        steps="1. Bend forward at hips\n2. Hold dumbbells with arms hanging\n3. Raise arms out to sides\n4. Squeeze rear delts\n5. Lower with control",
        tips="Keep back flat | Focus on rear delts | Do not use momentum | Light weight"
    ),
    Exercise(
        name="Upright Rows",
        category="strength",
        muscle_group="shoulders",
        description="Pull barbell up along body to chin",
        equipment="Barbell",
        difficulty="intermediate",
        image="https://static.nike.com/a/images/f_auto/dpr_3.0,cs_srgb/w_403,c_limit/ac1ccf6e-a321-4b78-8136-90da1c322086/try-these-upright-row-variations-experts-say.jpg",
        steps="1. Hold bar at thighs with close grip\n2. Pull bar up along body to chin\n3. Lead with elbows\n4. Lower with control\n5. Repeat",
        tips="Lead with elbows | Keep bar close to body | Do not go too high | Control the weight"
    ),
    Exercise(
        name="Pike Push-ups",
        category="strength",
        muscle_group="shoulders",
        description="Bodyweight shoulder exercise",
        equipment="Bodyweight",
        difficulty="intermediate",
        image="https://www.pullup-dip.com/cdn/shop/articles/pike-push-ups_0094c470-7d7c-4112-8502-b6cf4a1db3f9.jpg?v=1744810977",
        steps="1. Start in downward dog position\n2. Lower head toward ground\n3. Push back up\n4. Keep hips high\n5. Repeat",
        tips="Keep hips high | Head between hands | Full range | Control the movement"
    ),

    # CORE EXERCISES
    Exercise(
        name="Planks",
        category="strength",
        muscle_group="core",
        description="Hold body straight",
        equipment="Bodyweight",
        difficulty="beginner",
        image="https://gymnation.com/media/jpbjzofv/plank2.webp?width=956&height=675&v=1da85a0bb1f4060",
        steps="1. Start in forearm plank position\n2. Keep body in straight line from head to heels\n3. Engage core and glutes\n4. Hold for desired time\n5. Do not let hips sag",
        tips="Keep core braced | Do not hold breath | Squeeze glutes | Neutral neck position"
    ),
    Exercise(
        name="Crunches",
        category="strength",
        muscle_group="core",
        description="Classic ab exercise",
        equipment="Bodyweight",
        difficulty="beginner",
        image="https://media.self.com/photos/5dfa77378873ee00093325ae/4:3/w_2560%2Cc_limit/GettyImages-498282756.jpg",
        steps="1. Lie on back with knees bent\n2. Hands behind head or across chest\n3. Lift shoulders off ground using abs\n4. Squeeze abs at top\n5. Lower with control",
        tips="Do not pull on neck | Focus on abs | Small controlled movements | Exhale on way up"
    ),
    Exercise(
        name="Russian Twists",
        category="strength",
        muscle_group="core",
        description="Rotate torso side to side",
        equipment="Dumbbells",
        difficulty="beginner",
        image="https://media1.popsugar-assets.com/files/thumbor/o8s-BNnAWtGIkg_KNecyrgyglLk=/0x0:1456x1000/fit-in/792x544/top/filters:format_auto():upscale()/2024/01/02/752/n/1922729/ae9f772f659441e1d1d007.94841585_.jpg",
        steps="1. Sit with knees bent, feet off ground\n2. Hold weight at chest\n3. Rotate torso side to side\n4. Touch weight to ground each side\n5. Keep core engaged",
        tips="Keep feet off ground | Control rotation | Breathe steadily | Focus on obliques"
    ),
    Exercise(
        name="Hanging Leg Raises",
        category="strength",
        muscle_group="core",
        description="Hang and raise legs",
        equipment="Bodyweight",
        difficulty="advanced",
        image="https://hips.hearstapps.com/hmg-prod/images/young-muscular-build-athlete-exercising-strength-in-royalty-free-image-1724143306.jpg?crop=0.667xw:1.00xh;0.134xw,0&resize=640:*",
        steps="1. Hang from bar with arms extended\n2. Keep legs straight or slightly bent\n3. Raise legs up to parallel\n4. Lower with control\n5. Repeat",
        tips="Control the swing | Engage core first | Do not use momentum | Breathe steadily"
    ),
    Exercise(
        name="Bicycle Crunches",
        category="strength",
        muscle_group="core",
        description="Alternating elbow to knee",
        equipment="Bodyweight",
        difficulty="beginner",
        image="https://www.endomondo.com/wp-content/uploads/2024/08/bicycle-crunch-endomondo.jpg",
        steps="1. Lie on back with hands behind head\n2. Lift shoulders off ground\n3. Bring opposite elbow to opposite knee\n4. Alternate sides in cycling motion\n5. Keep core engaged",
        tips="Slow controlled movements | Focus on rotation | Do not pull on neck | Breathe steadily"
    ),
    Exercise(
        name="Ab Wheel Rollouts",
        category="strength",
        muscle_group="core",
        description="Roll ab wheel forward and back",
        equipment="Bodyweight",
        difficulty="advanced",
        image="https://images.contentstack.io/v3/assets/blt45c082eaf9747747/blt946c950efa76636a/67fd0ba989c4f97ddcc176be/ab-wheel-kneeling-partial-rollout.jpg?format=pjpg&auto=webp&fit=crop&quality=76&width=undefined&height=undefined",
        steps="1. Start on knees with ab wheel\n2. Roll forward extending arms\n3. Keep core tight throughout\n4. Pull back to starting position\n5. Repeat",
        tips="Keep core braced | Do not let back sag | Control the rollout | Start with partial range"
    ),
    Exercise(
        name="Side Planks",
        category="strength",
        muscle_group="core",
        description="Hold body sideways on one arm",
        equipment="Bodyweight",
        difficulty="beginner",
        image="https://www.endomondo.com/wp-content/uploads/2024/08/side-plank-benefits.jpg",
        steps="1. Lie on side with elbow under shoulder\n2. Lift hips off ground\n3. Keep body in straight line\n4. Hold for desired time\n5. Switch sides",
        tips="Keep hips up | Do not sag | Engage obliques | Stack feet for harder version"
    ),
    Exercise(
        name="Cable Woodchops",
        category="strength",
        muscle_group="core",
        description="Rotational movement with cable",
        equipment="Cables",
        difficulty="intermediate",
        image="https://i.ytimg.com/vi/oL7exAOo_0I/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGMgYyhjMA8=&rs=AOn4CLAdFBmeIpO4Dt8SOzUs8WoLXe8u9g",
        steps="1. Set cable at shoulder height\n2. Stand sideways to machine\n3. Pull cable across body in chopping motion\n4. Rotate torso with movement\n5. Return with control",
        tips="Rotate through core | Keep arms relatively straight | Control the weight | Engage obliques"
    ),
])

print(f"✅ Successfully added {len(exercises_created)} exercises!")

# Show summary by muscle group
from django.db.models import Count
counts = Exercise.objects.values('muscle_group').annotate(total=Count('id')).order_by('muscle_group')

print("\n📊 Exercise Count by Muscle Group:")
for item in counts:
    print(f"   {item['muscle_group'].title()}: {item['total']} exercises")

print("\n🎉 Database populated successfully!")


#this needs to be changed so I dont know. I need to add this on my database
