import { BlockType } from "../../../mongo/block";
import {
  CustomPropertyType,
  ICustomProperty,
  ISelectionCustomTypeMeta,
  ITextCustomTypeMeta,
} from "../../../mongo/custom-property/definitions";
import { InvalidInputError } from "../../../utilities/errors";
import { cast, getDate, same } from "../../../utilities/fns";
import getNewId from "../../../utilities/getNewId";
import { validate } from "../../../utilities/joiUtils";
import canReadOrganization from "../../organizations/canReadBlock";
import ReusableDataQueries from "../../ReuseableDataQueries";
import { CustomPropertyExistsError } from "../errors";
import ToPublicCustomData from "../utils";
import {
  CreatePropertyEndpoint,
  ICreatePropertyEndpointParamsFields,
} from "./types";
import { createPropertyJoiSchema } from "./validation";

function checkCustomTextMeta(meta: ITextCustomTypeMeta): ITextCustomTypeMeta {
  if (meta.defaultText) {
    if (meta.minChars && meta.minChars > meta.defaultText.length) {
      // TODO
      throw new InvalidInputError({
        message: `Default text is less than the provided minimum of ${meta.minChars} characters`,
        field: same<ICreatePropertyEndpointParamsFields>(
          "property.meta.defaultText"
        ),
      });
    }

    if (meta.maxChars && meta.maxChars > meta.defaultText.length) {
      throw new InvalidInputError({
        message: `Default text is more than the provided maximum of ${meta.minChars} characters`,
        field: same<ICreatePropertyEndpointParamsFields>(
          "property.meta.defaultText"
        ),
      });
    }
  }

  return meta;
}

const createProperty: CreatePropertyEndpoint = async (context, instData) => {
  const data = validate(instData.data, createPropertyJoiSchema);
  const user = await context.session.getUser(context, instData);
  const parent = await context.block.assertGetBlockById(
    context,
    data.parent.customId
  );

  if (parent.type !== cast<BlockType>(data.parent.type)) {
    throw new InvalidInputError();
  }

  canReadOrganization(parent.rootBlockId || parent.customId, user);
  const propertyExists = await context.data.customProperty.checkItemExists(
    ReusableDataQueries.byName(data.property.name)
  );

  if (propertyExists) {
    throw new CustomPropertyExistsError();
  }

  if (data.property.type === CustomPropertyType.Selection) {
    const meta = cast<ISelectionCustomTypeMeta>(data.property.meta);

    if (meta.selectFrom) {
      await context.block.assertBlockById(context, meta.selectFrom.customId);
    }
  } else if (data.property.type === CustomPropertyType.Text) {
    checkCustomTextMeta(cast<ITextCustomTypeMeta>(data.property.meta));
  }

  const property: ICustomProperty = {
    customId: getNewId(),
    name: data.property.name,
    description: data.property.description,
    parent: data.parent,
    type: data.property.type,
    isRequired: data.property.isRequired,
    meta: data.property.meta,
    createdBy: user.customId,
    createdAt: getDate(),
    organizationId: parent.rootBlockId || parent.customId,
  };

  const savedProperty = await context.data.customProperty.saveItem(property);

  return {
    property: ToPublicCustomData.customProperty(savedProperty),
  };
};

export default createProperty;
