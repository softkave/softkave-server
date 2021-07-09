# Block API Split

## Goal

-   Split the block API into org, board and task API
-   Seperate collaboration request into its own endpoints
-   Write scripts to populate fields that should be present per block type, including status assigned by from "system" to the creator

## Side Effects

-   Real-time updates will be paused for a while and implemented in another work group

## Implementation

-   Org API

    -   createOrg
    -   readUserOrgs
    -   updateOrg
    -   orgExists

-   Board API

    -   createBoard
    -   readOrgBoards
    -   updateBoard
    -   deleteBoard

-   Task API
    -   createTask
    -   readTasks
    -   updateTask
    -   deleteTask
