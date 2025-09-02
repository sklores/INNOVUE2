// src/components/topbar/useWeather.ts
import { useEffect, useState } from "react";

// Simple condition type for our Weather layer
export type WxCondition = "clear" | "cloudy" | "rain" | "thunder" | "fog";

type Result = { condition: WxCondition; intensity: number; error?: string; loading: boolean };

/**
 * useWeather(zip)
 * - Uses zippopotam.us to get lat/lon from US ZIP (no key)
 * - Uses open-meteo.com for current weather (no key)
 * - Maps weathercode to our visuals
 */
export function useWeather(zip: string | null): Result {
  const [state, setState] = useState<Result>({ condition: "clear", intensity: 0.6, loading: !!zip });

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!zip) { setState(s => ({ ...s, loading: false })); return; }
      try {
        setState(s => ({ ...s, loading: true, error: undefined }));

        // 1) ZIP -> lat/lon (US)
        const z = await fetch(`https://api.zippopotam.us/us/${encodeURIComponent(zip)}`);
        if (!z.ok) throw new Error(`ZIP lookup failed (${z.status})`);
        const zdata = await z.json();
        const place = zdata?.places?.[0];
        const lat = parseFloat(place?.latitude);
        const lon = parseFloat(place?.longitude);
        if (!isFinite(lat) || !isFinite(lon)) throw new Error("Invalid lat/lon");

        // 2) Open-Meteo current weather
        const om = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        if (!om.ok) throw new Error(`Weather fetch failed (${om.status})`);
        const w = await om.json();
        const code: number = w?.current_weather?.weathercode ?? 0;

        // Map open-meteo weathercode to our simple buckets
        // Ref: https://open-meteo.com/en/docs#api_form
        let condition: WxCondition = "clear";
        let intensity = 0.6;

        if ([0].includes(code)) condition = "clear";
        else if ([1,2,3,45,48].includes(code)) {
          // 45/48 = fog/mist; 1-3 = mainly to overcast
          condition = [45,48].includes(code) ? "fog" : "cloudy";
          intensity = [3,48].includes(code) ? 0.8 : 0.5;
        } else if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) {
          // drizzle + rain codes
          condition = "rain";
          intensity = [65,67,82].includes(code) ? 0.9 : 0.6;
        } else if ([95,96,99].includes(code)) {
          // thunderstorms
          condition = "thunder";
          intensity = [96,99].includes(code) ? 0.9 : 0.7;
        } else {
          condition = "cloudy";
          intensity = 0.5;
        }

        if (!cancelled) setState({ condition, intensity, loading: false });
      } catch (err: any) {
        if (!cancelled) setState({ condition: "clear", intensity: 0.6, loading: false, error: String(err?.message || err) });
      }
    }
    run();
    return () => { cancelled = true; };
  }, [zip]);

  return state;
}