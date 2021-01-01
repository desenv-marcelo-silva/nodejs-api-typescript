import { Beach } from '@src/models/beach';
import { GeoPosition } from '@src/services/BeachPosition';
import { ForecastPoint } from '@src/clients/ForecastPoint';

const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: Beach) {}

  public getRatingBasedOnWindAndWavePositions(
    wavePosition: GeoPosition,
    windPosition: GeoPosition
  ): number {
    if (wavePosition === windPosition) {
      return 1;
    } else if (this.isWindOffShore(wavePosition, windPosition)) {
      return 5;
    }
    return 3;
  }

  public getRatingForSwellPeriod(period: number): number {
    if (period < 7) return 1;
    if (period < 10) return 2;
    if (period < 14) return 4;
    return 5;
  }

  public getRatingForSwellSize(height: number): number {
    if (height < waveHeights.ankleToKnee.min) return 1;
    if (height < waveHeights.ankleToKnee.max) return 2;
    if (height < waveHeights.waistHigh.max) return 3;
    return 5;
  }

  public getPositionFromLocation(coordinate: number): GeoPosition {
    if (coordinate < 50) return GeoPosition.N;
    if (coordinate < 120) return GeoPosition.E;
    if (coordinate < 220) return GeoPosition.S;
    if (coordinate < 310) return GeoPosition.W;
    return GeoPosition.N;
  }

  public getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection
    );

    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
    const finalRating =
      (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;
    return Math.round(finalRating);
  }

  private isWindOffShore(
    waveDirection: GeoPosition,
    windDirection: GeoPosition
  ): boolean {
    return (
      (waveDirection === GeoPosition.N &&
        windDirection === GeoPosition.S &&
        this.beach.position === GeoPosition.N) ||
      (waveDirection === GeoPosition.S &&
        windDirection === GeoPosition.N &&
        this.beach.position === GeoPosition.S) ||
      (waveDirection === GeoPosition.E &&
        windDirection === GeoPosition.W &&
        this.beach.position === GeoPosition.E) ||
      (waveDirection === GeoPosition.W &&
        windDirection === GeoPosition.E &&
        this.beach.position === GeoPosition.W)
    );
  }
}
