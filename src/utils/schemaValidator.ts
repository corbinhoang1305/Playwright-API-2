import Ajv, { JSONSchemaType, ValidateFunction } from 'ajv';
import addFormats from 'ajv-formats';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Schema validator using Ajv
 */
class SchemaValidator {
  private ajv: Ajv;
  private schemas: Map<string, ValidateFunction>;
  private schemasDir: string;

  constructor() {
    this.ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(this.ajv);
    this.schemas = new Map();
    this.schemasDir = path.join(process.cwd(), 'data', 'schemas');
    
    // Load all schemas on initialization
    this.loadSchemas();
  }

  /**
   * Load all JSON schema files from data/schemas directory
   */
  private loadSchemas(): void {
    if (!fs.existsSync(this.schemasDir)) {
      console.warn(`⚠️  Schemas directory not found: ${this.schemasDir}`);
      return;
    }

    const files = fs.readdirSync(this.schemasDir);
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const schemaPath = path.join(this.schemasDir, file);
        const schemaContent = fs.readFileSync(schemaPath, 'utf-8');
        const schema = JSON.parse(schemaContent);
        const schemaKey = file.replace('.schema.json', '');
        
        try {
          const validator = this.ajv.compile(schema);
          this.schemas.set(schemaKey, validator);
          console.log(`✅ Loaded schema: ${schemaKey}`);
        } catch (error) {
          console.error(`❌ Failed to compile schema ${schemaKey}:`, error);
        }
      }
    }
  }

  /**
   * Validate data against a schema
   */
  validate(schemaKey: string, data: any): { valid: boolean; errors?: string[] } {
    const validator = this.schemas.get(schemaKey);
    
    if (!validator) {
      throw new Error(`Schema not found: ${schemaKey}. Available schemas: ${Array.from(this.schemas.keys()).join(', ')}`);
    }

    const valid = validator(data);
    
    if (!valid && validator.errors) {
      const errors = validator.errors.map(err => {
        const path = err.instancePath || 'root';
        return `${path}: ${err.message}`;
      });
      return { valid: false, errors };
    }

    return { valid: true };
  }

  /**
   * Get available schema keys
   */
  getAvailableSchemas(): string[] {
    return Array.from(this.schemas.keys());
  }

  /**
   * Add a schema dynamically
   */
  addSchema(schemaKey: string, schema: any): void {
    const validator = this.ajv.compile(schema);
    this.schemas.set(schemaKey, validator);
  }
}

// Singleton instance
const schemaValidator = new SchemaValidator();

/**
 * Validate data against a schema
 */
export function validateSchema(schemaKey: string, data: any): { valid: boolean; errors?: string[] } {
  return schemaValidator.validate(schemaKey, data);
}

/**
 * Assert that data matches schema (throws on failure)
 */
export function assertSchema(schemaKey: string, data: any): void {
  const result = schemaValidator.validate(schemaKey, data);
  
  if (!result.valid) {
    const errorMessages = result.errors?.join('\n  - ') || 'Unknown validation error';
    throw new Error(`Schema validation failed for '${schemaKey}':\n  - ${errorMessages}`);
  }
}

/**
 * Get available schemas
 */
export function getAvailableSchemas(): string[] {
  return schemaValidator.getAvailableSchemas();
}

/**
 * Export validator instance for advanced usage
 */
export { schemaValidator };

