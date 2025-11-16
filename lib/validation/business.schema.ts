// TODO: create business schema validation (for uploading and fetching)
import * as z from "zod";

const Business = z.object({
  business_id: z.uuid(),
  business_name: z.string(),
  business_type: z.string().optional(),
  location: z.string(), // we are currently using PostGIS Geography type, need to check if this is valid with that implementation
  location_address: z.string(),
  image_url: z.url(),
  created_at: z.iso.datetime(),
})