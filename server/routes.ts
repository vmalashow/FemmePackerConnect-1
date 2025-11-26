import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema } from "@shared/schema";
import OpenAI from "openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // For demo purposes, we'll use a mock user ID
  const MOCK_USER_ID = "demo-user-123";

  // GET /api/profile - Get current user's profile
  app.get("/api/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile(MOCK_USER_ID);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // POST /api/profile - Create a new profile
  app.post("/api/profile", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse({
        ...req.body,
        userId: MOCK_USER_ID,
      });
      
      const existingProfile = await storage.getProfile(MOCK_USER_ID);
      if (existingProfile) {
        return res.status(400).json({ error: "Profile already exists" });
      }

      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      res.status(400).json({ error: "Invalid profile data" });
    }
  });

  // PATCH /api/profile - Update existing profile
  app.patch("/api/profile", async (req, res) => {
    try {
      const { userId, id, ...safeUpdates } = req.body;
      
      const profile = await storage.updateProfile(MOCK_USER_ID, safeUpdates);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(400).json({ error: "Failed to update profile" });
    }
  });

  // POST /api/chat - AI chat endpoint using OpenAI
  app.post("/api/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Message is required" });
      }

      const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
      const baseURL = process.env.AI_INTEGRATIONS_OPENAI_BASE_URL;

      if (!apiKey || !baseURL) {
        return res.status(500).json({ error: "OpenAI configuration missing" });
      }

      const client = new OpenAI({
        apiKey,
        baseURL,
      });

      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: "You are a helpful AI travel assistant for FemmePacker, a platform connecting female travelers with hosts. You help with trip planning, destination recommendations, and connecting travelers with hosts. Be friendly, engaging, and specific in your recommendations. Keep responses concise but informative.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

      const content = response.choices[0]?.message?.content || "I'm having trouble generating a response. Please try again.";
      
      res.json({ content });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
