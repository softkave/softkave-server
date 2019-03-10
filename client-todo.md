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

- allow orgs to create email template for requests
- allow chat in requests
- notify requester when request has been responded
- keep the history of all updates
- [ ] user must be able read a task to be assigned

marketing

1. offer bonuses to users who send invites to others
2. offer bonuses to users | orgs who regularly use, and pertake in surveys, and request features

fix

1. add validation to new collab req form
2. use arrays, instead of objects as tasks in parents. Test the speed
3. make task collaborators and collaboratorsList into objects to make AssignCollab run faster
4. check out clearing queued task ops
5. fix updating lastNotificationCheckTime
