const API_URL = "https://squid-app-uaozl.ondigitalocean.app";

async function request(endpoint, signal) {
  const response = await fetch(`${API_URL}${endpoint}`, { signal });

  if (!response.ok) {
    throw new Error(`Kunne ikke hente uddannelse (${response.status}).`);
  }

  const result = await response.json();
  return result.data;
}

export async function getEducations(signal) {
  const data = await request("/educations", signal);
  return data.educations;
}

export function getEducation(slug, signal) {
  return request(`/educations/${encodeURIComponent(slug)}`, signal);
}

export function getWebudvikler(signal) {
  return getEducation("webudvikler", signal);
}

export function getFotograf(signal) {
  return getEducation("fotograf", signal);
}

export function getFilmproduktion(signal) {
  return getEducation("filmproduktion", signal);
}

export default getEducations;
