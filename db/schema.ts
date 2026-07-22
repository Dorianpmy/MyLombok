import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const places = sqliteTable("places", {
  id: text("id").primaryKey(),
  region: text("region").notNull(),
  island: text("island").notNull(),
  city: text("city").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory").notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  specialty: text("specialty"),
  tags: text("tags", { mode: "json" }).$type<string[]>().notNull(),
  priceLevel: integer("price_level"),
  priceRange: text("price_range"),
  lat: real("lat").notNull(),
  lng: real("lng").notNull(),
  openingHours: text("opening_hours"),
  whatsapp: text("whatsapp"),
  mapsUrl: text("maps_url").notNull(),
  photos: text("photos", { mode: "json" }).$type<string[]>().notNull(),
  testedByUs: integer("tested_by_us", { mode: "boolean" }).notNull().default(false),
  rating: real("rating"),
  bestTime: text("best_time"),
  level: text("level"),
  vigilance: text("vigilance"),
  createdAt: text("created_at").notNull(),
});

export const favorites = sqliteTable("favorites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  deviceId: text("device_id").notNull(),
  placeId: text("place_id").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [uniqueIndex("favorites_device_place_idx").on(table.deviceId, table.placeId)]);
