// TODO: create event schema validation (for uploading and fetching)
import * as z from "zod";

const Event = z.object({
  event_id: z.uuid(),
  event_name: z.string(),
  event_description: z.string().optional(),
  start_date: z.iso.datetime(),
  end_date: z.iso.datetime(),
  price: z.number()
          .multipleOf(0.01) // floats may only have up to 2 digits
          .nonnegative() // price cant be < $0
          .default(0), // if no price is provided, it defaults to $0
  organizer_email: z.email().optional(),
  event_location: z.string(), // we are currently using PostGIS Geography type, need to check if this is valid with that implementation
  image_url: z.url(),
  location_address: z.string(),
  created_at: z.iso.datetime(),
})