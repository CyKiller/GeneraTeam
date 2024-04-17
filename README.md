# GeneraTeam

GeneraTeam is an innovative platform designed to dynamically generate virtual teams to handle specific user requests. By leveraging the capabilities of LangChain and OpenAI's GPT models, GeneraTeam interprets user inputs to create a tailored team of agents, each with unique profiles and expertise areas, ready to tackle a variety of tasks.

## Overview

The architecture of GeneraTeam integrates OpenAI's GPT for natural language processing and LangChain for workflow management to understand user requests and generate appropriate team members. The backend is built on Node.js and Express, with MongoDB for data persistence. The frontend utilizes HTML, CSS, and JavaScript for a simple and intuitive user experience.

## Features

- **User Request Understanding and Verification**: Utilizes OpenAI's GPT models to interpret and verify user requests.
- **Dynamic Team Generation**: Generates a virtual team with roles and profiles suitable for the user's task.
- **Integration and Interaction**: Offers a chat interface for users to interact with their generated team.
- **Feedback Loop**: Monitors interactions to learn and improve future team generations.

## Getting started

### Requirements

- Node.js
- MongoDB
- An OpenAI API key

### Quickstart

1. Clone the repository and navigate into the project directory.
2. Install dependencies with `npm install`.
3. Copy `.env.example` to `.env` and fill in your MongoDB URL and OpenAI API key.
4. Start the application with `npm start`. The server will run on the port specified in your `.env` file.

### License

Copyright (c) 2024.