import { TextInput } from '@/components/text-input';

interface ValidationResult {
  isValid: boolean;
  data: Record<string, string>;
}

export function validateAndCollectData(fields: TextInput[]): ValidationResult {
  let isFormValid = true;
  const formData: Record<string, string> = {};

  fields.forEach(field => {
    if (!field.validate()) {
      isFormValid = false;
    }

    formData[field.name] = field.value();
  });

  return {
    isValid: isFormValid,
    data: formData,
  };
}
