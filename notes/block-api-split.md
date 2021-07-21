# Block API Split

## Goal

-   Split the block API into organization, board and task API
-   Seperate collaboration request into its own endpoints
-   Write scripts to populate fields that should be present per block type, including status assigned by from "system" to the creator
    -   Add required/default fields to the block types
    -   Move to new models for orgId and block type org change
    -   snake case models names, not camel case
-   Priority to high, medium, low
-   Keep socket updates and remove audit logs

## Side Effects

-   Real-time updates will be paused for a while and implemented in another work group

## Implementation

-   Organization API

    -   createOrganization
    -   readUserOrganizations
    -   updateOrganization
    -   organizationExists

-   Board API

    -   createBoard
    -   readOrganizationBoards
    -   updateBoard
    -   deleteBoard

-   Task API
    -   createTask
    -   readTasks
    -   updateTask
    -   deleteTask
