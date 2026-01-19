import { tool, ToolLoopAgent } from "ai";
import { z } from "zod";

export const uaiAgent = new ToolLoopAgent({
  model: "openai/gpt-4o-mini",
  instructions: `
    You are a helpful assistant.
    Use tools proactively to accomplish user goals,
    try to avoid asking the user for params that can be obtained via other tools.

    Tool parameter rules:
    - Get required params from other tools when possible; only ask the user as a last resort.
    - Omit optional params when not provided; never invent defaults.
    - Never fabricate or guess parameter values.`,
  tools: {
    productSelector: tool({
      description: "Select a product from the list of products",
      inputSchema: z.object({
        filter: z
          .string()
          .optional()
          .describe("Filter to apply to the products list"),
      }),
      outputSchema: z.object({
        productId: z.string().describe("The selected product ID"),
      }),
    }),
    showProductDetails: tool({
      description: "Show the details of a product",
      inputSchema: z.object({
        productId: z.string().describe("The ID of the product to show"),
      }),
    }),
    deleteProduct: tool({
      description: "Delete a product from the list of products",
      inputSchema: z.object({
        productId: z.string().describe("The ID of the product to delete"),
      }),
      outputSchema: z.object({
        deletedProductId: z.string().describe("The ID of the deleted product"),
      }),
    }),
  },
});
