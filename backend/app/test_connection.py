# backend/test_final.py
import praw
print("--- Starting Final Hardcoded Test ---")

# --- PASTE YOUR NEW CREDENTIALS DIRECTLY HERE ---
# This removes the .env file as a possible point of failure.
# Replace the placeholder text with your real, new credentials.
my_client_id = "vCBKZHfmvPbXoiX_2n73Ow"
my_client_secret = "O9oeDkD5HR_UURAKI8OPn0P_ruxIjQ"
my_user_agent = "FinalTestApp/0.1 by u/Intelligent_Claim872"
# --------------------------------------------------

print(f"Attempting to use Client ID: {my_client_id}")

try:
    reddit = praw.Reddit(
        client_id=my_client_id,
        client_secret=my_client_secret,
        user_agent=my_user_agent,
        check_for_updates=False
    )
    
    user = reddit.user.me()
    print(f"   Authenticating as: {user}")

    if user:
        print("\n   >>> SUCCESS! AUTHENTICATION WORKED! <<<")
    else:
        print("\n   >>> FAILED! AUTHENTICATION RETURNED NONE. <<<")

except Exception as e:
    print(f"\n   >>> FAILED WITH AN EXCEPTION: {e} <<<")