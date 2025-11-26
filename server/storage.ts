import { type User, type InsertUser, type Profile, type InsertProfile, type Review, type InsertReview, type HostingRequest, type InsertHostingRequest, type ChatHistory, type ChatMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  getAllProfiles(): Promise<Profile[]>;
  createReview(review: InsertReview): Promise<Review>;
  getReviewsByHostId(hostId: string): Promise<Review[]>;
  createHostingRequest(request: InsertHostingRequest): Promise<HostingRequest>;
  getHostingRequests(userId: string): Promise<HostingRequest[]>;
  updateHostingRequest(requestId: string, status: string): Promise<HostingRequest | undefined>;
  getChatHistory(userId: string): Promise<ChatHistory | undefined>;
  saveChatHistory(userId: string, messages: ChatMessage[], preferences: any): Promise<ChatHistory>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private reviews: Map<string, Review>;
  private hostingRequests: Map<string, HostingRequest>;
  private chatHistories: Map<string, ChatHistory>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.reviews = new Map();
    this.hostingRequests = new Map();
    this.chatHistories = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProfile(userId: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.userId === userId,
    );
  }

  async getAllProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const now = new Date();
    const profile: Profile = { 
      id,
      userId: insertProfile.userId,
      name: insertProfile.name ?? null,
      canHost: insertProfile.canHost ?? false,
      country: insertProfile.country ?? null,
      bornIn: insertProfile.bornIn ?? null,
      previousLocations: insertProfile.previousLocations ?? null,
      languages: insertProfile.languages ?? null,
      interests: insertProfile.interests ?? null,
      aboutMe: insertProfile.aboutMe ?? null,
      usualStayLength: insertProfile.usualStayLength ?? null,
      travelStyle: insertProfile.travelStyle ?? null,
      maxCapacity: insertProfile.maxCapacity ?? null,
      maxDuration: insertProfile.maxDuration ?? null,
      preferredDays: insertProfile.preferredDays ?? null,
      customPreferredDays: insertProfile.customPreferredDays ?? null,
      preferredTransport: insertProfile.preferredTransport ?? null,
      customTransport: insertProfile.customTransport ?? null,
      preferredStay: insertProfile.preferredStay ?? null,
      customStay: insertProfile.customStay ?? null,
      preferredActivities: insertProfile.preferredActivities ?? null,
      customActivities: insertProfile.customActivities ?? null,
      redFlags: insertProfile.redFlags ?? null,
      greenFlags: insertProfile.greenFlags ?? null,
      instagramHandle: insertProfile.instagramHandle ?? null,
      instagramConnected: insertProfile.instagramConnected ?? false,
      spotifyConnected: insertProfile.spotifyConnected ?? false,
      spotifyUserId: insertProfile.spotifyUserId ?? null,
      verificationStatus: "unverified",
      verificationEmail: insertProfile.verificationEmail ?? null,
      passportVerified: false,
      rating: 0,
      reviewCount: 0,
      createdAt: now,
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(userId: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existingProfile = await this.getProfile(userId);
    if (!existingProfile) {
      return undefined;
    }
    const updatedProfile: Profile = { ...existingProfile, ...updates };
    this.profiles.set(existingProfile.id, updatedProfile);
    return updatedProfile;
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = randomUUID();
    const now = new Date();
    const newReview: Review = { id, ...review, createdAt: now };
    this.reviews.set(id, newReview);
    
    const hostProfile = await this.getProfile(review.hostId);
    if (hostProfile) {
      const allReviews = Array.from(this.reviews.values()).filter(r => r.hostId === review.hostId);
      const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await this.updateProfile(review.hostId, { rating: avgRating, reviewCount: allReviews.length });
    }
    
    return newReview;
  }

  async getReviewsByHostId(hostId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(r => r.hostId === hostId);
  }

  async createHostingRequest(request: InsertHostingRequest): Promise<HostingRequest> {
    const id = randomUUID();
    const now = new Date();
    const newRequest: HostingRequest = { id, ...request, createdAt: now };
    this.hostingRequests.set(id, newRequest);
    return newRequest;
  }

  async getHostingRequests(userId: string): Promise<HostingRequest[]> {
    return Array.from(this.hostingRequests.values()).filter(
      r => r.guestId === userId || r.hostId === userId
    );
  }

  async updateHostingRequest(requestId: string, status: string): Promise<HostingRequest | undefined> {
    const request = this.hostingRequests.get(requestId);
    if (!request) return undefined;
    const updated: HostingRequest = { ...request, status };
    this.hostingRequests.set(requestId, updated);
    return updated;
  }

  async getChatHistory(userId: string): Promise<ChatHistory | undefined> {
    return this.chatHistories.get(userId);
  }

  async saveChatHistory(userId: string, messages: ChatMessage[], preferences: any): Promise<ChatHistory> {
    const now = new Date();
    const existing = this.chatHistories.get(userId);
    const chatHistory: ChatHistory = {
      id: existing?.id ?? randomUUID(),
      userId,
      messages,
      preferences,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    this.chatHistories.set(userId, chatHistory);
    return chatHistory;
  }
}

export const storage = new MemStorage();
