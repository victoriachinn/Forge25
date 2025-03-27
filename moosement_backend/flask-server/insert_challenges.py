from pymongo import MongoClient

MONGO_URI = "mongodb+srv://mshteynberg:moosementcluster@moosement.lnn1d.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["moosement"]
challenges_collection = db["challenges"]

# hardcoded challenges
challenges = [
    {"name": "Step Sprint", "description": "Take 5,000 steps before lunch."},
    {"name": "Stairway to Success", "description": "Use the stairs exclusively and hit 20 flights by the end of the day."},
    {"name": "Deskercise Challenge", "description": "Complete 10 desk-friendly exercises throughout the day."},
    {"name": "Walk & Talk", "description": "Take a 10-minute walking meeting instead of sitting."},
    {"name": "Water Break Walks", "description": "Take a 2-minute walking break every time you drink water."},
    {"name": "Lunchtime Sweat", "description": "Complete a 15-minute workout during lunch."},
    {"name": "Standing Ovation", "description": "Stand for at least 5 minutes every hour."},
    {"name": "Push-up Power", "description": "Complete 50 push-ups throughout the workday."},
    {"name": "Squat It Out", "description": "Do 10 squats every hour."},
    {"name": "Plank Challenge", "description": "Accumulate 5 minutes of planking before the workday ends."},
    {"name": "Calf Raise Count", "description": "Hit 100 calf raises throughout the day."},
    {"name": "Wall Sit Warrior", "description": "Complete 5 minutes of wall sits throughout the day."},
    {"name": "Chair Dips for Days", "description": "Complete 50 chair dips before the day ends."},
    {"name": "Jumping Jack Attack", "description": "Do 20 jumping jacks every hour."},
    {"name": "Tight Core Tuesday", "description": "Engage your core by holding a 30-second stomach vacuum every hour."},
    {"name": "Lunges All Day", "description": "Do 5 lunges every time you get up from your chair."},
    {"name": "Skipping Steps", "description": "Skip every other step when taking the stairs."},
    {"name": "Balance Breaks", "description": "Stand on one foot for 30 seconds every time you check your phone."},
    {"name": "Quick Cardio Burst", "description": "Complete a 60-second cardio burst 3 times during the workday."},
    {"name": "Stretch & Breathe", "description": "Do a full-body stretch every 90 minutes."},
    {"name": "Elevator Ban", "description": "Take only the stairs all day."},
    {"name": "Desk to Door Dashes", "description": "Walk outside for fresh air at least three times."},
    {"name": "Seated Spine Stretch", "description": "Perform a 30-second seated spinal twist every hour to relieve tension."},
    {"name": "Deep Breathing Reset", "description": "Pause for 60 seconds of deep breathing every two hours to refresh your mind."},
    {"name": "Neck & Shoulder Release", "description": "Roll your shoulders and stretch your neck for 1 minute every hour."},
    {"name": "Mindful Walk", "description": "Take a slow, mindful 5-minute walk during your break, focusing on each step."},
    {"name": "Wrist & Hand Mobility", "description": "Stretch your wrists and fingers for 30 seconds every 90 minutes to avoid stiffness."},
    {"name": "Eye Relaxation", "description": "Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds."},
    {"name": "Standing Hamstring Stretch", "description": "Perform a standing hamstring stretch for 30 seconds on each leg twice a day."},
    {"name": "Seated Forward Fold", "description": "Bend forward in your chair, reaching for your toes, and hold for 30 seconds to improve flexibility."},
    {"name": "Burst of Energy", "description": "Perform 30 seconds of high-intensity cardio every hour to keep your heart rate up."}
]

# insert challenges into the database
if challenges_collection.count_documents({}) == 0:
    challenges_collection.insert_many(challenges)
    print("Challenges inserted successfully!")
else:
    print("Challenges already exist in the database.")
