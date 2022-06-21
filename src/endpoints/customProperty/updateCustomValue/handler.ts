import {
  CustomPropertyType,
  CustomValueAttrs,
  ICustomPropertyValue,
} from "../../../mongo/custom-property/definitions";
import { IUser } from "../../../mongo/user";
import { getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { IBaseContext } from "../../contexts/IBaseContext";
import canReadOrganization from "../../organizations/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import { IUpdateComplexTypeArrayInput } from "../../types";
import CustomDataQueries from "../CustomDataQueries";
import ToPublicCustomData from "../utils";
import { UpdateCustomValueEndpoint } from "./types";
import { updateValueEndpointJoiSchema } from "./validation";

function isSelection(
  type: CustomPropertyType,
  value: any
): value is IUpdateComplexTypeArrayInput<string> {
  return type === CustomPropertyType.Selection;
}

async function updateSelectionValues(
  context: IBaseContext,
  user: IUser,
  value: ICustomPropertyValue,
  input: IUpdateComplexTypeArrayInput<string>
) {
  // TODO: validate that the options exist

  if (input?.add.length > 0) {
    await context.data.entityAttrValue.bulkSaveItems(
      input.add.map((item) => ({
        attribute: CustomValueAttrs.SelectionValue,
        createdAt: getDate(),
        createdBy: user.customId,
        customId: getNewId(),
        entityId: value.customId,
        value: item,
      }))
    );
  }

  if (input?.update.length > 0) {
    await context.data.entityAttrValue.bulkUpdateItems(
      input.update.map((item) => ({
        filter: CustomDataQueries.bySelectionEntityAttrAndValue(
          value.customId,
          item
        ),
        data: {
          updatedAt: getDate(),
          updatedBy: user.customId,
          value: item,
        },
        updateFirstItemOnly: true,
      }))
    );
  }

  if (input?.remove.length > 0) {
    // TODO: Fix
    // await context.data.entityAttrValue.bulkDeleteItems(
    //     input.update.map((item) => ({
    //         filter: CustomDataQueries.bySelectionEntityAttrAndValue(
    //             value.customId,
    //             item
    //         ),
    //         deleteFirstItemOnly: true,
    //     }))
    // );
    // await context.data.entityAttrValue.deleteManyItems(
    //     input.update.map((item) => ({
    //         filter: CustomDataQueries.bySelectionEntityAttrAndValue(
    //             value.customId,
    //             item
    //         ),
    //         deleteFirstItemOnly: true,
    //     }))
    // );
  }
}

const updateCustomValue: UpdateCustomValueEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, updateValueEndpointJoiSchema);
  const user = await context.session.getUser(context, instData);
  const value = await context.data.customValue.assertGetItem(
    ReusableDataQueries.byId(data.customId)
  );

  canReadOrganization(value.organizationId, user);

  // TODO: validate property and type constraints

  const savedValue = await context.data.customValue.assertUpdateItem(
    ReusableDataQueries.byId(value.customId),
    {
      value: isSelection(value.type, data.data)
        ? null
        : (data.data.value as ICustomPropertyValue["value"]),
      updatedAt: getDate(),
      updatedBy: user.customId,
    }
  );

  if (isSelection(value.type, data.data.value)) {
    await updateSelectionValues(context, user, savedValue, data.data.value);
  }

  return {
    value: ToPublicCustomData.customValue(savedValue),
  };
};

export default updateCustomValue;
