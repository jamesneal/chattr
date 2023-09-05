
import OpenAI from "openai";
import dotenv from 'dotenv';
dotenv.config();

const config = {
  apiKey: process.env.OPENAI_ACCESS_TOKEN,
};

const openai = new OpenAI(config);

export { openai, config }