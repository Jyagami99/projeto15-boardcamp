import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRouter from "./routes/categoriesRouter.js";
import customerRouter from "./routes/customerRouter.js";
import gamesRouter from "./routes/gamesRouter.js";
import rentalsRouter from "./routes/rentalsRouter.js";

async function main() {
  dotenv.config();

  const server = express();

  server.use(cors());
  server.use(json());

  server.use(categoriesRouter);
  server.use(customerRouter);
  server.use(gamesRouter);
  server.use(rentalsRouter);

  const PORT = process.env.PORT || 3333;

  server.listen(PORT, () => {
    console.log(`O servidor subiu na porta ${PORT}`);
  });
}
main().catch(console.error());
