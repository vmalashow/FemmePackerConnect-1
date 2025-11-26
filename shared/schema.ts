import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer, real, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  name: text("name"),
  aboutMe: text("about_me"),
  canHost: boolean("can_host").default(false),
  country: text("country"),
  bornIn: text("born_in"),
  previousLocations: text("previous_locations").array(),
  languages: text("languages").array(),
  interests: text("interests").array(),
  usualStayLength: text("usual_stay_length"),
  travelStyle: text("travel_style"),
  maxCapacity: integer("max_capacity"),
  maxDuration: text("max_duration"),
  preferredDays: text("preferred_days").array(),
  customPreferredDays: text("custom_preferred_days"),
  preferredTransport: text("preferred_transport").array(),
  customTransport: text("custom_transport").array(),
  preferredStay: text("preferred_stay").array(),
  customStay: text("custom_stay").array(),
  preferredActivities: text("preferred_activities").array(),
  customActivities: text("custom_activities").array(),
  redFlags: text("red_flags"),
  greenFlags: text("green_flags"),
  instagramHandle: text("instagram_handle"),
  instagramConnected: boolean("instagram_connected").default(false),
  spotifyConnected: boolean("spotify_connected").default(false),
  spotifyUserId: text("spotify_user_id"),
  verificationStatus: text("verification_status").default("unverified"),
  verificationEmail: text("verification_email"),
  passportVerified: boolean("passport_verified").default(false),
  rating: real("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  hostId: varchar("host_id").notNull(),
  guestId: varchar("guest_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const hostingRequests = pgTable("hosting_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  guestId: varchar("guest_id").notNull(),
  hostId: varchar("host_id").notNull(),
  checkInDate: text("check_in_date").notNull(),
  checkOutDate: text("check_out_date").notNull(),
  message: text("message"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const chatHistory = pgTable("chat_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  messages: jsonb("messages"),
  preferences: jsonb("preferences"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertHostingRequestSchema = createInsertSchema(hostingRequests).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type HostingRequest = typeof hostingRequests.$inferSelect;
export type InsertHostingRequest = z.infer<typeof insertHostingRequestSchema>;
export type ChatMessage = { role: 'user' | 'assistant'; content: string };
export type ChatHistory = typeof chatHistory.$inferSelect;
