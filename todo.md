1. test current validators to see their error output
2. add xss sanitization to all input
3. add transform - trim, lowerCase - to string input
4. add rootBlock to block mongo model
5. add pattern: /\w/ to any input that is a stirng
6. change message in ErrorSchema to errors (array)
7. check to see which is faster in querying arrays, querying in db or array looping
8. figure out where block.owner should be added
9. write scripts to clean permissions to blocks that have been deleted
10. change password mutation should ask for current password
11. Remove nf or find a way to use it
12. Test not allowing action on an expired collaboration request
13. Redesign the collaboration request and forgot password email

- set up prettier or airbnb style guide
- use rbac for roles (role to user, role to permission | action, role to block, etc)
- send notification when collaboration request expires

features

1. bots.

- should be tied to particular users (should perform operations on behalf of)
- check if org or group or project allows bots (set bot scope in it's token)
- org level bots require permission from stakeholders (owners or collection of admins)

2. send periodic emails to remind user who have sent collab requests but haven't responded
3. redesign block structure

- thought, let permission block (orgs & select projects) have the same structure,
  but identify differently
- thought, bridge difference between personal groups and tasks, and project ones

4. add restrictions to getting a block's notifications

tradeoffs

1. retain current can user perform action because it is optimised, it works and it
   it provides an extra layer of security

CLIENT
Reducers

1. singular pure reducer that accepts a type map and routes actions

- actions can have "affects" field that comprises of actions that are
  depend on the action being dispatched
- reducers (state, action)

Scroll

1. find out the scroll used in VS Code and use for vertical scrolling

features

1. vscode extension for reading todos (commented "TODO" or todo\*)
2. add a new group to tasks - due today
3. debounce | throttle net requests
4. make all requests asynchronous except in special conditions (like no db in case net fails)
5. allow user to customize duration before updating last notification check time
6. look into timezone and time internationalization
7. send all (task) updates and deletes in one graphql mutation
8. make expectedEndAt scoped to individuals
9. make inter, and intra orgs, projects, groups possible
10. explore workspaces

marketing

1. offer bonuses to users who send invites to others
2. offer bonuses to users | orgs who regularly use, and pertake in surveys, and request features

fix

1. add validation to new collab req form
2. use arrays, instead of objects as tasks in parents. Test the speed
3. make task collaborators and collaboratorsList into objects to make AssignCollab run faster
4. check out clearing queued task ops
5. fix updating lastNotificationCheckTime

- see if you can use generic messages for all error fields to reduce runtime memory footprint
