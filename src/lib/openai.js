
import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
dotenv.config();

const config = new Configuration({
  apiKey: process.env.OPENAI_ACCESS_TOKEN,
});

const openai = new OpenAIApi(config);

export { openai, config }