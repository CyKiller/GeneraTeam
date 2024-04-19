const axios = require('axios');
require('dotenv').config();

const openAiApiKey = process.env.OPENAI_API_KEY; // Ensure your OpenAI API key is correctly set in the .env file
const langChainUrl = process.env.LANGCHAIN_URL; // Ensure your LangChain API URL is correctly set in the .env file

const callOpenAiApi = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo', // Or whatever model you're planning to use
        prompt: prompt,
        temperature: 0.7,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      },
      {
        headers: {
          'Authorization': `Bearer ${openAiApiKey}`
        }
      }
    );
    console.log("OpenAI API call successful.");
    return response.data;
  } catch (error) {
    console.error('Error calling OpenAI API:', error.response ? error.response.data : error.message);
    console.error(error.stack);
    throw error;
  }
};

const callLangChainApi = async (data) => {
  try {
    const response = await axios.post(langChainUrl, data);
    console.log("LangChain API call successful.");
    return response.data;
  } catch (error) {
    console.error('Error calling LangChain API:', error.response ? error.response.data : error.message);
    console.error(error.stack);
    throw error;
  }
};

module.exports = {
  callOpenAiApi,
  callLangChainApi
};