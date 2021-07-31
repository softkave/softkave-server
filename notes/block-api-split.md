# Block API Split

## Goal

-   Split the block API into organization, board and task API
-   Seperate collaboration request into its own endpoints
-   Write scripts to populate fields that should be present per block type, including status assigned by from "system" to the creator
    -   Add required/default fields to the block types
    -   Move to new models for orgId and block type org change
    -   snake case models names, not camel case
    -   Change system to either creator or first collaborator
-   Priority to high, medium, low | to number
-   Keep socket updates and remove audit logs
