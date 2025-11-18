import { z } from 'zod';

/*
  These functions validate responses from the Nominatim's OpenStreetMap geolocation service.  
  **KEEP IN MIND** nominatim usage policy: must set a descriptive `User-Agent`, only 1 request/second, maybe consider a paid provider or a self-hosted
    instance if have high traffic? Usage policy - https://operations.osmfoundation.org/policies/nominatim/
*/


//Schema for the `address` object 
export const NominatimAddressSchema = z.object({
  house_number: z.string().optional(),
  road: z.string().optional(),
  city: z.string().optional(),
  town: z.string().optional(),
  village: z.string().optional(),
  county: z.string().optional(),
  state: z.string().optional(),
  postcode: z.string().optional(),
  country: z.string().optional(),
});

//schema to validate and type-check the structure of a Nominatim API response
// including optional geographic and address fields.
export const NominatimResponseSchema = z.object({
  place_id: z.number().optional(),
  licence: z.string().optional(),
  osm_type: z.string().optional(),
  osm_id: z.number().optional(),
  lat: z.string().optional(),
  lon: z.string().optional(),
  display_name: z.string().optional(),
  address: NominatimAddressSchema.optional(),
});

//defines a TypeScript type (NominatimResponse) inferred from the Zod schema
//to type-check Nominatim API responses after validation.
export type NominatimResponse = z.infer<typeof NominatimResponseSchema>;

export const ParsedAddressSchema = z.object({
  city: z.string().nullable(),
  state: z.string().nullable(),
  county: z.string().nullable(),
  displayName: z.string().nullable(),
});

// TypeScript type inferred from ParsedAddressSchema
export type ParsedAddress = z.infer<typeof ParsedAddressSchema>;
