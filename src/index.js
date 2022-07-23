import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

async function main() {
  dotenv.config();

  const server = express();

  server.use(cors());
  server.use(json());

  server.use();
  server.use();

  const PORT = process.env.PORT || 3333;

  server.listen(PORT, () => {
    console.log(`O servidor subiu na porta ${PORT}`);
  });
}
main().catch(console.error());
