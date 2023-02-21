import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ParsedQs } from "qs";

import { client } from "./api/client";
import { GetPokemonsList } from "./types";

interface GetPokemonsLisQueryParams extends ParsedQs {
  search: string;
}

dotenv.config();
const POKEMON_COUNT_TOTAL = 1279;

const app: Express = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);

const port = process.env.PORT;

app.get("/pokemon", async (req: Request, res: Response) => {
  const { search, offset, limit } = req.query as GetPokemonsLisQueryParams;

  if (Boolean(search)) {
    try {
      const response = await client.get<GetPokemonsList>("/pokemon", {
        params: {
          offset: 0,
          limit: POKEMON_COUNT_TOTAL,
        },
      });

      const results = response.data.results.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(search.toLowerCase())
      );

      return res.status(200).send({ ...response.data, results });
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  try {
    const response = await client.get("/pokemon", {
      params: {
        offset,
        limit,
      },
    });

    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).send({ message: error });
  }
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
