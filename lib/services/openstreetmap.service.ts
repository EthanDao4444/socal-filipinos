import { NominatimResponseSchema, ParsedAddressSchema, ParsedAddress } from '@/lib/validation/openstreetmap.schema';
import { z } from 'zod';

//
export type FetchOpts = {
  userAgent?: string;
  signal?: AbortSignal;
};

//user agent required for requests to Nominatim
const DEFAULT_USER_AGENT = 'socal-filipinos/1.0 (+https://github.com/EthanDao4444)';

//rate limiter to have a a minimum interval between requests (ms)
let _lastRequestAt = 0;
let _minIntervalMs = 1000; // default 1 request per second

export function configureRateLimit(opts: { minIntervalMs?: number }) {
  if (typeof opts.minIntervalMs === 'number') _minIntervalMs = opts.minIntervalMs;
}

async function waitForRateLimit() {
  const now = Date.now();
  const since = now - _lastRequestAt;
  if (since < _minIntervalMs) {
    const toWait = _minIntervalMs - since;
    await new Promise((res) => setTimeout(res, toWait));
  }
}

export async function fetchReverseGeocode(lat: number, lon: number, opts?: FetchOpts) {
  // validate coords first — throw on invalid coordinates
  if (!validateCoordinates(lat, lon)) {
    throw new Error('Invalid coordinates');
  }

  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
  const headers: Record<string, string> = {
    'User-Agent': opts?.userAgent ?? DEFAULT_USER_AGENT,
    Accept: 'application/json',
  };

  const res = await fetch(url, { headers, signal: opts?.signal });
  if (!res.ok) {
    throw new Error(`Nominatim returned ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  // validate shape (will throw if unexpected)
  const parsed = NominatimResponseSchema.parse(json);
  return parsed;
}

export async function rateLimitedFetchReverseGeocode(lat: number, lon: number, opts?: FetchOpts) {
  // If a signal was provided allow waitForRateLimit to be cancelled early.
  if (opts?.signal) {
    // create a promise that races waitForRateLimit with the abort signal
    const waitPromise = new Promise<void>((res, rej) => {
      const onAbort = () => {
        const e = new Error('Aborted');
        (e as any).name = 'AbortError';
        rej(e);
      };
      // if already aborted, reject immediately
      if (opts.signal!.aborted) return rej(new Error('Aborted'));
      const onAbortListener = () => onAbort();
      opts.signal!.addEventListener('abort', onAbortListener);
      waitForRateLimit()
        .then(() => {
          opts.signal!.removeEventListener('abort', onAbortListener);
          res();
        })
        .catch((err) => {
          opts.signal!.removeEventListener('abort', onAbortListener);
          rej(err);
        });
    });

    await waitPromise;
  } else {
    await waitForRateLimit();
  }

  try {
    const result = await fetchReverseGeocode(lat, lon, opts);
    _lastRequestAt = Date.now();
    return result;
  } catch (err) {
    // rethrow so callers can handle (including AbortError)
    throw err;
  }
}

export function parseNominatimAddress(raw: unknown): ParsedAddress {
  const parsed = NominatimResponseSchema.parse(raw);
  const addr = parsed.address ?? {};
  const city = addr.city ?? addr.town ?? addr.village ?? addr.county ?? null;
  const state = addr.state ?? null;
  const county = addr.county ?? null;
  const displayName = parsed.display_name ?? null;
  return ParsedAddressSchema.parse({ city, state, county, displayName });
}

export function formatCityState(parsed: ParsedAddress) {
  const city = parsed.city ?? '';
  const state = parsed.state ?? '';
  if (city && state) return `${city}, ${state}`;
  if (city) return city;
  if (state) return state;
  return '';
}

export function validateCoordinates(lat: number, lon: number) {
  const schema = z.object({
    lat: z.number().min(-90).max(90),
    lon: z.number().min(-180).max(180),
  });
  const result = schema.safeParse({ lat, lon });
  return result.success;
}

export function toPostgresPoint(lat: number, lon: number) {
  // Validate coordinates before formatting to ensure valid input.
  if (!validateCoordinates(lat, lon)) {
    throw new Error('Invalid coordinates for Postgres POINT');
  }

  // Postgres expects POINT(lon lat)
  return `POINT(${lon} ${lat})`;
}
