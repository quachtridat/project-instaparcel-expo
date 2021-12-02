import Dim2D from "@/interfaces/Dim2D";
import Dim3D from "@/interfaces/Dim3D";
import { GeographicCoordinates } from "@/interfaces/GeographicCoordinates";

export enum DimensionMismatchCorrection {
  None = "none",
  Less = "less",
  Greater = "greater",
  Average = "average",
}

export function get3d(
  front: Dim2D,
  top: Dim2D,
  side: Dim2D,
  correction: DimensionMismatchCorrection = DimensionMismatchCorrection.None,
  precision = 0.001,
): Dim3D {
  // front width can be object width
  // front height can be object height
  // top width can be object width
  // top height can be object length
  // side width can be object length
  // side height can be object height

  switch (correction) {
    case DimensionMismatchCorrection.None:
      // raise expection if front width and top width or front height and side height or top height and side width are different more than precision
      if (
        Math.abs(front.width - top.width) > precision ||
        Math.abs(front.height - side.height) > precision ||
        Math.abs(top.height - side.width) > precision
      ) {
        throw new Error("Dimension mismatch");
      } else {
        return get3d(front, top, side, DimensionMismatchCorrection.Average, precision);
      }
    case DimensionMismatchCorrection.Less: {
      // object width is min of front width and top width
      const width = Math.min(front.width, top.width);
      // object height is min of front height and side height
      const height = Math.min(front.height, side.height);
      // object length is min of top height and side width
      const length = Math.min(top.height, side.width);
      return { width, height, length };
    }
    case DimensionMismatchCorrection.Greater: {
      // object width is max of front width and top width
      const width = Math.max(front.width, top.width);
      // object height is max of front height and side height
      const height = Math.max(front.height, side.height);
      // object length is max of top height and side width
      const length = Math.max(top.height, side.width);
      return { width, height, length };
    }
    case DimensionMismatchCorrection.Average: {
      // object width is average of front width and top width
      const width = (front.width + top.width) / 2;
      // object height is average of front height and side height
      const height = (front.height + side.height) / 2;
      // object length is average of top height and side width
      const length = (top.height + side.width) / 2;
      return { width, height, length };
    }
    default:
      throw new Error("Unknown correction");
  }
}

/**
 * Calculates the Earth distance between two geographic coordinates.
 * @param {GeographicCoordinates} coords1 The coordinates of the origin
 * @param {GeographicCoordinates} coords2 The coordinates of the destination
 * @returns {number} The distance between the two coordinates in kilometers
 */
export function calcDistance(coords1: GeographicCoordinates, coords2: GeographicCoordinates): number {
  const { latitude: lat1, longitude: lon1 } = coords1;
  const { latitude: lat2, longitude: lon2 } = coords2;
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos;
  const a = 0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}

export function simpleCost(volume: number, mass: number, distance: number): number {
  return Math.max(1, volume) * Math.max(1, mass) * Math.max(1, distance / 10) + 5;
}
