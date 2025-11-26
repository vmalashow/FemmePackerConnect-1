import { type User, type InsertUser, type Profile, type InsertProfile, type Review, type InsertReview, type HostingRequest, type InsertHostingRequest, type ChatHistory, type ChatMessage, type UserMap, type InsertUserMap, type UserSubscription, type MessageQuota } from "@shared/schema";
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
  createUserMap(map: InsertUserMap): Promise<UserMap>;
  getUserMaps(userId: string): Promise<UserMap[]>;
  getPublicMaps(): Promise<UserMap[]>;
  updateUserMap(mapId: string, updates: Partial<InsertUserMap>): Promise<UserMap | undefined>;
  getUserSubscription(userId: string): Promise<UserSubscription | undefined>;
  createUserSubscription(userId: string, tier: string): Promise<UserSubscription>;
  updateUserSubscription(userId: string, tier: string, stripeId?: string): Promise<UserSubscription | undefined>;
  getMessageQuota(userId: string): Promise<MessageQuota | undefined>;
  incrementMessageCount(userId: string, type: 'ai' | 'host'): Promise<void>;
  canSendMessage(userId: string, type: 'ai' | 'host'): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;
  private reviews: Map<string, Review>;
  private hostingRequests: Map<string, HostingRequest>;
  private chatHistories: Map<string, ChatHistory>;
  private userMaps: Map<string, UserMap>;
  private userSubscriptions: Map<string, UserSubscription>;
  private messageQuotas: Map<string, MessageQuota>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
    this.reviews = new Map();
    this.hostingRequests = new Map();
    this.chatHistories = new Map();
    this.userMaps = new Map();
    this.userSubscriptions = new Map();
    this.messageQuotas = new Map();
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
    const newReview: Review = { id, ...review, comment: review.comment ?? null, createdAt: now };
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
    const newRequest: HostingRequest = { id, ...request, message: request.message ?? null, status: request.status ?? "pending", createdAt: now };
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

  async createUserMap(map: InsertUserMap): Promise<UserMap> {
    const id = randomUUID();
    const now = new Date();
    const newMap: UserMap = {
      id,
      ...map,
      downloads: 0,
      createdAt: now,
    };
    this.userMaps.set(id, newMap);
    return newMap;
  }

  async getUserMaps(userId: string): Promise<UserMap[]> {
    return Array.from(this.userMaps.values()).filter(m => m.userId === userId);
  }

  async getPublicMaps(): Promise<UserMap[]> {
    return Array.from(this.userMaps.values()).filter(m => m.isPublic);
  }

  async updateUserMap(mapId: string, updates: Partial<InsertUserMap>): Promise<UserMap | undefined> {
    const existing = this.userMaps.get(mapId);
    if (!existing) return undefined;
    const updated: UserMap = { ...existing, ...updates };
    this.userMaps.set(mapId, updated);
    return updated;
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | undefined> {
    return this.userSubscriptions.get(userId);
  }

  async createUserSubscription(userId: string, tier: string): Promise<UserSubscription> {
    const id = randomUUID();
    const now = new Date();
    const sub: UserSubscription = {
      id,
      userId,
      tier,
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      nextBillingDate: null,
      createdAt: now,
      updatedAt: now,
    };
    this.userSubscriptions.set(userId, sub);
    return sub;
  }

  async updateUserSubscription(userId: string, tier: string, stripeId?: string): Promise<UserSubscription | undefined> {
    let sub = this.userSubscriptions.get(userId);
    if (!sub) {
      sub = await this.createUserSubscription(userId, tier);
    }
    const updated: UserSubscription = {
      ...sub,
      tier,
      stripeSubscriptionId: stripeId || sub.stripeSubscriptionId,
      updatedAt: new Date(),
    };
    this.userSubscriptions.set(userId, updated);
    return updated;
  }

  async getMessageQuota(userId: string): Promise<MessageQuota | undefined> {
    const month = new Date().toISOString().slice(0, 7); // YYYY-MM
    const key = `${userId}-${month}`;
    let quota = this.messageQuotas.get(key);
    if (!quota) {
      const id = randomUUID();
      quota = {
        id,
        userId,
        month,
        aiMessages: 0,
        hostMessages: 0,
        createdAt: new Date(),
      };
      this.messageQuotas.set(key, quota);
    }
    return quota;
  }

  async incrementMessageCount(userId: string, type: 'ai' | 'host'): Promise<void> {
    const quota = await this.getMessageQuota(userId);
    if (!quota) return;
    
    const month = new Date().toISOString().slice(0, 7);
    const key = `${userId}-${month}`;
    
    if (type === 'ai') {
      quota.aiMessages = (quota.aiMessages || 0) + 1;
    } else {
      quota.hostMessages = (quota.hostMessages || 0) + 1;
    }
    this.messageQuotas.set(key, quota);
  }

  async canSendMessage(userId: string, type: 'ai' | 'host'): Promise<boolean> {
    const sub = await this.getUserSubscription(userId);
    const quota = await this.getMessageQuota(userId);
    
    if (!quota) return false;

    const tier = sub?.tier || 'free';
    
    if (tier === 'premium') return true; // Premium users unlimited
    
    // Free tier limits
    if (type === 'ai') {
      return (quota.aiMessages || 0) < 5;
    } else {
      return (quota.hostMessages || 0) < 3;
    }
  }
}

export const storage = new MemStorage();
