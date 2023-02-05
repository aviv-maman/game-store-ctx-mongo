import { GValidator, GValidators, IForm } from 'gform-react';

const baseValidations = new GValidator()
  .withRequiredMessage('this field is required')
  .withMinLengthMessage((input) => `${input.formKey} must contain at least 8 chars`);

export const validators: GValidators<IForm> = {
  email: baseValidations,
  fullName: baseValidations,
  password: new GValidator(baseValidations)
    // .withCustomValidation((input) => {
    //   input.errorText = `${input.formKey} must contain special char`;
    //   return /[^a-zA-Z0-9]+/;
    // })
    .withCustomValidation((input, key, fields) => {
      fields.confirmPassword.checkValidity(); //update the validation state on both inputs

      input.errorText = `passwords don't match`;
      return fields.confirmPassword.value !== fields.password.value;
    }),
  confirmPassword: new GValidator(baseValidations).withCustomValidation((input, key, fields) => {
    fields.password.checkValidity();

    input.errorText = `passwords don't match`;
    return fields.confirmPassword.value !== fields.password.value;
  }),
};
