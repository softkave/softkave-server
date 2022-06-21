import Joi from "joi";
import { BlockType } from "../../mongo/block";
import {
  CustomPropertyType,
  NumberTypes,
  SelectionResourceTypes,
  TextResourceTypes,
} from "../../mongo/custom-property/definitions";
import { validationSchemas } from "../../utilities/validationUtils";
import taskValidationSchemas from "../tasks/validation";
import { customPropertyConstants } from "./constants";

const name = Joi.string().max(customPropertyConstants.nameMax);
const description = Joi.string().max(customPropertyConstants.descriptionMax);
const type = Joi.string().valid(
  CustomPropertyType.Text,
  CustomPropertyType.Date,
  CustomPropertyType.Selection,
  CustomPropertyType.Number
);

const isRequired = Joi.bool();
const textResourceType = Joi.string().valid(TextResourceTypes.Text);

const textMeta = Joi.object().keys({
  minChars: Joi.number().min(0).default(0),
  maxChars: Joi.number()
    .max(customPropertyConstants.textMax)
    .default(customPropertyConstants.textMax),
  type: textResourceType.required(),
  defaultText: Joi.string().max(Joi.ref("maxChars")).allow(null),
});

const defaultDate = validationSchemas.iso
  .min(Joi.ref("startDate"))
  .max(Joi.ref("endDate"))
  .allow(null);

const dateMeta = Joi.object().keys({
  isRange: Joi.bool().allow(null),
  startDate: validationSchemas.iso.allow(null),
  endDate: validationSchemas.iso.allow(null),
  defaultStartDate: defaultDate,
  defaultEndDate: defaultDate,
});

const selectionResourceType = Joi.string().valid(
  SelectionResourceTypes.Collaborator,
  SelectionResourceTypes.Board,
  SelectionResourceTypes.Task,
  SelectionResourceTypes.CollaborationRequest,
  SelectionResourceTypes.CustomOptions
);

const customSelectionOption = Joi.object().keys({
  description: description.allow(null),
  name: name.required(),
  color: validationSchemas.color.allow(null),
  prevOptionId: validationSchemas.uuid.allow(null),
  nextOptionId: validationSchemas.uuid.allow(null),
});

const organizationChildrenTypes = Joi.string().valid(
  SelectionResourceTypes.Collaborator,
  SelectionResourceTypes.Board,
  SelectionResourceTypes.CollaborationRequest,
  SelectionResourceTypes.CustomOptions
);

const boardChildrenTypes = Joi.string().valid(
  SelectionResourceTypes.Task,
  SelectionResourceTypes.CustomOptions
);

const selectionMeta = Joi.object().keys({
  // TODO: will the when check work cause we are referencing "selectFrom"
  // which is also referencing type Or should we move the validation to the
  // handler?
  type: selectionResourceType.required().when("selectFrom.type", {
    switch: [
      {
        is: Joi.string().valid(BlockType.Organization),
        then: organizationChildrenTypes.required(),
      },
      {
        is: Joi.string().valid(BlockType.Board),
        then: boardChildrenTypes.required(),
      },
    ],
  }),
  isMultiple: Joi.bool().allow(null),
  min: Joi.number().min(0).default(0),
  max: Joi.number()
    .max(customPropertyConstants.selectionMax)
    .default(customPropertyConstants.selectionMax),
  selectFrom: Joi.object()
    .keys({
      customId: validationSchemas.uuid.required(),
      type: Joi.string()
        .valid(BlockType.Organization, BlockType.Board)
        .required(),
    })
    .when("type", {
      is: Joi.string().valid(SelectionResourceTypes.CustomOptions),
      then: Joi.valid(null),
      otherwise: Joi.required(),
    }),
  customOptionProps: Joi.object()
    .keys({
      areOptionsUnique: Joi.boolean().allow(null),
    })
    .when("type", {
      is: Joi.string().valid(SelectionResourceTypes.CustomOptions),
      then: Joi.required(),
      otherwise: Joi.valid(null),
    }),
  defaultOptionId: validationSchemas.uuid.allow(null),
});

const numberType = Joi.string().valid(
  NumberTypes.Interger,
  NumberTypes.Decimal
);

const numberMeta = Joi.object().keys({
  type: numberType.required(),
  min: Joi.number().allow(null),
  max: Joi.number().allow(null),
  format: Joi.object()
    .keys({
      decimalPlaces: Joi.number().allow(null),
    })
    .allow(null),
  defaultNumber: Joi.number()
    .min(Joi.ref("min"))
    .max(Joi.ref("max"))
    .allow(null),
});

const meta = Joi.object().when("type", {
  switch: [
    {
      is: Joi.string().valid(CustomPropertyType.Text),
      then: textMeta.required(),
    },
    {
      is: Joi.string().valid(CustomPropertyType.Date),
      then: dateMeta.required(),
    },
    {
      is: Joi.string().valid(CustomPropertyType.Selection),
      then: selectionMeta.required(),
    },
    {
      is: Joi.string().valid(CustomPropertyType.Number),
      then: numberMeta.required(),
    },
  ],
});

const textValue = Joi.object().keys({
  value: taskValidationSchemas.description.allow(null),
});

const dateValue = Joi.object().keys({
  date: validationSchemas.iso.allow(null),
  endDate: validationSchemas.iso.allow(null),
});

const selectionValue = Joi.object().keys({
  value: Joi.array()
    .items(validationSchemas.uuid)
    .max(customPropertyConstants.selectionMax),
});

const numberValue = Joi.object().keys({
  value: Joi.number().allow(null),
});

const value = Joi.object().when("type", {
  switch: [
    {
      is: Joi.string().valid(CustomPropertyType.Text),
      then: textValue.required(),
    },
    {
      is: Joi.string().valid(CustomPropertyType.Date),
      then: dateValue.required(),
    },
    {
      is: Joi.string().valid(CustomPropertyType.Selection),
      then: selectionValue.required(),
    },
    {
      is: Joi.string().valid(CustomPropertyType.Number),
      then: numberValue.required(),
    },
  ],
});

const customPropertyValidationSchemas = {
  name,
  description,
  type,
  isRequired,
  textMeta,
  dateMeta,
  selectionMeta,
  numberMeta,
  customSelectionOption,
  textValue,
  dateValue,
  selectionValue,
  numberValue,
  meta,
  value,
};

export default customPropertyValidationSchemas;
