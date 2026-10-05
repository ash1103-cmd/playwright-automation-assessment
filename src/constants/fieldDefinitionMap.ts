import { UILabel, FieldType } from "./enums";

export interface FieldDefinition {
  label: UILabel;
  fieldType: FieldType;
}

const fieldDefinitionMap: Record<string, FieldDefinition> = {
  [UILabel.Name]: {
    label: UILabel.Name,
    fieldType: FieldType.Input,
  },
  [UILabel.Password]: {
    label: UILabel.Password,
    fieldType: FieldType.Input,
  },
  [UILabel.Email]: {
    label: UILabel.Email,
    fieldType: FieldType.Input,
  },
  [UILabel.Phone]: {
    label: UILabel.Phone,
    fieldType: FieldType.Input,
  },
  [UILabel.TellAbout]: {
    label: UILabel.TellAbout,
    fieldType: FieldType.Textarea,
  },
};

export default fieldDefinitionMap;
