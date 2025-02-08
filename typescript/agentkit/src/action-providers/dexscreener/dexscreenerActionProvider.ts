import { z } from "zod";
import { ActionProvider } from "../actionProvider";
import { CreateAction } from "../actionDecorator";
import { GetPairsByChainAndPairSchema, GetTokenPairsSchema, SearchPairsSchema } from "./schema";

/**
 * DexscreenerActionProvider is an action provider for Dexscreener.
 */
export class DexscreenerActionProvider extends ActionProvider {
  private readonly baseUrl = "https://api.dexscreener.com/latest/dex";
  /**
   * Constructs a new DexscreenerActionProvider.
   */
  constructor() {
    super("dexscreener", []);
  }

  @CreateAction({
    name: "get_pairs_by_chain_and_pair",
    description: "Get pairs by chainId and pairId from Dexscreener",
    schema: GetPairsByChainAndPairSchema
  })
  async getPairsByChainAndPair(args: z.infer<typeof GetPairsByChainAndPairSchema>): Promise<string> {
    const url = `${this.baseUrl}/pairs/${args.chainId}/${args.pairId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  @CreateAction({
    name: "get_token_pairs_by_token_address",
    description: "Get all token pairs for given token addresses from Dexscreener",
    schema: GetTokenPairsSchema
  })
  async getTokenPairsByTokenAddress(args: z.infer<typeof GetTokenPairsSchema>): Promise<string> {
    const addresses = args.tokenAddresses.join(",");
    const url = `${this.baseUrl}/tokens/${addresses}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  @CreateAction({
    name: "search_pairs",
    description: "Search for pairs matching a query string on Dexscreener",
    schema: SearchPairsSchema
  })
  async searchPairs(args: z.infer<typeof SearchPairsSchema): Promise<string> {
    const url = `${this.baseUrl}/search?q=${encodeURIComponent(args.query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const tokenPair = await response.json();
    if (tokenPair.length === 0) {
      throw new Error(`No token pair found for ${args.query}`);
    }
    return tokenPair
  }

  supportsNetwork = () => true;

}

export const dexscreenerActionProvider = () => new DexscreenerActionProvider();