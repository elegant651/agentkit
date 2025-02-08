import { z } from "zod";

export const GetPairsByChainAndPairSchema = z
  .object({
    chainId: z.string().describe("The chain ID of the pair"),
    pairId: z.string().describe("The pair ID to fetch"),
  })
  .strict();

export const SearchPairsSchema = z
  .object({
    query: z.string().describe("The search query string"),
  })
  .strict();

export const GetTokenPairsSchema = z
  .object({
    tokenAddresses: z.array(z.string()).max(10).describe("List of the token addresses"),
  })
  .strict();

  