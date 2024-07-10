# Technical assignment Schiphol

## Getting started

### Prerequisites

This project is built using Bun, if you don't have Bun installed you can use the following script to install it:

```
curl -fsSL https://bun.sh/install | bash
```

If you don't want to install bun you can also use `npm` to install the dependencies and run the application.

### Install dependencies

```
bun install
```

### Run the application

```
bun dev
```

### Build and run the production application

```
bun run build && bun start
```

## Project

The application consists of three endpoints:

- `app/routes/_index.tsx`: A html endpoint at `/` which renders the application on the server.
- `app/routes/api.departures.destinations.ts`: A REST API endpoint which loads a list of destinations for all departing flights, this is used to provide the user with search suggestions.
- `app/routes/api.departures.flights.ts`: A REST API endpoint which provides a list of departing flights, filtered and sorted by the provided query parameters.

You will find two custom directories in the `app` directory of this project, each with a specific purpose:

- `app/data`: the data directory contains the raw data used be the server endpoints
- `app/lib`: the lib directory contains all code that is not directly associated with routes, and can be reused across the application. In it you will find three modules.
  - `ui`: which contains all logic which is specifically focused on the user-interface.
  - `departures`: contains all logic which is specifically focused on the departures domain.
  - `utils`: contains some general utility functions which don't fit into either of the above modules, typically it is wise to avoid names like `utils`.

## Approach

This application uses the Remix framework in order to delegate some work, like creating client and server endpoints. Which allowed me to focus on the application itself for this assignement. Originally I used API's such as `useLoaderData`, `useActionData` and `useFetcher`, however, since one of the requirements explicitly stated that `fetch` or `xhr` should be used, I opted to create a small abstraction around the Fetch API.

To create the UI I've used TailwindCSS, which comes out-of-the-box with Remix, and I've intentionally chosen not to create any UI components, since the application is very small and the components would be used only once. Though at scale UI components are a good idea, and make it simpler to maintain and scale the application. At as small scale it would complicate things and increase the time it takes to develop the application.

## Improvements

- Improve user experience and accessibility
  - On a fast internet connection the loading state will flash for a miliseconds. This can be solved by adding a delay to the loading state.
  - The design is very basic and can be improved.
  - Keyboard navigation of the form can be improved, currently it is only possible to navigate it using tabbing, and it should be possible to navigate the search suggestions using up and down arrow keys.
  - Particularly the search and search suggestions are not on par with required a11y standards.
  - The way errors are communicated to the user can be improved. Currently they are all shown in a red highlighted box under the form. However, it would be better to inline validation errors with their associated fields.
- Improve tests
  - Currently the tests are very basic, and only test the core functionality
  - One or more integrations tests should be added to test different flows in the application
  - Endpoints are currently not explicitly tested
