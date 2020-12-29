import { BeachPosition } from './BeachPosition';
export interface Beach {
  _id?: string;
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}
