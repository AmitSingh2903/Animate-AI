import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

const llm = new OpenAI({
  openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  temperature: 0.7,
});

const template = `You are a helpful task management assistant. Help the user with their todo list.
Current request: {input}
Please provide a helpful and concise response.`;

const prompt = PromptTemplate.fromTemplate(template);
const chain = new LLMChain({ llm, prompt });

export const getChatResponse = async (input: string) => {
  try {
    const response = await chain.call({ input });
    return response.text;
  } catch (error) {
    console.error('Error getting chat response:', error);
    throw error;
  }
};