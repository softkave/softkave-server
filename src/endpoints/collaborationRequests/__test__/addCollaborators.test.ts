import { getTestBaseContext } from "../../testUtils/contexts/TestBaseContext";
import { chance } from "../../testUtils/data/data";
import { setupTestExpressRequestWithToken } from "../../testUtils/setupTestExpressRequest";
import { setupTestUser } from "../../testUtils/setupTestUser";
import { setupTestCollaborationRequestWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestCollaborationRequestWithEndpoint";
import { setupTestOrganizationWithEndpoint } from "../../testUtils/setupWithEndpoint/setupTestOrganizationWithEndpoint";
import { INewCollaboratorInput } from "../addCollaborators/types";

const context = getTestBaseContext();

describe("add collaborators", () => {
    test("can add collaborators", async () => {
        const { token } = await setupTestUser(context);
        const { req } = setupTestExpressRequestWithToken({ token });
        const { organization } = await setupTestOrganizationWithEndpoint(
            context,
            req
        );

        const input: INewCollaboratorInput[] = [
            {
                email: chance.email(),
            },
            {
                email: chance.email(),
            },
        ];

        const result = await setupTestCollaborationRequestWithEndpoint(
            context,
            req,
            organization.customId,
            input
        );

        expect(result?.requests).toHaveLength(2);
        expect(result?.requests).toContainEqual({
            to: { email: input[0].email },
        });
        expect(result?.requests).toContainEqual({
            to: { email: input[1].email },
        });

        const requests =
            await context.collaborationRequest.getCollaborationRequestsByBlockId(
                context,
                organization.customId
            );

        expect(requests).toContainEqual({
            to: { email: input[0].email },
        });
        expect(requests).toContainEqual({
            to: { email: input[1].email },
        });
    });
});
