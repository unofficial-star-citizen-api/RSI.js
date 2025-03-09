import Ajv from 'ajv';

export function assertValidSchema(data: any, schema: any): void {
  // Initialize Ajv
  const ajv = new Ajv({
    allErrors: true,
    verbose: true
  });

  // Compile and validate against schema
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const errors = validate.errors?.map(err =>
      `${err.instancePath} ${err.message} actual: ${JSON.stringify(err.data)}`
    ).join('\n');

    throw new Error(`Schema validation failed:\n${errors}`);
  }
}
