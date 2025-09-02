// src/config/sheetMap.ts
// Central mapping for Google Sheets → single source of truth

export const SPREADSHEET_ID = "1S_eFTn-Hg4nAfUjj4wZMG8pKK1WahxSTqR7ztx4rOnw";
export const SHEET_NAME = "GCDC Test Sheet";
export const RANGE = "A2:G17"; // KPIs + marquee + speed per your notes

// Row/column index map inside RANGE (0-based)
export const sheetMap = {
  kpiRows: [0, 1, 2, 3, 4, 5, 8, 9, 10],
  marquee: {
    questions: 6, // B8
    reviews:   7, // B9
    banking:  13, // B15
    social:   14, // B16
    news:     15, // B17
  },
  speed: { row: 10, col: 6 }, // G12
};

export function buildSheetsURL() {
  const KEY = import.meta.env.VITE_SHEETS_API_KEY as string;
  const encoded = encodeURIComponent(`${SHEET_NAME}!${RANGE}`);
  return `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encoded}?key=${KEY}`;
}