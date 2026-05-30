/**
 * Ghana Public Holidays
 * Based on official statutory public holidays from the Ministry of the Interior
 * Source: https://www.mint.gov.gh/statutory-public-holidays/
 */

export interface Holiday {
  name: string;
  date: string; // ISO format: YYYY-MM-DD
  type: 'fixed' | 'movable' | 'observed';
  description?: string;
}

/**
 * Fixed public holidays in Ghana (dates that don't change year to year)
 */
const FIXED_HOLIDAYS_2026: Holiday[] = [
  {
    name: "New Year's Day",
    date: "2026-01-01",
    type: 'fixed',
    description: "First day of the year"
  },
  {
    name: "Constitution Day",
    date: "2026-01-07",
    type: 'fixed',
    description: "Commemorates the coming into force of the Fourth Republican Constitution"
  },
  {
    name: "Day off for Constitution Day",
    date: "2026-01-09",
    type: 'observed',
    description: "Observed holiday for Constitution Day"
  },
  {
    name: "Independence Day",
    date: "2026-03-06",
    type: 'fixed',
    description: "Celebrates Ghana's independence from British colonial rule"
  },
  {
    name: "Good Friday",
    date: "2026-04-03",
    type: 'movable',
    description: "Christian holiday commemorating the crucifixion of Jesus"
  },
  {
    name: "Easter Monday",
    date: "2026-04-06",
    type: 'movable',
    description: "Day after Easter Sunday"
  },
  {
    name: "May Day (Workers' Day)",
    date: "2026-05-01",
    type: 'fixed',
    description: "International Workers' Day"
  },
  {
    name: "Day of Prayer and Thanksgiving",
    date: "2026-07-01",
    type: 'fixed',
    description: "Republic Day - commemorates Ghana becoming a republic"
  },
  {
    name: "Founder's Day",
    date: "2026-09-21",
    type: 'fixed',
    description: "Kwame Nkrumah Memorial Day - honors Ghana's first president"
  },
  {
    name: "Farmer's Day",
    date: "2026-12-04",
    type: 'fixed',
    description: "Celebrates the contribution of farmers to Ghana's economy"
  },
  {
    name: "Christmas Day",
    date: "2026-12-25",
    type: 'fixed',
    description: "Christian holiday celebrating the birth of Jesus"
  },
  {
    name: "Boxing Day",
    date: "2026-12-26",
    type: 'fixed',
    description: "Day after Christmas"
  },
  {
    name: "Day off for Boxing Day",
    date: "2026-12-28",
    type: 'observed',
    description: "Observed holiday for Boxing Day"
  }
];

/**
 * Islamic holidays (movable - dates vary based on lunar calendar)
 * These dates are tentative and confirmed by the Office of the Chief Imam
 */
const ISLAMIC_HOLIDAYS_2026: Holiday[] = [
  {
    name: "Eid ul-Fitr",
    date: "2026-03-20",
    type: 'movable',
    description: "End of Ramadan fasting period"
  },
  {
    name: "Eid ul-Fitr Holiday",
    date: "2026-03-21",
    type: 'movable',
    description: "Second day of Eid ul-Fitr celebration"
  },
  {
    name: "Day off for Eid ul-Fitr Holiday",
    date: "2026-03-23",
    type: 'observed',
    description: "Observed holiday for Eid ul-Fitr"
  },
  {
    name: "Eid al-Adha",
    date: "2026-05-27",
    type: 'movable',
    description: "Festival of Sacrifice (Hajj)"
  }
];

/**
 * All Ghana public holidays for 2026
 */
export const GHANA_HOLIDAYS_2026: Holiday[] = [
  ...FIXED_HOLIDAYS_2026,
  ...ISLAMIC_HOLIDAYS_2026
];

/**
 * Future years - add holidays as they are announced
 * Islamic holidays dates are tentative and should be updated when confirmed
 */
const FIXED_HOLIDAYS_2027: Holiday[] = [
  { name: "New Year's Day", date: "2027-01-01", type: 'fixed' },
  { name: "Constitution Day", date: "2027-01-07", type: 'fixed' },
  { name: "Independence Day", date: "2027-03-06", type: 'fixed' },
  { name: "May Day (Workers' Day)", date: "2027-05-01", type: 'fixed' },
  { name: "Day of Prayer and Thanksgiving", date: "2027-07-01", type: 'fixed' },
  { name: "Founder's Day", date: "2027-09-21", type: 'fixed' },
  { name: "Farmer's Day", date: "2027-12-04", type: 'fixed' },
  { name: "Christmas Day", date: "2027-12-25", type: 'fixed' },
  { name: "Boxing Day", date: "2027-12-26", type: 'fixed' },
];

// Easter dates for future years (movable)
const EASTER_HOLIDAYS_2027: Holiday[] = [
  { name: "Good Friday", date: "2027-03-26", type: 'movable' },
  { name: "Easter Monday", date: "2027-03-29", type: 'movable' },
];

export const GHANA_HOLIDAYS_2027: Holiday[] = [
  ...FIXED_HOLIDAYS_2027,
  ...EASTER_HOLIDAYS_2027,
  // Islamic holidays to be added when dates are confirmed
];

/**
 * Get all holidays for a specific year
 */
export function getHolidaysForYear(year: number): Holiday[] {
  switch (year) {
    case 2026:
      return GHANA_HOLIDAYS_2026;
    case 2027:
      return GHANA_HOLIDAYS_2027;
    default:
      // For years without specific data, return empty array
      // In production, you might want to fetch from an API
      return [];
  }
}

/**
 * Check if a date is a public holiday in Ghana
 */
export function isGhanaPublicHoliday(date: Date): boolean {
  const year = date.getFullYear();
  const holidays = getHolidaysForYear(year);
  const dateStr = formatDateISO(date);
  return holidays.some(holiday => holiday.date === dateStr);
}

/**
 * Get holiday information for a specific date
 */
export function getHolidayInfo(date: Date): Holiday | null {
  const year = date.getFullYear();
  const holidays = getHolidaysForYear(year);
  const dateStr = formatDateISO(date);
  return holidays.find(holiday => holiday.date === dateStr) || null;
}

/**
 * Get all holidays in a date range
 */
export function getHolidaysInRange(startDate: Date, endDate: Date): Holiday[] {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const allHolidays: Holiday[] = [];
  
  for (let year = startYear; year <= endYear; year++) {
    allHolidays.push(...getHolidaysForYear(year));
  }
  
  const startStr = formatDateISO(startDate);
  const endStr = formatDateISO(endDate);
  
  return allHolidays.filter(holiday => 
    holiday.date >= startStr && holiday.date <= endStr
  );
}

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
function formatDateISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get a Set of holiday date strings for quick lookup
 */
export function getHolidayDateSet(startDate: Date, endDate: Date): Set<string> {
  const holidays = getHolidaysInRange(startDate, endDate);
  return new Set(holidays.map(h => h.date));
}
