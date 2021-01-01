import { GeoPosition } from './BeachPosition';
export interface Beach {
  _id?: string;
  name: string;
  position: GeoPosition;
  lat: number;
  lng: number;
  user: string;
}
