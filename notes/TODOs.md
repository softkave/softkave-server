# ToDos

- [ ] How do we handle deletes?
  - [ ] cascade delete and delete artifacts
- [ ] Notifications
- [ ] replace all merge with mergeData with arrayUpdateStrategy of replace, also in sk
- [ ] Access controls
- [ ] Permission condition fields
- [ ] email templates
  - [ ] changelogs and opt-out
- [ ] Audit log inserts for all endpoints
- [ ] unit tests
  - [ ] checkAuthorization
  - [ ] permission endpoints
- [ ] Socket updates for all endpoints
  - [ ] for permission endpoints
- [ ] board access control
- [ ] Notifications and real-time sync
- [ ] new resources hsould inherit parent visibility
- [ ] delete private permission items on remove from private or board for boards
- [ ] Bulk insert get list audit logs
- [ ] All round pagination
- [ ] Read entity permissions and read entity assigned permissions
- [ ] check on action targets for all auth check
- [ ] Audit log should log permission denieds too
- [ ] Permission denied condition, and read audit log action should have a sub-action of audit log action, target type, entity type, etc. It can also be a condition.
- [ ] Cache assigned permission groups in memory
- [ ] Some endpoint results are not converted to public versions
- [ ] Custom properties
- [ ] Notes
- [ ] Improved chat
- [ ] File upload
- [ ] Payment
- [ ] Pagination and multi-service architecture
- [ ] Logging and alerting
- [ ] Personal boards and notes
- [ ] Audit logs
- [ ] Guaranteed and cacheable socket update for all updates
- [ ] Introduce a new Mongo model where data references are auto-deleted on data delete and update on callback on delete for propagation to the frontend
- [ ] Move to utc time on db
- [ ] add Google gts
- [ ] Rename organization to workspace
- [ ] How do we audit log endpoints that don't have a corresponding action type like board's getAverageTimeToCompleteTasks? Should we use endpoints instead?
- [ ] Add permissions for chat rooms when created for participants -- no longer needed
- [ ] Add public read permission to orgs when boards are made public
- [ ] Document what permissions are needed to perform each actions
- [ ] Document what endpoints anonymous users can access
- [ ] Document endpoints not audit logged
- [ ] Should every access be permission gated, and add justification to permissions
- [ ] How do we audit log user changes like password updates?
