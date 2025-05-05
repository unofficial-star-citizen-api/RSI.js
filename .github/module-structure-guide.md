# Module Structure Guide

This document outlines the recommended structure and patterns for creating new modules in the Star Citizen API library. Following these guidelines will ensure consistency across the codebase and make maintaining the project easier.

## Table of Contents

1. [Module Structure](#module-structure)
2. [File Organization](#file-organization)
3. [Coding Patterns](#coding-patterns)
4. [Type Definitions](#type-definitions)
5. [Testing](#testing)
6. [Example: Organization Module](#example-organization-module)

## Module Structure

Each module should be organized in the following structure:

```
src/commands/[module-name]/
  ├── index.ts                    # Exports all module components
  ├── [module-name].ts            # Main module class
  ├── [module-name]-[function].ts # Individual function implementations
  ├── types/                      # Type definitions
  │   ├── index.ts                # Exports all types
  │   └── [type-name].type.ts     # Individual type definitions
  └── tests/                      # Module-specific tests
      ├── [module-name].test.ts   # Test files for each function
      ├── mocks/                  # Mock files for tests
      └── schemas/                # JSON schemas for validation
```

## File Organization

### Main Module Class (`[module-name].ts`)

The main module class serves as an entry point and should:

1. Import all individual function implementations
2. Define a class that exposes these functions as methods
3. Initialize the functions by passing HttpClient in the constructor

Example:
```typescript
import { HttpClient } from 'src/http-client';
import { get as getFunction } from './[module-name]-get';
import { search as searchFunction } from './[module-name]-search';

export class ModuleName {
  public readonly get: ReturnType<typeof getFunction>;
  public readonly search: ReturnType<typeof searchFunction>;

  constructor(httpClient: HttpClient) {
    this.get = getFunction(httpClient);
    this.search = searchFunction(httpClient);
  }
}
```

### Function Implementation Files (`[module-name]-[function].ts`)

Each function should be implemented in its own file:

1. Define a factory function that takes an HttpClient and returns the actual function
2. Include any helper functions in the same file
3. Handle errors appropriately
4. Follow proper TypeScript typing

Example:
```typescript
import { HttpClient } from '../../http-client';
import { ResultType } from './types';

type ReturnFunction = (param: string) => Promise<ResultType>;

export function handleError(error: Error): void {
  // Error handling logic
}

export function functionName(httpClient: HttpClient): ReturnFunction {
  return async function(param: string): Promise<ResultType> {
    // Implementation
  };
}
```

### Index Files (`index.ts`)

Each module should have an index file that exports all components:

```typescript
export * from './[module-name]';
export * from './[module-name]-[function1]';
export * from './[module-name]-[function2]';
export * from './types';
```

## Coding Patterns

### Factory Pattern

Use the factory pattern for creating functions:

```typescript
export function functionName(dependencies): ReturnFunction {
  // Setup code, constants, etc.

  return function actualFunction(params): ReturnType {
    // Implementation
  };
}
```

### Error Handling

Implement consistent error handling:

1. Create specific error handling functions
2. Transform generic errors into more specific ones
3. Include meaningful error messages

## Type Definitions

### Organization

Type definitions should be:

1. Organized in a `types` subdirectory
2. Exported from a types index file
3. Named with consistent conventions (e.g., `[name].type.ts`)
4. Properly documented with comments

Example:
```typescript
// Module specific response type
export type RSIResponse = {
  readonly success: number;
  readonly code: string;
  readonly msg: string;
  readonly data: RSIData;
};

export type RSIData = {
  readonly totalrows: number;
  readonly html: string;
};
```

## Testing

For each module:

1. Create tests in the module's `tests/` directory
2. Test each public function independently
3. Use mocks for HTTP requests
4. Include mock data in `tests/mocks/`
5. Include JSON schemas for validation in `tests/schemas/`
6. Test both success and error cases

### Benefits of Co-located Tests

Placing tests alongside the source code they test offers several advantages:

1. **Discoverability**: Tests are easier to find when examining a module
2. **Cohesion**: Related files stay together, improving understanding of the module
3. **Maintenance**: When updating a module's code, the tests are right there to update as well
4. **Portability**: Modules can be moved or copied with their tests intact
5. **Completeness**: Encourages writing tests for all modules as part of development

Example:
```typescript
describe('ModuleName', () => {
  describe('functionName', () => {
    test('should return expected data', async () => {
      // Setup mocks
      // Call function
      // Assert results
    });

    test('should handle errors properly', async () => {
      // Setup error scenario
      // Ensure error is handled correctly
    });
  });
});
```

## Example: Organization Module

The Organization module is a good example of these patterns:

### Directory Structure

```
src/commands/organization/
  ├── index.ts                     # Exports all module components
  ├── organization.ts              # Main Organization class
  ├── organization-get.ts          # Get organization details implementation
  ├── organization-search.ts       # Search organizations implementation
  ├── organization-search-members.ts # Search org members implementation
  ├── types/
  │   ├── index.ts                 # Exports all types
  │   ├── organization-characteristics.type.ts
  │   ├── organization-description.type.ts
  │   ├── organization-get.request.types.ts
  │   ├── organization-members.types.ts
  │   └── rsi-response.ts
  └── tests/
      ├── organization-get.test.ts
      ├── organization-search.test.ts
      ├── organization-search-members.test.ts
      ├── mocks/
      │   └── organization-description.html
      └── schemas/
          └── organization.json
```

### Main Class Implementation

```typescript
// organization.ts
import { HttpClient } from 'src/http-client';
import { get as getFunction } from './organization-get';
import { search as searchFunction } from './organization-search';
import { searchMembers as searchMembersFunction } from './organization-search-members';

export class Organization
{
  public readonly get: ReturnType<typeof getFunction>;
  public readonly search: ReturnType<typeof searchFunction>;
  public readonly searchMembers: ReturnType<typeof searchMembersFunction>;

  constructor(httpClient: HttpClient)
  {
    this.get = getFunction(httpClient);
    this.search = searchFunction(httpClient);
    this.searchMembers = searchMembersFunction(httpClient);
  }
}
```

### Function Implementation Example

```typescript
// organization-get.ts
import { AxiosError } from 'axios';
import { HttpClient } from '../../http-client';
import { RSIOrganizationDetail } from './types';

type ReturnFunction = (sid: string) => Promise<RSIOrganizationDetail>;

export function handleError(error: AxiosError): void
{
  const sid = error.config?.url?.split('/').pop() ?? 'unknown';
  if (error.response?.status === 404)
  {
    error.message = `Organization "${sid}" not found`;
    throw error;
  }
  // Other error handling
}

export function get(httpClient: HttpClient): ReturnFunction
{
  const urlOrganization = 'https://robertsspaceindustries.com/orgs/{0}';

  return async function (sid: string): Promise<RSIOrganizationDetail>
  {
    const url = urlOrganization.replace('{0}', sid);
    const response = await httpClient.get<string>(url).catch(handleError);
    // Implementation...
  };
}
```

### Testing Example

```typescript
// tests/organization-get.test.ts
import { HttpClient } from '../../http-client';
import { Organization } from '../organization';
import fs from 'fs';
import path from 'path';
import { HttpClientMock } from './mocks/http-client.mock';

describe('Organization with HttpClientMock', () =>
{
  describe('get', () =>
  {
    test('should return organization data', async () =>
    {
      // Create our mock HttpClient
      const httpClientMock = new HttpClientMock();

      // Set up the mock response with data from the module's mocks directory
      httpClientMock.mockResponse(
        'https://robertsspaceindustries.com/orgs/TEST',
        fs.readFileSync(
          path.join(__dirname, 'mocks', 'organization-description.html'),
          'utf8'
        )
      );

      // Create the organization controller with our mock client
      const organization = new Organization(httpClientMock);

      const data = await organization.get('TEST');

      expect(data).not.toBeNull();
      expect(data?.sid).toBe('TEST');
      // Additional assertions
    });
  });
});
```

By following this structure, you'll maintain consistency across the codebase and make it easier for other developers to understand and contribute to your modules.
