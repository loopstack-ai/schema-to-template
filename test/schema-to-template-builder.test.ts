import { describe, it, expect, beforeEach } from 'vitest';
import { SchemaToTemplateBuilder, SimpleJSONSchema } from '../src/schema-to-template-builder.js';

describe('SchemaToTemplateBuilder', () => {
  let builder: SchemaToTemplateBuilder;

  beforeEach(() => {
    builder = new SchemaToTemplateBuilder();
  });

  describe('createTemplateFromSchema', () => {
    it('should convert a simple string schema', () => {
      const schema: SimpleJSONSchema = {
        type: 'string',
        description: 'This is a simple string field'
      };

      const result = builder.createTemplateFromSchema(schema);
      expect(result).toBe('This is a simple string field');
    });

    it('should convert an object schema with properties', () => {
      const schema: SimpleJSONSchema = {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the user'
          },
          age: {
            type: 'number',
            description: 'The age of the user'
          }
        }
      };

      const result = builder.createTemplateFromSchema(schema);
      expect(result).toContain('# name');
      expect(result).toContain('The name of the user');
      expect(result).toContain('# age');
      expect(result).toContain('The age of the user');
    });

    it('should convert an array schema', () => {
      const schema: SimpleJSONSchema = {
        type: 'array',
        items: {
          type: 'string',
          description: 'A tag for the item'
        }
      };

      const result = builder.createTemplateFromSchema(schema);
      expect(result).toContain('# item 1');
      expect(result).toContain('# item 2');
      expect(result).toContain('A tag for the item');
    });

    it('should handle nested objects', () => {
      const schema: SimpleJSONSchema = {
        type: 'object',
        properties: {
          user: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'The name of the user'
              },
              address: {
                type: 'object',
                properties: {
                  street: {
                    type: 'string',
                    description: 'The street name'
                  },
                  city: {
                    type: 'string',
                    description: 'The city name'
                  }
                }
              }
            }
          }
        }
      };

      const result = builder.createTemplateFromSchema(schema);
      expect(result).toContain('# user');
      expect(result).toContain('## name');
      expect(result).toContain('## address');
      expect(result).toContain('### street');
      expect(result).toContain('### city');
      expect(result).toContain('The street name');
      expect(result).toContain('The city name');
    });

    it('should handle arrays of objects', () => {
      const schema: SimpleJSONSchema = {
        type: 'object',
        properties: {
          users: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'The name of the user'
                },
                age: {
                  type: 'number',
                  description: 'The age of the user'
                }
              }
            }
          }
        }
      };

      const result = builder.createTemplateFromSchema(schema);
      expect(result).toContain('# users');
      expect(result).toContain('## item 1');
      expect(result).toContain('## item 2');
      expect(result).toContain('### name');
      expect(result).toContain('### age');
      expect(result).toContain('... repeat for each user');
    });

    it('should correctly format plurals in repeat message', () => {
      const testCases = [
        {
          key: 'users',
          expected: '... repeat for each user'
        },
        {
          key: 'entries',
          expected: '... repeat for each entry'
        },
        {
          key: 'categories',
          expected: '... repeat for each category'
        },
        {
          key: 'items',
          expected: '... repeat for each item'
        }
      ];

      for (const { key, expected } of testCases) {
        const schema: SimpleJSONSchema = {
          type: 'object',
          properties: {
            [key]: {
              type: 'array',
              items: {
                type: 'string',
                description: 'A simple item'
              }
            }
          }
        };

        const result = builder.createTemplateFromSchema(schema);
        expect(result).toContain(expected);
      }
    });

    it('should handle null or undefined schema', () => {
      expect(builder.createTemplateFromSchema(null)).toBe('');
      expect(builder.createTemplateFromSchema(undefined)).toBe('');
    });

    it('should handle empty object schema', () => {
      const schema: SimpleJSONSchema = {
        type: 'object',
        properties: {}
      };

      expect(builder.createTemplateFromSchema(schema)).toBe('');
    });
  });
});