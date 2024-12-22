import { getTrackId } from "../utils/getTrackId";

export type Track = {
  id: string;
  artist: string;
  title: string;
  image: string;
  position: number;
  change: number;
  isNew: boolean;
  apiPrefPosition: number;
};

export type MultiYearTrack = Track & {
  positions: Record<number, number>;
  previousPositions: Record<number, number>;
};

export type EnhancedTrack = MultiYearTrack & {
  totalChange: number;
  averageChange: number;
  changes: Record<string, number>;
};

export type ApiTrack = {
  id?: string;
  broadcastTime: string;
  broadcastUnixTime: number;
  position: {
    current: number;
    label: string;
    previous: number;
    type: "stale";
  };
  totalPositions: number;
  track: {
    artist: string;
    coverUrl?: string;
    detailUrl: string;
    historyUrl: string;
    id: string;
    isAvailable: boolean;
    previewUrl?: string;
    title: string;
  };
};
type ApiResponse = {
  chartDate: string;
  editionActive: boolean;
  downloadUrls: {
    excelUrl: string;
    pdfUrl: string;
  };
  slug: string;
  positions: ApiTrack[];
};

const getYears = (start: number, end: number) => {
  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  ).reverse();
};

const downSize = (inputUrl: string, width: number, height: number) => {
  const url = new URL(inputUrl);
  const params = new URLSearchParams(url.search);
  params.set("width", width.toString());
  params.set("height", height.toString());

  return `${url.origin}${url.pathname}?${params.toString()}`;
};
export class Top2000Api {
  baseURL: string;
  constructor() {
    this.baseURL = "https://www.nporadio2.nl/api/charts/";
  }

  getURL(year: string) {
    if (Number(year) < 2024) return `${this.baseURL}top-2000-van-${year}-12-25`;
    return `${this.baseURL}npo-radio-2-top-2000-van-${year}-12-25`;
  }

  getCachedTracks(): Record<string, Track[]> {
    const songs = window.localStorage.getItem("songs");

    return songs ? this.decompress(JSON.parse(songs)) : {};
  }

  getCachedYear(year: string): Track[] {
    const songs = this.getCachedTracks();
    return songs[year] ?? false;
  }

  cacheYear(year: string, data: Track[]) {
    const songs = this.getCachedTracks();
    songs[year] = data;
    window.localStorage.setItem("songs", JSON.stringify(this.compress(songs)));
  }

  async getYear(year: string) {
    const cache = this.getCachedYear(year);
    if (cache) return cache;

    const result = await fetch(this.getURL(year));
    const json = await result.json();
    const tracks = this.transformResponse(json);

    this.cacheYear(year, tracks);

    return tracks;
  }

  async getYears(years: string[]) {
    const list = await Promise.all(years.map((year) => this.getYear(year)));
    return Object.fromEntries(
      list.map((tracks, index) => [years[index], tracks])
    );
  }

  async getSongs(years: string[]) {
    const all = await this.getYears(years);

    let tracks = this.compress(all);

    tracks = tracks.map((track) => {
      const positions = Object.values(track.positions);
      track.position = Math.round(
        positions.reduce((acc, cur) => acc + cur, 0) / positions.length
      );
      return track;
    });

    for (const [index, track] of tracks.entries()) {
      track.position = index + 1;
      track.apiPrefPosition = track.position;
    }

    return this.enhanceSongs(tracks);
  }

  enhanceSongs(songs: MultiYearTrack[]): EnhancedTrack[] {
    return songs.map((song) => {
      // total change
      const changes: Record<string, number> = {};
      const years = getYears(1999, new Date().getFullYear());

      for (const year of years) {
        const previous = song.previousPositions[year] || 2000;
        const current = song.positions[year] || 2000;
        changes[year] = previous - current;
      }

      const totalChange = Object.values(changes).reduce(
        (acc, cur) => acc + Math.abs(cur),
        0
      );

      const averageChange = Math.round(
        totalChange / Object.keys(song.positions).length
      );

      return {
        ...song,
        totalChange,
        averageChange,
        changes,
      };
    });
  }

  decompress(years: MultiYearTrack[]): Record<string, Track[]> {
    const result = new Map();

    for (const song of years) {
      for (const year in song.positions) {
        if (!result.has(year)) {
          result.set(year, []);
        }

        result.get(year).push({
          ...song,
          position: song.positions[year],
          apiPrefPosition: song.previousPositions[year],
        });
      }
    }

    return Object.fromEntries(result);
  }

  compress(years: Record<string, Track[]>): MultiYearTrack[] {
    const tracks = new Map();

    for (const year in years) {
      for (const song of years[year]) {
        if (!tracks.has(song.id)) {
          tracks.set(song.id, {
            ...song,
            positions: {},
            previousPositions: {},
          });
        }
        tracks.get(song.id).positions[year] = song.position;
        tracks.get(song.id).previousPositions[year] = song.apiPrefPosition;
      }
    }

    return Array.from(tracks.values());
  }

  transformResponse(response: ApiResponse): Track[] {
    return response.positions.map((position) => {
      const coverURL =
        position.track?.coverUrl ??
        "https://www.nporadio2.nl/images/unknown_track_m.webp";
      const id = getTrackId(position);
      return {
        artist: position.track.artist,
        title: position.track.title,
        image: downSize(coverURL, 200, 200),
        position: position.position.current,
        apiPrefPosition: position.position.previous,
        change: 0,
        isNew: false,
        id,
      };
    });
  }
}
