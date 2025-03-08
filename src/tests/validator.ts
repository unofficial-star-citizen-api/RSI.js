import * as fs from 'fs';
import * as path from 'path';
import Ajv from 'ajv';

export function assertValidSchema(data: any, schemaFile: string): void {
  // Load schema from file
  const schemaPath = path.join(__dirname, 'schemas', schemaFile);

  // In a real implementation, you would validate against the schema
  // This is a simplified version that just checks if the file exists
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema file not found: ${schemaFile}`);
  }

  // Read and parse the schema file
  const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
  const schema = JSON.parse(schemaContent);

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
        `${err.instancePath} ${err.message}`
    ).join('\n');

    throw new Error(`Schema validation failed:\n${errors}`);
  }
}
