# Technical Specifications - Unofficial Star Citizen API (RSI.js)

## 1. Project Overview

The RSI.js library is a TypeScript-based API wrapper for retrieving data from the Roberts Space Industries (RSI) website, the official platform for Star Citizen. This library serves as an interface to scrape and interact with various endpoints of the RSI website, providing a structured way to access Star Citizen data programmatically.

### 1.1 Core Features

- Cross-platform compatibility (Node.js and browser environments)
- Structured TypeScript interfaces for type-safe data retrieval
- Comprehensive coverage of RSI website data endpoints
- HTTP request handling with proxy support
- Extensive error handling and validation

## 2. Architecture

### 2.1 Project Structure

The library is organized in a modular architecture:

```
src/
├── commands/             # Command modules for different RSI endpoints
│   ├── funding-goals/    # Funding goals data
│   ├── organization/     # Organization data and search
│   ├── progress-tracker/ # Progress tracker data
│   ├── roadmap/          # Roadmap data
│   ├── ship/             # Ship data
│   ├── starmap/          # Starmap data (systems, routes, etc.)
│   ├── telemetry/        # Telemetry data
│   ├── user/             # User data
│   └── version/          # Version data
├── helpers/              # Helper utilities
├── types/                # TypeScript type definitions
├── http-client.ts        # HTTP client for making requests
├── index.ts              # Main export file
└── rsi.ts                # Main RSI class
```

### 2.2 Core Components

- **RSI Class**: Main entry point for accessing all API features
- **HttpClient**: Handles HTTP requests with proxy support
- **Command Modules**: Individual modules for each RSI website section
- **Type Definitions**: TypeScript interfaces for data structures

## 3. Technical Details

### 3.1 Dependencies

#### Production Dependencies
- **axios**: HTTP client for API requests
- **cheerio**: HTML parsing and DOM manipulation
- **ajv**: JSON schema validation
- **http-proxy-agent**, **https-proxy-agent**, **socks-proxy-agent**: Proxy support

#### Development Dependencies
- **TypeScript**: Static typing and compilation
- **Rollup**: Module bundler
- **Jest**: Testing framework
- **ESLint**: Code linting

### 3.2 Build System

- **Rollup**: Used for bundling with the following configurations:
  - CommonJS format (for Node.js)
  - ES Module format (for modern bundlers)
  - UMD format (for browser compatibility)
- **TypeScript**: Configured with strict type checking and ES2018 target
- **Declaration Files**: Generated during build process for TypeScript compatibility

### 3.3 Module Formats

The library supports multiple module formats:
- **CommonJS**: `dist/index.js`
- **ES Modules**: `dist/index.esm.js`
- **UMD (Browser)**: `dist/index.browser.js`
- **TypeScript Declarations**: `dist/index.d.ts`

## 4. API Structure

### 4.1 Main RSI Class

```typescript
export class RSI {
  public readonly httpClient: HttpClient;
  public readonly user: User;
  public readonly organization: Organization;
  public readonly progressTracker: ProgressTracker;
  public readonly roadmap: Roadmap;
  public readonly ships: Ship;
  public readonly starmap: Starmap;
  public readonly fundingGoals: FundingGoals;
  public readonly telemetry: Telemetry;
  public readonly version: Version;

  constructor(config: RSIConfig = {}) {
    // Initialize modules with HTTP client
  }
}
```

### 4.2 Available Features

- **User**: Retrieve user profiles and data
- **Organization**: Get organization details and search members
- **Progress Tracker**: Access development progress information
- **Roadmap**: Retrieve Star Citizen roadmap data
- **Ships**: Get ship specifications and details
- **Starmap**: Access the Star Citizen universe map data
  - Star Systems
  - Celestial Objects
  - Routes
  - Species
  - Tunnels
  - Affiliations
- **Funding Goals**: Access funding goal information
- **Telemetry**: Retrieve performance telemetry data
- **Version**: Get version information for Star Citizen

### 4.3 HTTP Client

The `HttpClient` class provides robust HTTP request capabilities:
- Support for HTTP, HTTPS, and SOCKS proxies
- Environment variable configuration
- Configurable user agent
- Proxy bypass patterns via NO_PROXY
- Automatic URL resolution

## 5. Testing Strategy

### 5.1 Test Framework

- **Jest**: Used for unit and integration testing
- **Mock Data**: HTML responses from RSI website stored as test fixtures

### 5.2 Testing Approach

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test communication between components
- **Mock HTTP Client**: Simulate RSI website responses for predictable testing
- **Schema Validation**: Validate response formats against predefined schemas

### 5.3 Test Coverage

Tests are organized to mirror the source structure:
```
tests/
├── organization/          # Organization-related tests
├── progress-tracker/      # Progress tracker tests
├── mocks/                 # Mock HTTP responses
├── schemas/               # JSON schemas for validation
├── utils/                 # Test utilities
```

## 6. Development Guidelines

### 6.1 Code Style

- Strict TypeScript usage with comprehensive type definitions
- ESLint for consistent code style enforcement
- Modular architecture with clear separation of concerns

### 6.2 Git Workflow

- Feature branches for new development
- Pull requests for code review
- GitHub Actions for CI/CD pipeline

### 6.3 Build and Test Process

```bash
# Install dependencies
npm install

# Development with watch mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## 7. Deployment and Publishing

- Package published to GitHub Packages registry
- Semantic versioning for releases
- Automatic build during package installation via prepare script

## 8. Browser Compatibility

The library is designed to work in both Node.js and modern browsers with the following considerations:
- Browser bundle provided via UMD format
- DOM interactions handled through cheerio
- Proxy support primarily for Node.js environment

## 9. Security Considerations

- No authentication credentials stored in the library
- Proxy support for anonymizing requests
- Dependency security auditing through npm

## 10. Future Development

Potential areas for enhancement:
- Additional RSI website endpoints as they become available
- WebSocket support for real-time data
- Rate limiting and caching mechanisms
- Authentication support for accessing private RSI data