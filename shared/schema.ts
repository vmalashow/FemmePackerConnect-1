import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, integer } from "drizzle-orm/pg-core";
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
  bio: text("bio"),
  usualStayLength: text("usual_stay_length"),
  travelStyle: text("travel_style"),
  availabilityFlexible: boolean("availability_flexible").default(true),
  availabilityFrom: text("availability_from"),
  availabilityTo: text("availability_to"),
  availabilityDays: integer("availability_days"),
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
  socialMediaLink: text("social_media_link"),
  spotifyConnected: boolean("spotify_connected").default(false),
  spotifyUserId: text("spotify_user_id"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
