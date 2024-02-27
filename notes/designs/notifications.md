# Notification Design Doc

## Overview

We want to track certain events and report them to the user through in-app notifications and email notifications. Notifications will have types based on the event they are reporting, and the type will determine if it is in-app, email, or both. The type will also determine if email notifications are sent alone or in bulk to avoid spamming the user. Most notifications will be in-app and emails will be sent only if the user has not seen the notification. Notifications will be sent at end of day. We will resend notifications once if the user still has not seen them after 3 days. We will also provide a way for the user to opt out of receiving notifications. Eventually, we will like to include push notifications as another surface besides in-app and email.
