import { tool, ToolLoopAgent } from "ai";
import { z } from "zod";

export const uaiAgent = new ToolLoopAgent({
  model: "openai/gpt-4o-mini",
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
