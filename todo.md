# TODOs

- add xss sanitization to all input if needed
- add transform - trim, lowerCase - to string input
- write scripts to clean permissions to blocks that have been deleted
- Redesign the collaboration request and forgot password email templates
- set up prettier or airbnb style guide for linting
- use rbac/abac for roles (role to user, role to permission | action, role to block, etc)
- send notification when collaboration request expires or is about to

features

- bots.
  - should be tied to particular users (should perform operations on behalf of)
  - check if org or group or project allows bots (set bot scope in it's token)
  - org level bots require permission from stakeholders (owners or collection of admins)
- add restrictions to getting a block's notifications
