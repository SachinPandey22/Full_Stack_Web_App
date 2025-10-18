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
    Exercise(name='Barbell Bench Press', category='strength', muscle_group='chest', description='Lie on bench, lower bar to chest, press up', equipment='Barbell', difficulty='intermediate', image='https://images.pexels.com/photos/3837757/pexels-photo-3837757.jpeg'),
    Exercise(name='Dumbbell Flyes', category='strength', muscle_group='chest', description='Arc dumbbells out and bring together', equipment='Dumbbells', difficulty='beginner', image='https://s3assets.skimble.com/assets/1472075/image_iphone.jpg'),
    Exercise(name='Push-ups', category='strength', muscle_group='chest', description='Classic bodyweight chest exercise', equipment='Bodyweight', difficulty='beginner', image='https://images.pexels.com/photos/2780762/pexels-photo-2780762.jpeg'),
    Exercise(name='Incline Bench Press', category='strength', muscle_group='chest', description='Press on incline bench for upper chest', equipment='Barbell', difficulty='intermediate', image='https://blogscdn.thehut.net/app/uploads/sites/478/2021/07/shutterstock_68880238opt_featured_1625232235_1200x672_acf_cropped.jpg'),
    Exercise(name='Cable Crossover', category='strength', muscle_group='chest', description='Cross cables in front of body', equipment='Cables', difficulty='intermediate', image='https://image.boxrox.com/2021/10/cable-crossover.jpg'),
    Exercise(name='Decline Bench Press', category='strength', muscle_group='chest', description='Press on decline bench for lower chest', equipment='Barbell', difficulty='intermediate', image='https://imagely.mirafit.co.uk/wp/wp-content/uploads/2024/06/dumbbell-bench-press-on-a-Mirafit-Decline-Weight-Bench-1024x683.jpg'),

    # BACK EXERCISES
    Exercise(name='Pull-ups', category='strength', muscle_group='back', description='Pull body up until chin over bar', equipment='Bodyweight', difficulty='intermediate', image='https://hips.hearstapps.com/hmg-prod/images/mh0418-fit-pul-01-1558554157.jpg'),
    Exercise(name='Barbell Rows', category='strength', muscle_group='back', description='Pull barbell to lower chest', equipment='Barbell', difficulty='intermediate', image='https://thefitnessmaverick.com/wp-content/uploads/2020/10/F265CF38-5010-4DBF-BE3A-68C68A2A7E02_1_201_a-1024x598.jpeg'),
    Exercise(name='Lat Pulldown', category='strength', muscle_group='back', description='Pull bar down to chest', equipment='Machines', difficulty='beginner', image='https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2Fj8TroKCQxtcHCSG7qRXQ9%2Ff11076a19165cd299eaa3ee2609b10c6%2Fdesktop-lat-pulldown.jpg&w=3840&q=85'),
    Exercise(name='Deadlifts', category='strength', muscle_group='back', description='Lift barbell from ground to standing', equipment='Barbell', difficulty='advanced', image='https://media.istockphoto.com/id/891602094/photo/spotive-man-and-woman-lifting-heavy-barbells.jpg?s=612x612&w=0&k=20&c=rW-K_ao8hhO6rnoLJ0km_tVZfQY9i7xq8EfgHcEW-0s='),
    Exercise(name='Dumbbell Rows', category='strength', muscle_group='back', description='Single-arm rowing movement', equipment='Dumbbells', difficulty='beginner', image='https://cdn.mos.cms.futurecdn.net/zzFwwkQgCNMtmWQ7aQSxXe.jpg'),
    Exercise(name='T-Bar Rows', category='strength', muscle_group='back', description='Rowing movement using T-bar', equipment='Barbell', difficulty='intermediate', image='https://gmwdfitness.com/cdn/shop/files/GMWD-TBARROWMACHINE-TB01-MAIN-3.jpg?v=1703751739&width=1600'),
    Exercise(name='Face Pulls', category='strength', muscle_group='back', description='Pull rope towards face for rear delts', equipment='Cables', difficulty='beginner', image='https://flex-web-media-prod.storage.googleapis.com/2024/12/face-pull-cable-exercise-cover.webp'),

    # LEGS EXERCISES
    Exercise(name='Barbell Squats', category='strength', muscle_group='legs', description='Lower hips with barbell on back', equipment='Barbell', difficulty='intermediate', image='https://cdn.mos.cms.futurecdn.net/v2/t:0,l:463,cw:1194,ch:1194,q:80,w:1194/77ZsKt8cMrnqqNsQnhZsy7.jpg'),
    Exercise(name='Leg Press', category='strength', muscle_group='legs', description='Push weight with legs while seated', equipment='Machines', difficulty='beginner', image='https://imagely.mirafit.co.uk/wp/wp-content/uploads/2023/03/woman-using-Mirafit-Leg-Press-Machine.jpg'),
    Exercise(name='Lunges', category='strength', muscle_group='legs', description='Step forward and lower back knee', equipment='Dumbbells', difficulty='beginner', image='https://trainingstation.co.uk/cdn/shop/articles/Lunges-movment_d958998d-2a9f-430e-bdea-06f1e2bcc835_900x.webp?v=1741687877'),
    Exercise(name='Romanian Deadlifts', category='strength', muscle_group='legs', description='Hip hinge for hamstrings', equipment='Barbell', difficulty='intermediate', image='https://www.puregym.com/media/5gwmhhys/romanian-deadlift.jpg?quality=80'),
    Exercise(name='Leg Curls', category='strength', muscle_group='legs', description='Isolation for hamstrings', equipment='Machines', difficulty='beginner', image='https://www.prowolf.in/cdn/shop/articles/5-reasons-why-you-should-use-the-leg-extension-leg-curl-machine-236554_68cccfa0-2a04-462f-81d9-405ef04681dd.jpg?v=1750227447'),
    Exercise(name='Leg Extensions', category='strength', muscle_group='legs', description='Isolation for quadriceps', equipment='Machines', difficulty='beginner', image='https://physiotutors.com/wp-content/uploads/2022/01/Seated-Leg-Extension-featured.jpg'),
    Exercise(name='Bulgarian Split Squats', category='strength', muscle_group='legs', description='Single-leg squat with rear foot elevated', equipment='Dumbbells', difficulty='intermediate', image='https://images.ctfassets.net/8urtyqugdt2l/3oIGFmfVB3rDEw6JHaONKL/24094350711db6c12fc6ee0b0c7fb5ce/mobile-bulgarian-split-squats.jpg'),
    Exercise(name='Calf Raises', category='strength', muscle_group='legs', description='Rise up on toes to work calves', equipment='Machines', difficulty='beginner', image='https://hips.hearstapps.com/hmg-prod/images/calf-raises-exercise-royalty-free-image-803023396-1559861323.jpg?crop=0.630xw:0.948xh;0,0&resize=640:*'),

    # ARMS EXERCISES
    Exercise(name='Barbell Curls', category='strength', muscle_group='arms', description='Classic bicep exercise', equipment='Barbell', difficulty='beginner', image='https://barbend.com/wp-content/uploads/2024/01/barbell-curl-336330392.jpg'),
    Exercise(name='Tricep Dips', category='strength', muscle_group='arms', description='Lower and raise between parallel bars', equipment='Bodyweight', difficulty='intermediate', image='https://hips.hearstapps.com/hmg-prod/images/tricep-dips-67ec0fe6ea221.jpg?crop=0.568xw:0.850xh;0.284xw,0.104xh&resize=640:*'),
    Exercise(name='Hammer Curls', category='strength', muscle_group='arms', description='Curl with neutral grip', equipment='Dumbbells', difficulty='beginner', image='https://www.trainheroic.com/wp-content/uploads/2023/02/AdobeStock_417412809-TH-jpg.webp'),
    Exercise(name='Overhead Tricep Extension', category='strength', muscle_group='arms', description='Extend weight overhead', equipment='Dumbbells', difficulty='beginner', image='https://cdn.muscleandstrength.com/sites/default/files/seated-overhead-dumbbell-tricep-extension_0.jpg'),
    Exercise(name='Cable Tricep Pushdown', category='strength', muscle_group='arms', description='Push cable down for triceps', equipment='Cables', difficulty='beginner', image='https://www.puregym.com/media/0kujs5ev/tricep-pushdowns.jpg?quality=80'),
    Exercise(name='Preacher Curls', category='strength', muscle_group='arms', description='Bicep isolation on preacher bench', equipment='Barbell', difficulty='intermediate', image='https://cdn.shopify.com/s/files/1/0618/9462/3460/articles/pc_d32d967a-ee41-4b98-87ec-700ff079b0f0.jpg?v=1753097583'),
    Exercise(name='Close-Grip Bench Press', category='strength', muscle_group='arms', description='Bench press with narrow grip for triceps', equipment='Barbell', difficulty='intermediate', image='https://www.puregym.com/media/5xkmtt4d/close-grip-bench-press.jpg?quality=80'),

    # SHOULDERS EXERCISES
    Exercise(name='Overhead Press', category='strength', muscle_group='shoulders', description='Press barbell overhead', equipment='Barbell', difficulty='intermediate', image='https://media.post.rvohealth.io/wp-content/uploads/2019/04/overhead_press-732x549-thumbnail.jpg'),
    Exercise(name='Lateral Raises', category='strength', muscle_group='shoulders', description='Raise dumbbells to sides', equipment='Dumbbells', difficulty='beginner', image='https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2F4yx2hx2bseOyDZmqFk32za%2Fb177c068d64a4df9f9c305cddcfd9c41%2Fdesktop-lateral-raises.jpg&w=3840&q=85'),
    Exercise(name='Front Raises', category='strength', muscle_group='shoulders', description='Raise dumbbells to front', equipment='Dumbbells', difficulty='beginner', image='https://i.ytimg.com/vi/sOcYlBI85hc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCtq82bX41oMXW41eG-W8eY7ZH8Gg'),
    Exercise(name='Arnold Press', category='strength', muscle_group='shoulders', description='Rotating dumbbell press', equipment='Dumbbells', difficulty='intermediate', image='https://lh7-rt.googleusercontent.com/docsz/AD_4nXdfbq9n46w176V4H7Hzn8N5TCTaNoFiQjNfMk1BykQnNvoju4_KZ6zBoBWIE3JVs1ZYLWH0sNb799MX8Tz5aE7044qEvA9IE0-56qieLL1wV8GTEDofDdcJEXrK-sL9Dv7nKv5fZQ?key=XGkZY7BzwzcneOvxMm8j5A'),
    Exercise(name='Rear Delt Flyes', category='strength', muscle_group='shoulders', description='Bent-over flyes for rear delts', equipment='Dumbbells', difficulty='beginner', image='https://www.performancelab.com/cdn/shop/articles/DumbbellRearDeltFly_1_970e4feb-ae42-450d-95de-4e0730e760de_480x.jpg?v=1753882776'),
    Exercise(name='Upright Rows', category='strength', muscle_group='shoulders', description='Pull barbell up along body to chin', equipment='Barbell', difficulty='intermediate', image='https://static.nike.com/a/images/f_auto/dpr_3.0,cs_srgb/w_403,c_limit/ac1ccf6e-a321-4b78-8136-90da1c322086/try-these-upright-row-variations-experts-say.jpg'),
    Exercise(name='Pike Push-ups', category='strength', muscle_group='shoulders', description='Bodyweight shoulder exercise', equipment='Bodyweight', difficulty='intermediate', image='https://www.pullup-dip.com/cdn/shop/articles/pike-push-ups_0094c470-7d7c-4112-8502-b6cf4a1db3f9.jpg?v=1744810977'),

    # CORE EXERCISES
    Exercise(name='Planks', category='strength', muscle_group='core', description='Hold body straight', equipment='Bodyweight', difficulty='beginner', image='https://gymnation.com/media/jpbjzofv/plank2.webp?width=956&height=675&v=1da85a0bb1f4060'),
    Exercise(name='Crunches', category='strength', muscle_group='core', description='Classic ab exercise', equipment='Bodyweight', difficulty='beginner', image='https://media.self.com/photos/5dfa77378873ee00093325ae/4:3/w_2560%2Cc_limit/GettyImages-498282756.jpg'),
    Exercise(name='Russian Twists', category='strength', muscle_group='core', description='Rotate torso side to side', equipment='Dumbbells', difficulty='beginner', image='https://media1.popsugar-assets.com/files/thumbor/o8s-BNnAWtGIkg_KNecyrgyglLk=/0x0:1456x1000/fit-in/792x544/top/filters:format_auto():upscale()/2024/01/02/752/n/1922729/ae9f772f659441e1d1d007.94841585_.jpg'),
    Exercise(name='Hanging Leg Raises', category='strength', muscle_group='core', description='Hang and raise legs', equipment='Bodyweight', difficulty='advanced', image='https://hips.hearstapps.com/hmg-prod/images/young-muscular-build-athlete-exercising-strength-in-royalty-free-image-1724143306.jpg?crop=0.667xw:1.00xh;0.134xw,0&resize=640:*'),
    Exercise(name='Bicycle Crunches', category='strength', muscle_group='core', description='Alternating elbow to knee', equipment='Bodyweight', difficulty='beginner', image='https://www.endomondo.com/wp-content/uploads/2024/08/bicycle-crunch-endomondo.jpg'),
    Exercise(name='Ab Wheel Rollouts', category='strength', muscle_group='core', description='Roll ab wheel forward and back', equipment='Bodyweight', difficulty='advanced', image='https://images.contentstack.io/v3/assets/blt45c082eaf9747747/blt946c950efa76636a/67fd0ba989c4f97ddcc176be/ab-wheel-kneeling-partial-rollout.jpg?format=pjpg&auto=webp&fit=crop&quality=76&width=undefined&height=undefined'),
    Exercise(name='Side Planks', category='strength', muscle_group='core', description='Hold body sideways on one arm', equipment='Bodyweight', difficulty='beginner', image='https://www.endomondo.com/wp-content/uploads/2024/08/side-plank-benefits.jpg'),
    Exercise(name='Cable Woodchops', category='strength', muscle_group='core', description='Rotational movement with cable', equipment='Cables', difficulty='intermediate', image='https://i.ytimg.com/vi/oL7exAOo_0I/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGGMgYyhjMA8=&rs=AOn4CLAdFBmeIpO4Dt8SOzUs8WoLXe8u9g'),
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
