import {
  CustomPropertyType,
  ICustomSelectionOption,
  ISelectionCustomTypeMeta,
  SelectionResourceTypes,
} from "../../../mongo/custom-property/definitions";
import { InvalidInputError } from "../../../utilities/errors";
import { cast, getDate } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import { InvalidRequestError } from "../../errors";
import canReadOrganization from "../../organizations/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import CustomDataQueries from "../CustomDataQueries";
import {
  CustomSelectionOptionDoesNotExistError,
  CustomSelectionOptionExistsError,
} from "../errors";
import ToPublicCustomData from "../utils";
import { CreateCustomSelectionOptionEndpoint } from "./types";
import { createCustomSelectionOptionJoiSchema } from "./validation";

const createOption: CreateCustomSelectionOptionEndpoint = async (
  context,
  instData
) => {
  const data = validate(instData.data, createCustomSelectionOptionJoiSchema);
  const user = await context.session.getUser(context, instData);
  const property = await context.data.customProperty.assertGetItem(
    ReusableDataQueries.byId(data.propertyId)
  );

  canReadOrganization(property.organizationId, user);

  if (property.type !== CustomPropertyType.Selection) {
    throw new InvalidRequestError();
  }

  const meta = cast<ISelectionCustomTypeMeta>(property.meta);

  if (meta.type !== SelectionResourceTypes.CustomOptions) {
    throw new InvalidRequestError();
  }

  if (meta.areCustomOptionsUnique) {
    const optionExists = await context.data.customOption.checkItemExists(
      ReusableDataQueries.byName(data.data.name)
    );

    if (optionExists) {
      throw new CustomSelectionOptionExistsError();
    }
  }

  // TODO: should we check if prev and next IDs exist?
  let prevOption: ICustomSelectionOption | null = null;
  let nextOptionId: string | null = null;
  const optionId = getNewId();

  if (data.data.prevOptionId) {
    prevOption = await context.data.customOption.getItem(
      ReusableDataQueries.byId(data.data.prevOptionId)
    );

    if (!prevOption) {
      throw new CustomSelectionOptionDoesNotExistError({
        message: "previous option does not exist",
      });
    }

    // TODO: move this save to after the option has been saved
    nextOptionId = prevOption?.nextOptionId;
    await context.data.customOption.updateItem(
      ReusableDataQueries.byId(prevOption.customId),
      {
        nextOptionId: optionId,
      }
    );
  } else {
    const hasOptions = await context.data.customOption.checkItemExists(
      CustomDataQueries.byParentAndPropertyId(property.parent, data.propertyId)
    );

    if (hasOptions) {
      throw new InvalidInputError({
        message: "prevOptionId not provided",
      });
    }
  }

  const newOption: ICustomSelectionOption = {
    customId: optionId,
    name: data.data.name,
    description: data.data.description,
    parent: property.parent,
    propertyId: property.customId,
    color: data.data.color,
    createdBy: user.customId,
    createdAt: getDate(),
    prevOptionId: data.data.prevOptionId,
    nextOptionId: nextOptionId,
    organizationId: property.organizationId,
  };

  const savedOption = await context.data.customOption.saveItem(newOption);

  return {
    option: ToPublicCustomData.customOption(savedOption),
  };
};

export default createOption;
