# RSI (Roberts Space Industries) Endpoints

This document lists all the endpoints used for scraping data from the Roberts Space Industries website. Each endpoint includes the complete URL, HTTP method, required parameters, and a brief description of its purpose.

## Base URL

All endpoints are based on the following base URL:
```
https://robertsspaceindustries.com
```

## Organizations

### Get Organization Details
- **URL**: `https://robertsspaceindustries.com/orgs/{sid}`
- **Method**: GET
- **Parameters**:
  - `{sid}` (string, required): Organization SID/handle (unique identifier, case-sensitive)
- **Example**: `https://robertsspaceindustries.com/orgs/TEST`
- **Response Format**: HTML page
- **Response Data Model**: [organization.json](../tests/schemas/organization.json)
- **Description**: Retrieves detailed information about a specific organization, including name, logo, banner, focus, commitment level, and member counts.

### Search Organizations
- **URL**: `https://robertsspaceindustries.com/api/orgs/getOrgs`
- **Method**: POST
- **Request Body Parameters**:
  - `activity` (integer, optional): Activity level filter (1-5)
  - `commitment` (string, optional): Commitment level filter (casual, regular, hardcore)
  - `language` (string, optional): Primary language filter
  - `model` (integer, optional): Organization model filter
  - `recruiting` (boolean, optional): Set to true to filter for recruiting organizations only
  - `roleplay` (boolean, optional): Set to true to filter for roleplay organizations only
  - `size` (integer, optional): Size filter (1-5)
  - `search` (string, optional): Search term for organization name
  - `pagesize` (integer, optional, default: 12): Number of results per page
  - `page` (integer, optional, default: 1): Page number
- **Example**:
  ```json
  {
    "pagesize": 32,
    "page": 1,
    "recruiting": true,
    "roleplay": true
  }
  ```
- **Response Format**: JSON
- **Response Data Model**: [organization.json](../tests/schemas/organization.json)
- **Description**: Searches for organizations based on provided criteria with pagination.

### Search Organization Members
- **URL**: `https://robertsspaceindustries.com/api/orgs/getOrgMembers`
- **Method**: POST
- **Request Body Parameters**:
  - `sid` (string, required): Organization SID/handle (unique identifier, case-sensitive)
  - `pagesize` (integer, optional, default: 32): Number of results per page
  - `page` (integer, optional, default: 1): Page number
  - `sort` (string, optional, default: 'handle'): Sort field ('handle' or 'rank')
  - `rank` (array of strings, optional): Filter by specific ranks
  - `search` (string, optional): Search term for member handles
- **Example**:
  ```json
  {
    "sid": "TEST",
    "pagesize": 32,
    "page": 1,
    "sort": "handle"
  }
  ```
- **Response Format**: JSON
- **Response Data Model**: [organization_members.json](../tests/schemas/organization_members.json)
- **Description**: Retrieves members of a specific organization with pagination and filtering options.

## User Profiles

### Get User Profile
- **URL**: `https://robertsspaceindustries.com/citizens/{handle}`
- **Method**: GET
- **Parameters**:
  - `{handle}` (string, required): User handle/nickname (case-sensitive)
- **Example**: `https://robertsspaceindustries.com/citizens/Dymerz`
- **Response Format**: HTML page
- **Response Data Model**: [user.json](../tests/schemas/user.json)
- **Description**: Retrieves a user's public profile information including UEE Citizen Record number, display name, handle name, enlisted date, badge, biography, and location.

### Get User Organization Affiliations
- **URL**: `https://robertsspaceindustries.com/citizens/{handle}/organizations`
- **Method**: GET
- **Parameters**:
  - `{handle}` (string, required): User handle/nickname (case-sensitive)
- **Example**: `https://robertsspaceindustries.com/citizens/Dewderonomy/organizations`
- **Response Format**: HTML page
- **Response Data Model**: [user_organization.json](../tests/schemas/user_organization.json)
- **Description**: Retrieves the organizations a user is affiliated with, including main organization and other affiliations, with details about user's rank and role in each.

## Ships

### Get Ship Matrix
- **URL**: `https://robertsspaceindustries.com/ship-matrix/index`
- **Method**: GET
- **Parameters**: None
- **Response Format**: JSON
- **Response Data Model**: [ship.json](../tests/schemas/ship.json)
- **Description**: Retrieves the complete ship matrix data including all ships and their detailed specifications.

### Search Ships
- **URL**: `https://robertsspaceindustries.com/api/store/getShips`
- **Method**: POST
- **Request Body Parameters**:
  - `name` (string, optional): Ship name search term
  - `classification` (string/array, optional): Ship type/classification (e.g., "fighter", "freighter", "transport")
  - `length_min` (number, optional): Minimum ship length in meters
  - `length_max` (number, optional): Maximum ship length in meters
  - `crew_min` (number, optional): Minimum crew capacity
  - `crew_max` (number, optional): Maximum crew capacity
  - `price_min` (number, optional): Minimum price in USD
  - `price_max` (number, optional): Maximum price in USD
  - `mass_min` (number, optional): Minimum mass in kg
  - `mass_max` (number, optional): Maximum mass in kg
  - `manufacturer` (string/array, optional): Ship manufacturer(s)
  - `focus` (string/array, optional): Ship focus/role
  - `production_status` (string/array, optional): Production status (e.g., "flight-ready", "in-concept")
  - `sort` (string, optional, default: "name"): Sort field ("name", "price", "length", etc.)
  - `direction` (string, optional, default: "ASC"): Sort direction ("ASC" or "DESC")
  - `page` (integer, optional, default: 1): Page number
  - `items` (integer, optional, default: 10): Number of items per page
- **Example**:
  ```json
  {
    "name": "Cutlass Black"
  }
  ```
- **Response Format**: JSON
- **Response Data Model**: [ship.json](../tests/schemas/ship.json)
- **Description**: Searches for ships with specified criteria, supporting filtering, sorting and pagination.

## Starmap

### Search Starmap
- **URL**: `https://robertsspaceindustries.com/api/starmap/find`
- **Method**: POST
- **Request Body Parameters**:
  - `query` (string, required): Search pattern for system or object names
- **Response Format**: JSON with two main sections:
  ```json
  {
    "success": 1,
    "data": {
      "systems": { "resultset": [...] },
      "objects": { "resultset": [...] }
    }
  }
  ```
- **Response Data Model**: [starmap_search.json](../tests/schemas/starmap_search.json)
- **Description**: Searches for celestial objects and star systems matching the search pattern.

### Find Star System
- **URL**: `https://robertsspaceindustries.com/api/starmap/star-systems/{code}`
- **Method**: POST
- **Path Parameters**:
  - `{code}` (string, required): Star system unique code identifier
- **Request Body Parameters**: None
- **Response Format**: JSON with system details
  ```json
  {
    "success": 1,
    "data": {
      "resultset": { /* system data */ }
    }
  }
  ```
- **Response Data Model**: [starmap_star_system.json](../tests/schemas/starmap_star_system.json)
- **Description**: Retrieves detailed information about a specific star system.

### Find Routes
- **URL**: `https://robertsspaceindustries.com/api/starmap/routes/find`
- **Method**: POST
- **Request Body Parameters**:
  - `departure` (string, required): Departure system code
  - `destination` (string, required): Destination system code
  - `ship_size` (string, required): Ship size category ("S" for small, "M" for medium, "L" for large/capital)
- **Example**:
  ```json
  {
    "departure": "STANTON.LZS.LORVILLE",
    "destination": "STANTON.LZS.AREA18",
    "ship_size": "M"
  }
  ```
- **Response Format**: JSON with route options
  ```json
  {
    "success": 1,
    "data": {
      "shortest": [...],
      "leastjumps": [...]
    }
  }
  ```
- **Response Data Model**: [starmap_route_search.json](../tests/schemas/starmap_route_search.json)
- **Description**: Finds navigation routes between two star systems optimized for either shortest distance or fewest jumps.

### Find Celestial Objects
- **URL**: `https://robertsspaceindustries.com/api/starmap/celestial-objects/{code}`
- **Method**: POST
- **Path Parameters**:
  - `{code}` (string, required): Celestial object unique code identifier
- **Example**: `https://robertsspaceindustries.com/api/starmap/celestial-objects/TOHIL.PLANETS.TOHILIII`
- **Request Body Parameters**: None
- **Response Format**: JSON with object details
  ```json
  {
    "success": 1,
    "data": {
      "resultset": { /* object data */ }
    }
  }
  ```
- **Response Data Model**: [starmap_object.json](../tests/schemas/starmap_object.json)
- **Description**: Retrieves detailed information about a specific celestial object (planet, moon, star, etc.).

### Find Affiliations
- **URL**: `https://robertsspaceindustries.com/api/starmap/affiliations/{code}`
- **Method**: POST
- **Path Parameters**:
  - `{code}` (string, required): Affiliation unique code identifier
- **Request Body Parameters**: None
- **Response Format**: JSON with affiliation details
  ```json
  {
    "success": 1,
    "data": {
      "resultset": { /* affiliation data */ }
    }
  }
  ```
- **Response Data Model**: [starmap_affiliation.json](../tests/schemas/starmap_affiliation.json)
- **Description**: Retrieves information about a specific political affiliation or faction.

### Find Species
- **URL**: `https://robertsspaceindustries.com/api/starmap/species/{code}`
- **Method**: POST
- **Path Parameters**:
  - `{code}` (string, required): Species unique code identifier
- **Request Body Parameters**: None
- **Response Format**: JSON with species details
  ```json
  {
    "success": 1,
    "data": {
      "resultset": { /* species data */ }
    }
  }
  ```
- **Response Data Model**: [starmap_species.json](../tests/schemas/starmap_species.json)
- **Description**: Retrieves information about a specific alien species.

### Find All Systems
- **URL**: `https://robertsspaceindustries.com/api/starmap/systems`
- **Method**: POST
- **Request Body Parameters**: None
- **Response Format**: JSON with all systems
  ```json
  {
    "success": 1,
    "data": {
      "resultset": [/* array of systems */]
    }
  }
  ```
- **Response Data Model**: [starmap_systems.json](../tests/schemas/starmap_systems.json)
- **Description**: Retrieves basic information about all star systems in the universe.

### Find Jump Points / Tunnels
- **URL**: `https://robertsspaceindustries.com/api/starmap/tunnels`
- **Method**: POST
- **Request Body Parameters**: None
- **Response Format**: JSON with all tunnels/jump points
  ```json
  {
    "success": 1,
    "data": {
      "resultset": [/* array of tunnels */]
    }
  }
  ```
- **Response Data Model**: [starmap_tunnels.json](../tests/schemas/starmap_tunnels.json)
- **Description**: Retrieves information about all jump points/tunnels between systems in the universe.

## Funding Goals

### Get Crowdfunding Stats
- **URL**: `https://robertsspaceindustries.com/api/stats/getCrowdfundStats`
- **Method**: POST
- **Request Body Parameters**:
  - `chart` (string, required): Chart timeframe ('hour', 'day', 'week', 'month')
  - `alpha_slots` (boolean, required): Set to true to include alpha slots stats
  - `fans` (boolean, required): Set to true to include fans/citizen stats
  - `fleet` (boolean, required): Set to true to include fleet stats
  - `funds` (boolean, required): Set to true to include funding stats
- **Example**:
  ```json
  {
    "chart": "hour",
    "alpha_slots": true,
    "fans": true,
    "fleet": true,
    "funds": true
  }
  ```
- **Response Format**: JSON with statistics
  ```json
  {
    "data": {
      "alpha_slots": {...},
      "chart": [...],
      "fans": {...},
      "fleet": {...},
      "funds": {...}
    }
  }
  ```
- **Response Data Model**: [stats.json](../tests/schemas/stats.json)
- **Description**: Retrieves crowdfunding statistics and goals, including total funds raised, number of citizens, fleets, and historical funding data over the requested timeframe.

## Progress Tracker

### Get Team Deliverables
- **URL**: `https://robertsspaceindustries.com/graphql`
- **Method**: POST
- **Request Body Parameters**:
  - `operationName` (string, required): Must be "deliverables"
  - `query` (string, required): GraphQL query document
  - `variables` (object, required): Variable values for the query
    - `teamSlug` (string, required): The team identifier slug
    - `startDate` (string, required): Start date in format 'YYYY-MM-DD'
    - `endDate` (string, required): End date in format 'YYYY-MM-DD'
    - `search` (string, optional): Search term for deliverables
    - `deliverableSlug` (string, optional): Specific deliverable to retrieve
    - `projectSlugs` (array of strings, optional): Filter by project slugs
    - `categoryIds` (array of integers, optional): Filter by category IDs
    - `sortBy` (string, optional): How to sort the results
    - `offset` (integer, optional, default: 0): Pagination offset
    - `limit` (integer, optional, default: 20): Number of results per page
- **Example**:
  ```json
  {
    "operationName": "deliverables",
    "query": "query deliverables($startDate: String!, $endDate: String!, $teamSlug: String) { progressTracker { deliverables(startDate: $startDate, endDate: $endDate, teamSlug: $teamSlug) { totalCount metaData { uuid slug title description } } } }",
    "variables": {
      "teamSlug": "g42qg07ipfday",
      "startDate": "2020-01-01",
      "endDate": "2022-12-31"
    }
  }
  ```
- **Response Format**: GraphQL JSON response with deliverable data
- **Response Data Model**: [progress_tracker.json](../tests/schemas/progress_tracker.json)
- **GraphQL Operation**: `deliverables`
- **Description**: Retrieves detailed information about team deliverables from the progress tracker, including card data, project associations, and timelines.

### Get Discipline Information for Deliverables
- **URL**: `https://robertsspaceindustries.com/graphql`
- **Method**: POST
- **Request Body Parameters**:
  - `operationName` (string, required): Must be "disciplines"
  - `query` (string, required): GraphQL query document
  - `variables` (object, required): Variable values for the query
    - `teamSlug` (string, required): The team identifier slug
    - `deliverableSlug` (string, required): The deliverable identifier slug
    - `startDate` (string, required): Start date in format 'YYYY-MM-DD'
    - `endDate` (string, required): End date in format 'YYYY-MM-DD'
- **Response Format**: GraphQL JSON response with discipline data
- **Response Data Model**: [progress_tracker_info.json](../tests/schemas/progress_tracker_info.json)
- **GraphQL Operation**: `disciplines`
- **Description**: Retrieves detailed discipline information for specific deliverables, including time allocations, staff counts, and expertise areas.

### Get Teams in Range
- **URL**: `https://robertsspaceindustries.com/graphql`
- **Method**: POST
- **Request Body Parameters**:
  - `operationName` (string, required): Must be "teams"
  - `query` (string, required): GraphQL query document
  - `variables` (object, required): Variable values for the query
    - `startDate` (string, required): Start date in format 'YYYY-MM-DD'
    - `endDate` (string, required): End date in format 'YYYY-MM-DD'
    - `search` (string, optional): Search term for team names
    - `teamSlug` (string, optional): Specific team to retrieve
    - `deliverableSlug` (string, optional): Filter by deliverable slug
    - `projectSlugs` (array of strings, optional): Filter by project slugs
    - `disciplineSlugs` (array of strings, optional): Filter by discipline slugs
    - `sortBy` (string, optional): How to sort the results
    - `offset` (integer, optional, default: 0): Pagination offset
    - `limit` (integer, optional, default: 20): Number of results per page
- **Response Format**: GraphQL JSON response with team data
- **Response Data Model**: [progress_tracker_info.json](../tests/schemas/progress_tracker_info.json)
- **GraphQL Operation**: `teams`
- **Description**: Retrieves detailed information about development teams and their work within a date range, including time allocations, deliverable counts, and team composition.

## Roadmap

### Get Star Citizen Roadmap
- **URL**: `https://robertsspaceindustries.com/api/roadmap/v1/boards/1`
- **Method**: GET
- **Parameters**: None
- **Response Format**: JSON
  ```json
  {
    "success": 1,
    "data": {
      "id": 1,
      "name": "Star Citizen",
      "description": "...",
      "releases": [...],
      "categories": [...]
    }
  }
  ```
- **Response Data Model**: [roadmap_starcitizen.json](../tests/schemas/roadmap_starcitizen.json)
- **Description**: Retrieves the Star Citizen roadmap information, including planned releases, cards (features), and their categories.

### Get Squadron 42 Roadmap
- **URL**: `https://robertsspaceindustries.com/api/roadmap/v1/boards/2`
- **Method**: GET
- **Parameters**: None
- **Response Format**: JSON
  ```json
  {
    "success": 1,
    "data": {
      "id": 2,
      "name": "Squadron 42",
      "description": "...",
      "releases": [...],
      "categories": [...]
    }
  }
  ```
- **Response Data Model**: [roadmap_squadron42.json](../tests/schemas/roadmap_squadron42.json)
- **Description**: Retrieves the Squadron 42 roadmap information, including planned releases, cards (features), and their categories.

## Version Information

### Get Spectrum Version Information
- **URL**: `https://robertsspaceindustries.com/api/spectrum/forum/channel/threads`
- **Method**: POST
- **Request Body Parameters**:
  - `channel_id` (string, required): Must be "190048" for the patch notes channel
  - `page` (integer, required, default: 1): Page number
  - `sort` (string, required): Must be "newest"
  - `label_id` (null, required): Must be null
- **Example**:
  ```json
  {
    "channel_id": "190048",
    "page": 1,
    "sort": "newest",
    "label_id": null
  }
  ```
- **Response Format**: JSON with thread data
  ```json
  {
    "data": {
      "threads": {
        "threads": [...],
        "pagination": {...}
      }
    }
  }
  ```
- **Response Data Model**: [version.json](../tests/schemas/version.json)
- **Description**: Retrieves version information from Spectrum forum posts in the official patch notes channel, where announcement threads for new versions are posted.

### Get Patch Notes
- **URL**: `https://robertsspaceindustries.com/patch-notes`
- **Method**: GET
- **Parameters**: None
- **Response Format**: HTML page
- **Response Data Model**: [patch_notes.json](../tests/schemas/patch_notes.json)
- **Description**: Retrieves all patch notes for the game as an HTML page with links to individual patch note pages. The data must be scraped from the HTML.

### Get Roadmap Version Information from Board
- **URL**: `https://robertsspaceindustries.com/api/roadmap/v1/boards/{boardId}`
- **Method**: GET
- **Path Parameters**:
  - `{boardId}` (integer, required): 1 for Star Citizen, 2 for Squadron 42
- **Response Format**: JSON (same as roadmap board endpoints)
- **Response Data Model**: [version.json](../tests/schemas/version.json)
- **Description**: Retrieves version information from the roadmap board data. Current version information can be extracted from the board description field.

### Get Version Information from Roadmap Init
- **URL**: `https://robertsspaceindustries.com/api/roadmap/v1/init`
- **Method**: GET
- **Parameters**: None
- **Response Format**: JSON
  ```json
  {
    "success": 1,
    "data": {
      "boards": [
        {
          "id": 1,
          "name": "Star Citizen",
          "description": "Live version: 3.22.0..."
        },
        {
          "id": 2,
          "name": "Squadron 42",
          "description": "..."
        }
      ]
    }
  }
  ```
- **Response Data Model**: [version.json](../tests/schemas/version.json)
- **Description**: Retrieves version information from the roadmap initialization data, including live, PTU, and ETF versions. Version strings can be extracted from the description fields using regular expressions.

## Telemetry

### Get Telemetry Data
- **URL**: `https://robertsspaceindustries.com/api/telemetry/v2/community/`
- **Method**: GET
- **Query Parameters**:
  - `timetable` (string, required): Time interval for data aggregation. Must be one of:
    - `DAY`: Daily aggregation
    - `WEEK`: Weekly aggregation
    - `MONTH`: Monthly aggregation
  - `branch` (string, required): Game version in format 'sc-alpha-{version}'. Examples:
    - `sc-alpha-3.18`
    - `sc-alpha-3.19`
    - `sc-alpha-3.20`
    - `sc-alpha-3.21`
    - `sc-alpha-3.22`
    - `sc-alpha-4.0`
- **Response Format**: JSON
  ```json
  {
    "data": {
      "series": [...],
      "series_detail": [...],
      "gpu": [
        {"key": "NVIDIA GeForce RTX 3080", "value": 4.2, "count": 12345},
        /* other GPU models */
      ],
      "cpu": [
        {"key": "AMD Ryzen 9 5900X", "value": 4.5, "count": 5678},
        /* other CPU models */
      ],
      "gpu_enums": [...],
      "cpu_enums": [...],
      "stats": {
        "total_sessions": 123456,
        "unique_users": 78901,
        "total_playtime": 2345678
      }
    }
  }
  ```
- **Response Data Model**: [telemetry.json](../tests/schemas/telemetry.json)
- **Description**: Retrieves detailed community telemetry data for player performance and hardware statistics. Includes:
  - Performance data (FPS) breakdown by hardware combinations
  - Ranking of popular GPUs and CPUs with their average performance
  - Hardware enumeration data for classification
  - Overall usage statistics for the specified time period and game version