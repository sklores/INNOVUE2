// src/features/data/sheets/fetch.ts
import { buildSheetsURL } from "../../../config/sheetMap";

export async function fetchSheetValues(): Promise<string[][]> {
  const url = buildSheetsURL();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets ${res.status}`);
  const json = await res.json();
  // Sheets returns { values: string[][] } or undefined
  return (json?.values ?? []) as string[][];
}