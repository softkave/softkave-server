# General Architecture

## Proposed Code Structure

- endpoints - graphql endpoints
  - block
  - user
  - notification
- middlewares - express server middlewares
- mongo - mongo db schemas and helpers
- resources - configurations, and other resources
- scripts - database mod scripts, and other scripts
- utils - general utilites
  - html - utilities for generating html templates and emails
  - error - utility code for handling errors

## Proposed GraphQL Structure

- user
  - account details
  - meta information
    - Like groups, projects the user is watching
  - user settings
  - organizations
    - count
    - data
      - projects
      - groups
      - tasks
      - reports
  - notifications
    - count
    - data
  - assigned tasks
    - count
    - data
  - projects ( future )
    - groups
    - tasks
  - teams ( future )
  - chats ( future )
  - documents ( future )
  - reports ( future )

### Questions

- How do we capture unseen data, like:
  - unseen/new assigned tasks
  - unseen notifications
  - unseen organizations, etc.
- Pagination
- Limiting sent data, for example, assigned tasks
- Search

## Thoughts

- We should send emails/notifications to people about their tasks that are about to expire, if they have notifications set up
- We should implement a way tp subscribe to latest changes, so that the user doesn't have to reload the website to get them
