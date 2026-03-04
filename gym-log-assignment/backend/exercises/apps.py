from django.apps import AppConfig


from django.core.management import call_command


class ExercisesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'exercises'
    met_values_updated = False

    def ready(self):
        """Auto-update MET values on server start"""
        if not self.met_values_updated:
            try:
                print("🔧 Updating MET values for exercises...")
                call_command('update_met_values')
                self.met_values_updated = True
                print("✅ MET values updated successfully!")
            except Exception as e:
                print(f"⚠️  Could not update MET values: {e}")