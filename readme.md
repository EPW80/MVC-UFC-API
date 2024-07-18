# MVC UFC API

A TypeScript project with MVC architecture for fetching and displaying UFC fighter and event information. This project uses Axios for HTTP requests and Cheerio for parsing HTML.

## Features

- Fetch UFC fighter details from Sherdog and UFC.
- Fetch and display UFC event details.
- Use TypeScript for static type checking.
- Follow MVC architecture.

## Project Structure

```
mvc-ufc-api/
├── dist/
├── node_modules/
├── src/
│   ├── controllers/
│   │   ├── EventController.ts
│   │   ├── FighterController.ts
│   ├── models/
│   │   ├── EventModel.ts
│   │   ├── FighterModel.ts
│   ├── views/
│   ├── index.ts
├── .gitignore
├── package.json
├── tsconfig.json
├── README.md
```

## Installation

Clone the repository:

```
git clone 
cd into project
```

Install dependencies:

```
npm install
```

## Usage

Start the application:

```
npm start
```

Build the project:

```
npm run build
```

## Scripts

- start: Run the application using ts-node.
- build: Compile the TypeScript code into JavaScript.
- test: Placeholder for running tests (no tests specified currently).

## API Endpoints

### Get Fighter Details

- Endpoint: /fighter/:query
- Method: GET
- Description: Fetches fighter details from Sherdog and UFC.
- Parameters:
- query: Name of the fighter.

### Get Upcoming Events

- Endpoint: /events/upcoming
- Method: GET
- Description: Fetches upcoming UFC events.

### Get Event Details

- Endpoint: /event/:query
- Method: GET
- Description: Fetches details of a specific UFC event.
- Parameters:
- query: Name or identifier of the event.

### Dependencies

- axios: ^1.7.2
- cheerio: ^1.0.0-rc.12

### Dev Dependencies

- @types/cheerio: ^0.22.31
- @types/node: ^20.3.1
- ts-node: ^10.9.1
- typescript: ^5.1.6

## Demo

[Loom](https://www.loom.com/share/d074ff01311d4042bf38dda2642fe6bf?sid=c04bce09-b46c-4cf0-963a-731867cde530)

## Contributor

Erik Williams
