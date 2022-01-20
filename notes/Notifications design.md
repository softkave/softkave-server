# Notifications Design

When certain watched actions happen, users should get notified either by email or in the notification tab in the Softkave app. In the future, we can include other channels like Slack, Teams, Softkave Chat, etc. When we implement owners (like board owners), they will be automatically subscribed to some actions.

## Process

-   Users will subscribe to actions on resources
-   When the action happens, the user gets notified of the action
-   Some subscriptions will happen automatically

## Possible Actions and Resources

-   Organization

    -   On update
    -   On delete

-   Board

    -   On add
    -   On update
    -   On delete

-   Task

    -   On add
    -   On update
        -   On assign OR unassign tasks
        -   On update task general information
        -   On update task status
        -   on transfer task
    -   On delete

-   Chat

    -   On new message

-   Collaboration request

    -   On send requests
        -   Notify within organization
        -   Notify request recipient
    -   On update OR respond to request
        -   Notify within organization
        -   Notify request recipient

-   Collaborator
