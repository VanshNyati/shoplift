import axios from "axios";
console.log("[API] baseURL =", process.env.NEXT_PUBLIC_API_URL);
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});
