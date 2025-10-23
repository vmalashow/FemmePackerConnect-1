import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema } from "@shared/schema";

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

  const httpServer = createServer(app);

  return httpServer;
}
