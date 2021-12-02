import { GeocodeAPIRequest, GeocodeAPIResponse } from "@/interfaces/GeocodeAPI/ForwardGeocoding";
// @ts-ignore
import { GEOCODEAPI_KEY } from "react-native-dotenv";

export async function forwardGeocoding(request: GeocodeAPIRequest): Promise<GeocodeAPIResponse> {
  const apiUrl = new URL(`https://app.geocodeapi.io/api/v1/search`);
  apiUrl.searchParams.append("apikey", GEOCODEAPI_KEY);
  apiUrl.searchParams.append("text", request.text);
  if (request.size) apiUrl.searchParams.append("size", request.size.toString());
  if (request.boundary) {
    if (request.boundary.country) apiUrl.searchParams.append("boundary.country", request.boundary.country);
    if (request.boundary.circle) {
      if (request.boundary.circle.lat)
        apiUrl.searchParams.append("boundary.circle.lat", request.boundary.circle.lat.toString());
      if (request.boundary.circle.lon)
        apiUrl.searchParams.append("boundary.circle.lon", request.boundary.circle.lon.toString());
      if (request.boundary.circle.radius)
        apiUrl.searchParams.append("boundary.circle.radius", request.boundary.circle.radius.toString());
    }
    if (request.boundary.rect) {
      if (request.boundary.rect.min_lat)
        apiUrl.searchParams.append("boundary.rect.min_lat", request.boundary.rect.min_lat.toString());
      if (request.boundary.rect.min_lon)
        apiUrl.searchParams.append("boundary.rect.min_lon", request.boundary.rect.min_lon.toString());
      if (request.boundary.rect.max_lat)
        apiUrl.searchParams.append("boundary.rect.max_lat", request.boundary.rect.max_lat.toString());
      if (request.boundary.rect.max_lon)
        apiUrl.searchParams.append("boundary.rect.max_lon", request.boundary.rect.max_lon.toString());
    }
    if (request.focus) {
      if (request.focus.point) {
        if (request.focus.point.lat) apiUrl.searchParams.append("focus.point.lat", request.focus.point.lat.toString());
        if (request.focus.point.lon) apiUrl.searchParams.append("focus.point.lon", request.focus.point.lon.toString());
      }
    }
  }
  return await fetch(apiUrl.toString()).then(
    response => response.json(),
    error => {
      throw new Error(error);
    },
  );
}
