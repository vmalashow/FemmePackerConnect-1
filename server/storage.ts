import { type User, type InsertUser, type Profile, type InsertProfile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProfile(userId: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(userId: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private profiles: Map<string, Profile>;

  constructor() {
    this.users = new Map();
    this.profiles = new Map();
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

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = { 
      id,
      userId: insertProfile.userId,
      name: insertProfile.name ?? null,
      canHost: insertProfile.canHost ?? null,
      country: insertProfile.country ?? null,
      bornIn: insertProfile.bornIn ?? null,
      languages: insertProfile.languages ?? null,
      interests: insertProfile.interests ?? null,
      bio: insertProfile.bio ?? null,
      usualStayLength: insertProfile.usualStayLength ?? null,
      travelStyle: insertProfile.travelStyle ?? null,
      availabilityFlexible: insertProfile.availabilityFlexible ?? null,
      availabilityFrom: insertProfile.availabilityFrom ?? null,
      availabilityTo: insertProfile.availabilityTo ?? null,
      availabilityDays: insertProfile.availabilityDays ?? null,
      maxCapacity: insertProfile.maxCapacity ?? null,
      preferredTransport: insertProfile.preferredTransport ?? null,
      customTransport: insertProfile.customTransport ?? null,
      preferredStay: insertProfile.preferredStay ?? null,
      customStay: insertProfile.customStay ?? null,
      preferredActivities: insertProfile.preferredActivities ?? null,
      customActivities: insertProfile.customActivities ?? null,
      redFlags: insertProfile.redFlags ?? null,
      greenFlags: insertProfile.greenFlags ?? null,
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
}

export const storage = new MemStorage();
