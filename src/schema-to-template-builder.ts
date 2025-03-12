export interface SimpleJSONSchema {
  type?: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  description?: string;
  properties?: Record<string, SimpleJSONSchema>;
  items?: SimpleJSONSchema;
}

/**
 * SchemaToTemplateBuilder
 *
 * Converts JSON schemas to markdown templates
 */
export class SchemaToTemplateBuilder {
  /**
   * Converts a JSON schema to markdown
   *
   * @param schema - The JSON schema to convert
   * @param level - The heading level to start from
   * @param parentKey - The key of the parent property
   * @returns The generated markdown
   */
  private schemaToMarkdown(
    schema: SimpleJSONSchema | null | undefined,
    level: number,
    parentKey?: string,
  ): string {
    if (!schema) return '';

    const indent = '#'.repeat(level);
    let markdown = '';

    switch (schema.type) {
      case 'object': {
        const properties = schema.properties || {};
        for (const key of Object.keys(properties)) {
          markdown += `\n\n${indent} ${key}\n`;
          markdown += this.schemaToMarkdown(properties[key], level + 1, key);
        }
        break;
      }

      case 'array': {
        if (schema.items) {
          [1, 2].forEach((index: number) => {
            markdown += `\n\n${indent} item ${index}\n\n`;
            markdown += this.schemaToMarkdown(schema.items, level + 1);
          });
          if (parentKey) {
            markdown += `\n\n... repeat for each ${parentKey.replace(/ies$/, 'y').replace(/s$/, '')}`;
          }
        }
        break;
      }

      case 'string': {
        markdown += `\n${schema.description}\n\n`;
        break;
      }

      default: {
        markdown += `\n${schema.description}\n\n`;
      }
    }

    return markdown.trim();
  }

  /**
   * Creates a markdown template from a JSON schema
   *
   * @param schema - The JSON schema to convert
   * @returns The generated markdown template
   */
  createTemplateFromSchema(
    schema: SimpleJSONSchema | null | undefined,
  ): string {
    return this.schemaToMarkdown(schema, 1);
  }
}

export default SchemaToTemplateBuilder;
