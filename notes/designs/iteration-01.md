# Iteration 01

- Implement audit logs and log usage
  - Should we log using endpoints and or action->resource type
- Implement anonymous users
  - These are users who didn't signup but interact with public resources on the app. Organizations and boards can be made public.
  - Store them in the db separately from the users and writes interfaces for fetching users (signed-up users) for endpoints that should accept only users, and users/anonymous users for endpoints that accept both using only the user ID.
    - To differentiate between the two, we'll be adding prefixes to reosurce IDs indicating the resource type.
  - Implement permissions for authorizing access.
    - Permissions will currently follow actions on resource types. Meaning each permission item will grant or deny access to an action performed on a resource type.
    - Implement permission groups to make it easier to assign permissions.
    - Have a public permission group for every organization auto applied for access checks. Access allowed for non-collaborators will be assigned to and checked using this permission group.
    - Should all interactions be gated through permissions? For example, responding to a collaboration request. Currently, access check is implicit in that we check if the user updating the request is the one assigned the request. Should we instead create permissions that gives the recipient access to request and use those for access checks? Same for other implicit-like endpoints.
    - Hide/disable actions and pages on the frontend if the user does not have the permission to view them.
    - Allow users to update permissions in organizations and in boards.
      - Organizations and boards can be made public. Making an org public does not make it's board public. It actually has very little effect excepting reading the org block itself. Making a board public will automatically make it's org public.
        - Should making an org public make it's collaborators public? What of it's boards?
  - Should we audit log during authorization check and finalize the log when the request returns?
  - Use recently viewed resources gleaned from audit logs to show an anonymous user's recently viewed organizations and boards for better UX.
  - Use recently viewed resources to sort a user's organizations and boards in-server.
  - On the frontend, wherever user information is displayed outside of areas we are sure only accepts signed up users, check if the user is an anonymous user and display anonymous user.
  - Maybe assign a random unique integer to anonymous user names for better UX. Or should we use a random hex string for better collision avoidance?
- Move fire and forgets to request data and wait for them in tests.
- Move tests to use Mocha instaed of Jest.
- Research notes.

## Permission groups

Endpoints

- setPermissionGroups
- getPermissionGroupList

Query

- Existing fields in permission group
- assignedTo, list
  - type
  - resourceId
  - assignedBy
  - assignedAt
