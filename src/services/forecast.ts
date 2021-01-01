import _ from 'lodash';

import { ForecastPoint } from '@src/clients/ForecastPoint';
import { StormGlass } from '@src/clients/stormGlass';
import { Beach } from '@src/models/beach';

import { BeachForecast } from '@src/services/BeachForecast';
import { TimeForecast } from '@src/services/TimeForecast';
import { Rating } from '@src/services/rating';

import { ForecastProcessingInternalError } from '@src/services/ForecastProcessingInternalError';
import logger from '@src/logger';

export class Forecast {
  constructor(
    protected stormGlass = new StormGlass(),
    protected RatingService: typeof Rating = Rating
  ) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    try {
      const beachForecast = await this.calculateRating(beaches);
      const timeForecast = this.mapForecastByTime(beachForecast);
      return timeForecast.map((tfc) => ({
        time: tfc.time,
        forecast: _.orderBy(tfc.forecast, ['rating'], ['desc']),
      }));
    } catch (err) {
      logger.error(err);
      throw new ForecastProcessingInternalError(err.message);
    }
  }

  private async calculateRating(beaches: Beach[]): Promise<BeachForecast[]> {
    logger.info(`Preparing forecast for ${beaches.length} beaches.`);
    const pointsWithCorrectSources: BeachForecast[] = [];

    for (const beach of beaches) {
      const rating = new this.RatingService(beach);
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = this.enrichedBeachData(points, beach, rating);

      pointsWithCorrectSources.push(...enrichedBeachData);
    }
    return pointsWithCorrectSources;
  }

  private enrichedBeachData(
    points: ForecastPoint[],
    beach: Beach,
    rating: Rating
  ): BeachForecast[] {
    return points.map((point) => ({
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: rating.getRateForPoint(point),
      },
      ...point,
    }));
  }

  private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
    const forecastByTime: TimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((fc) => fc.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        forecastByTime.push({
          time: point.time,
          forecast: [point],
        });
      }
    }
    return forecastByTime;
  }
}
