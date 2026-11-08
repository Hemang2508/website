/** City reference data for Regional Connect. City selection is manual — no device location is used. */
export const CITIES = [
  { name: "Hyderabad", state: "Telangana", region: "South India", pilot: true },
  { name: "Bengaluru", state: "Karnataka", region: "South India", pilot: false },
  { name: "Mumbai", state: "Maharashtra", region: "West India", pilot: false },
  { name: "Chennai", state: "Tamil Nadu", region: "South India", pilot: false },
  { name: "Delhi", state: "Delhi NCR", region: "North India", pilot: false },
  { name: "Pune", state: "Maharashtra", region: "West India", pilot: false },
] as const;

export type CityName = (typeof CITIES)[number]["name"];

export function cityInfo(name: string) {
  return CITIES.find((c) => c.name === name) ?? { name, state: "India", region: "India", pilot: false };
}
