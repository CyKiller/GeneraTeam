const { OpenAI } = require("@langchain/openai");
const { LangChain } = require("@langchain/node"); // Added for LangChain integration
require('dotenv').config();

// {OpenAI API Key} - Ensure your OpenAI API key is correctly set in the .env file
const openAiApiKey = process.env.OPENAI_API_KEY;
const langChainApiKey = process.env.LANGCHAIN_API_KEY; // Added for LangChain integration

const openAi = new OpenAI(openAiApiKey);
const langChain = new LangChain(langChainApiKey); // Initialized LangChain with the API key

async function generateResponse(prompt) {
  try {
    const response = await openAi.complete({
      model: "gpt-3.5-turbo", // Consider updating the model based on your requirements
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 15000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    console.log("OpenAI response generated successfully.");
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error generating OpenAI response:", error.response ? error.response.data : error);
    throw error;
  }
}

async function generateLangChainResponse(prompt) {
  try {
    // Replace "your-langchain-model" with the actual model you intend to use.
    // This is a placeholder and needs to be updated based on your LangChain setup.
    const response = await langChain.complete({
      model: "gpt-3.5-turbo", // Updated with an example model, replace with your actual LangChain model
      prompt: prompt,
      parameters: { // This structure assumes LangChain accepts parameters in a similar format to OpenAI
        temperature: 0.7,
        max_tokens: 15000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      }
    });
    console.log("LangChain response generated successfully.");
    // Update the response parsing based on the actual structure returned by LangChain
    return response.data.choices[0].text.trim(); // Updated to match a more generic response structure. Adjust as needed.
  } catch (error) {
    console.error("Error generating LangChain response:", error.response ? error.response.data : error);
    throw error;
  }
}

module.exports = {
  generateResponse,
  generateLangChainResponse
};