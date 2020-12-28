import { AxiosStatic } from 'axios';

export class StormGlass {
  readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,WindDirection,windSpeed';
  readonly stormGlassAPISource = 'noaaa';
  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    return await this.request.get(
      `https://api.stormglass.io/v2/weather/point?params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}&end=159211380&lat=${lat}&lng=${lng}`
    );
  }
}
