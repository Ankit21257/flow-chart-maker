import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { prompt } from "../utils/llm.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const generateFlow = asyncHandler(
  async (req: Request, res: Response) => {
    const { userPrompt } = req.body;

    const llmResponse = await prompt(userPrompt);

    return new ApiResponse({
      statusCode: 200,
      message: "Flow generated successfully!",
      data: llmResponse,
    }).send(res);
  },
);
