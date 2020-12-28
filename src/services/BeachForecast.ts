import { ForecastPoint } from '@src/clients/ForecastPoint';
import { Beach } from './Beach';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}
