import { GeoPosition } from '@src/services/GeoPosition';
export interface Beach {
  _id?: string;
  name: string;
  position: GeoPosition;
  lat: number;
  lng: number;
  user: string;
}
