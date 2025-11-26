import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProfileSchema, insertReviewSchema, insertHostingRequestSchema } from "@shared/schema";
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

  // GET /api/hosts - Get all profiles for interest-based matching
  app.get("/api/hosts", async (req, res) => {
    try {
      const profiles = await storage.getAllProfiles();
      const hosts = profiles.filter(p => p.canHost);
      res.json(hosts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hosts" });
    }
  });

  // GET /api/hosts/match - Get hosts matching user interests
  app.get("/api/hosts/match", async (req, res) => {
    try {
      const userProfile = await storage.getProfile(MOCK_USER_ID);
      if (!userProfile) {
        return res.status(404).json({ error: "User profile not found" });
      }

      const allHosts = await storage.getAllProfiles();
      const potentialHosts = allHosts.filter(h => h.canHost && h.id !== userProfile.id);

      const matchedHosts = potentialHosts.map(host => {
        let score = 0;
        const reasons: string[] = [];

        if (userProfile.interests && host.interests) {
          const commonInterests = userProfile.interests.filter(i => host.interests?.includes(i));
          score += commonInterests.length * 2;
          if (commonInterests.length > 0) {
            reasons.push(`shares ${commonInterests.slice(0, 2).join(", ")}`);
          }
        }

        if (userProfile.languages && host.languages) {
          const commonLanguages = userProfile.languages.filter(l => host.languages?.includes(l));
          score += commonLanguages.length;
          if (commonLanguages.length > 0) {
            reasons.push(`speaks ${commonLanguages[0]}`);
          }
        }

        if (host.country && userProfile.previousLocations?.includes(host.country)) {
          score += 3;
        }

        return { host, score, reasons: reasons.length > 0 ? reasons : ["compatible travel style"] };
      });

      const sorted = matchedHosts.sort((a, b) => b.score - a.score).slice(0, 5);
      res.json(sorted.map(m => ({ ...m.host, matchScore: m.score, matchReasons: m.reasons })));
    } catch (error) {
      res.status(500).json({ error: "Failed to match hosts" });
    }
  });

  // POST /api/hosting-requests - Create a hosting request
  app.post("/api/hosting-requests", async (req, res) => {
    try {
      const validatedData = insertHostingRequestSchema.parse(req.body);
      const request = await storage.createHostingRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      res.status(400).json({ error: "Invalid hosting request data" });
    }
  });

  // GET /api/hosting-requests - Get user's hosting requests
  app.get("/api/hosting-requests", async (req, res) => {
    try {
      const requests = await storage.getHostingRequests(MOCK_USER_ID);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hosting requests" });
    }
  });

  // PATCH /api/hosting-requests/:id - Update hosting request status
  app.patch("/api/hosting-requests/:id", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const updated = await storage.updateHostingRequest(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ error: "Request not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  // POST /api/reviews - Create a review
  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: "Invalid review data" });
    }
  });

  // GET /api/reviews/:hostId - Get reviews for a host
  app.get("/api/reviews/:hostId", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByHostId(req.params.hostId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  // POST /api/chat-history - Save chat history
  app.post("/api/chat-history", async (req, res) => {
    try {
      const { messages, preferences } = req.body;
      const history = await storage.saveChatHistory(MOCK_USER_ID, messages, preferences);
      res.status(201).json(history);
    } catch (error) {
      res.status(400).json({ error: "Failed to save chat history" });
    }
  });

  // GET /api/chat-history - Get user's chat history
  app.get("/api/chat-history", async (req, res) => {
    try {
      const history = await storage.getChatHistory(MOCK_USER_ID);
      res.json(history || { messages: [], preferences: {} });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
