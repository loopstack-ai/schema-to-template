# Schema to Template

A lightweight TypeScript utility for converting JSON schemas to markdown templates.

Related to [loopstack-ai/markdown-parser](https://github.com/loopstack-ai/markdown-parser).

## Features

- Convert JSON schemas to markdown templates
- Support for nested objects and arrays
- Great for use in llm prompts to provide a response template
- Use in combination with [loopstack-ai/markdown-parser](https://github.com/loopstack-ai/markdown-parser) for parsing the response back to a structured object.

## Installation

```bash
npm install @loopstack/schema-to-template
```

## Usage

```typescript
import { SchemaToTemplateBuilder, JSONSchemaConfigType } from '@loopstack/schema-to-template';

// Create an instance of the builder
const builder = new SchemaToTemplateBuilder();

// Define your JSON schema
const schema: JSONSchemaConfigType = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name of the user'
        },
        email: {
          type: 'string',
          description: 'The email address of the user'
        },
        roles: {
          type: 'array',
          items: {
            type: 'string',
            description: 'A user role'
          }
        }
      }
    }
  }
};

// Convert the schema to a markdown template
const markdownTemplate = builder.createTemplateFromSchema(schema);
console.log(markdownTemplate);
```

Output:

```markdown
# user

## name

The name of the user

## email

The email address of the user

## roles

### item 1

A user role

### item 2

A user role

... repeat for each role
```

## API

### `SchemaToTemplateBuilder`

The main class that handles conversion of JSON schemas to markdown templates.

#### Methods

- `createTemplateFromSchema(schema: JSONSchemaConfigType | null | undefined): string`  
  Converts a JSON schema to a markdown template

- `schemaToMarkdown(schema: JSONSchemaConfigType | null | undefined, level: number, parentKey?: string): string`  
  Internal method that handles the conversion recursively

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests with watch mode
npm run test:watch

# Build the package
npm run build
```

## Author

**Jakob Klippel**  
LinkedIn: [Jakob Klippel](https://www.linkedin.com/in/jakob-klippel-414a30261/)

## License

MIT