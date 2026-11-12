import { properties } from "@/data/properties";
import type { Property, PropertyQuery } from "@/types";
import type { PropertyListResponse, PropertyResponse } from "@/types/api";
import { api, USE_MOCK } from "@/lib/api";
// Replace the body with an axios call (GET /api/properties) when the backend exists.
export function filterProperties(list: Property[], f: PropertyQuery): Property[] {
  let r = list.filter(p =>
    (!f.q || `${p.title} ${p.location}`.toLowerCase().includes(f.q.toLowerCase())) &&
    (!f.listing || p.listing === f.listing) &&
    (!f.category || f.category === "All" || p.category === f.category) &&
    (!f.maxPrice || p.price <= f.maxPrice) && (!f.bhk || (f.bhk >= 5 ? p.bhk >= 5 : p.bhk === f.bhk)) && (!f.minPrice || p.price >= f.minPrice) && (!f.maxArea || p.areaSqft <= f.maxArea) && (!f.verified || p.verified) && (!f.featured || p.featured) && (!f.minArea || p.areaSqft >= f.minArea) && (!f.amenity || p.amenities.includes(f.amenity)));
  if (f.sort === "price-asc") r = [...r].sort((a, b) => a.price - b.price);
  else if (f.sort === "price-desc") r = [...r].sort((a, b) => b.price - a.price);
  else r = [...r].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  return r;
}
async function mockList(f: PropertyQuery): Promise<Property[]> {
  return filterProperties(properties, f);
}

export async function getProperties(f: PropertyQuery = {}): Promise<Property[]> {
  if (USE_MOCK) return mockList(f);
  const res = await api.get<PropertyListResponse>("/properties", { params: f });
  return res.data.data.items;
}
export async function getProperty(id: string): Promise<Property | undefined> {
  if (USE_MOCK) return properties.find(p => p.id === id);
  const res = await api.get<PropertyResponse>(`/properties/${id}`);
  return res.data.data;
}
