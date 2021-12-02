export interface Circle {
  lat?: number;
  lon?: number;
  radius?: number;
}

export interface Rectangle {
  min_lat?: number;
  min_lon?: number;
  max_lat?: number;
  max_lon?: number;
}

export interface Point {
  lat?: number;
  lon?: number;
}

export interface Focus {
  point?: Point;
}

export interface Boundary {
  country?: string;
  circle?: Circle;
  rect?: Rectangle;
}

export interface GeocodeAPIRequest {
  text: string;
  size?: number;
  boundary?: Boundary;
  focus?: Focus;
}

export default GeocodeAPIRequest;
