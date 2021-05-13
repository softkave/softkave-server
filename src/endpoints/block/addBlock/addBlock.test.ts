// import { IBlock } from "../../../mongo/block";
// import cast from "../../../utilities/fns";
// import getNewId from "../../../utilities/getNewId";
// import {
//     getTestBaseContext,
//     getTestExpressRequestData,
//     setupTestEnvVariables,
// } from "../../testUtils";
// import manualProcessInternalAddBlockInput from "../internalAddBlock/manualProcessInternalAddBlockInput";
// import addBlock from "./addBlock";
// import { IAddBlockContext } from "./types";

// const testBlockCustomId = "test-id";

// function setupAddBlockContext() {}

// beforeAll(() => {
//     setupTestEnvVariables();
// });

// test("save new org", async () => {
//     const context = cast<IAddBlockContext>(await getTestBaseContext());
//     const instData = await getTestExpressRequestData();
//     const user = await context.session.getUser(context, instData);

//     context.addBlock = async (unused, data) => {
//         const block1 = manualProcessInternalAddBlockInput(
//             data.data.block,
//             user
//         );
//         const block2 = cast<IBlock>(block1);

//         block2.customId = testBlockCustomId;
//         return { block: block2 };
//     };

//     await expect(addBlock(context, instData)).resolves.toMatchObject({
//         block: {},
//     });
// });

// test("save new board", async () => {
//     const context = getTestBaseContext();
//     const instData = getTestExpressRequestData();

//     // await expect(addBlock(context, instData)).resolves.toMatchObject({
//     //     block: {},
//     // });
// });

// test("save new task", async () => {
//     const context = getTestBaseContext();
//     const instData = getTestExpressRequestData();

//     // await expect(addBlock(context, instData)).resolves.toMatchObject({
//     //     block: {},
//     // });
// });
