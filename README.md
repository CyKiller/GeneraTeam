# GeneraTeam

GeneraTeam is an innovative platform leveraging LangChain and OpenAI's GPT models to dynamically generate virtual teams capable of handling specific user requests. This system intelligently understands user inputs, clarifies intentions, and assembles a virtual team with hypothetical backgrounds and expertise areas to address the task at hand, facilitating seamless interactions through a chat interface.

## Overview

GeneraTeam integrates OpenAI's GPT for natural language processing and LangChain for workflow management, built on a Node.js and Express backend with MongoDB for data storage. The frontend utilizes HTML, CSS, and JavaScript, offering a user-friendly interface for interacting with the generated teams and managing tasks.

## Features

- **User Request Understanding and Verification**: Utilizes OpenAI's GPT model for initial analysis and clarification of user requests.
- **Dynamic Team Generation**: Generates a virtual team with roles and expertise tailored to the request.
- **Integration and Interaction**: Offers a chat interface for direct interaction between users and their generated team.
- **Feedback Loop**: Implements a feedback mechanism for continuous improvement based on user satisfaction and team performance.

## Getting Started

### Requirements

- Node.js
- MongoDB
- An OpenAI API key for accessing GPT models

### Configuration

- CI/CD Integration (Optional): GeneraTeam supports CI/CD integration for automated testing, building, and deployment. To enable or disable CI/CD features, configure the `ENABLE_CI_CD` environment variable in your `.env` file.
  - `ENABLE_CI_CD=true` to enable CI/CD features.
  - `ENABLE_CI_CD=false` to disable CI/CD features and focus on local development. This is the recommended setting for local development environments.

### Quickstart

1. Clone the GeneraTeam repository.
2. Install dependencies with `npm install`.
3. Configure the required environment variables in a `.env` file. Ensure to set `ENABLE_CI_CD` based on your preference for CI/CD integration.
4. Start the server with `npm start`. Access the application on the specified port in your `.env` file.

### License

Copyright (c) 2024.