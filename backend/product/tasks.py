# import os 
# from django.conf import settings

# from django.utils.timezone import now
# from datetime import timedelta
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
# from django.apps import apps
from user.models import UserFCMToken
from firebase_admin import get_app, messaging
import os
from dotenv import load_dotenv

load_dotenv()

def send_email(to_email, subject, message):
    from_email = "jale.official.contact@gmail.com"
    password = os.getenv("EMAIL_HOST_PASSWORD")  # Use app-specific password here
    
    # Set up the MIME
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(message, 'plain'))

    try:
        # Connect to the server and send the email
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
            server.login(from_email, password)
            server.send_message(msg)
        print("Email sent successfully")
        logger.info(f"Sent email Succesfully to {to_email}")
        return {
            "status": "SENT",
            "receiver": to_email,
            "subject": subject,
        }        
    except Exception as e:
        print(f"Failed to send email: {e}")
        logger.info(f"Sent email Succesfully to {to_email}")
        return {
            "status": "FAILED",
            "receiver": to_email,
            "subject": subject,
        }  
    
logger = logging.getLogger(__name__)


def browser_notify(user_Id, subject, message, url):
    logger.info(f"Check here: user_Id={user_Id}, subject={subject}, message={message}, url={url}")

    # Firebase initialization sanity check
    try:
        # from firebase_admin import get_app
        app = get_app()
        logger.info(f"Firebase Admin app initialized: {app.name}")
    except ValueError as e:
        logger.error(f"Firebase Admin not initialized: {e}")
        return {
            "status": "FAILED",
            "error": "Firebase not initialized"
        }

    try:
        tokens = UserFCMToken.objects.filter(user__id=user_Id).values_list('token', flat=True)

        for userToken in tokens:
            message_obj = messaging.Message(
                data={
                    "title": subject,
                    "body": message,
                    "url": url
                },
                token=userToken
            )
            response = messaging.send(message_obj)

        logger.info(f"Notification Sent: {response}")

        return {
            "status": "SENT",
            "subject": subject,
        }

    except UserFCMToken.DoesNotExist:
        logger.warning(f"No FCM token found for user ID {user_Id}")
        return {
            "status": "FAILED",
            "subject": subject,
        }

    except Exception as e:
        logger.error(f"Error sending notification: {e}", exc_info=True)
        return {
            "status": "FAILED",
            "subject": subject,
        }