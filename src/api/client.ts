import axios from "axios";

// TODO: fix this
import dotenv from "dotenv";

dotenv.config();

console.log("URL", process.env.POKE_API_URL);

export const client = axios.create({
  baseURL: process.env.POKE_API_URL,
});
