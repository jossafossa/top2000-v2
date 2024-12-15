import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export type Track = {
  id: string;
  artist: string;
  title: string;
  image: string;
  position: number;
  change?: number;
};

type ApiYear = {
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
  positions: ApiYear[];
};

const downSize = (inputUrl: string, width: number, height: number) => {
  const url = new URL(inputUrl);
  const params = new URLSearchParams(url.search);
  params.set("width", width.toString());
  params.set("height", height.toString());

  return `${url.origin}${url.pathname}?${params.toString()}`;
};

const slugify = (input: string) => {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/['"()`]/g, "");
};

const getId = (position: ApiYear) => {
  const {
    track: { artist, title },
  } = position;
  return `${slugify(artist)}-${slugify(title)}`;
};

const transformResponse = (response: ApiResponse): Track[] => {
  return response.positions.map((position) => {
    const coverURL =
      position.track?.coverUrl ??
      "https://www.nporadio2.nl/images/unknown_track_m.webp";
    const id = position.track.id ?? getId(position);
    return {
      artist: position.track.artist,
      title: position.track.title,
      image: downSize(coverURL, 200, 200),
      position: position.position.current,
      id,
    };
  });
};

// Define a service using a base URL and expected endpoints
export const top2000 = createApi({
  reducerPath: "top2000",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.nporadio2.nl/api/charts/",
  }),
  endpoints: (builder) => ({
    getYear: builder.query<Track[], number>({
      query: (year) => {
        if (year < 2024) return `top-2000-van-${year}-12-25`;
        return `npo-radio-2-top-2000-van-${year}-12-25`;
      },
      transformResponse,
    }),
  }),
});

export const store = configureStore({
  reducer: {
    [top2000.reducerPath]: top2000.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(top2000.middleware),
});

setupListeners(store.dispatch);

export const { useGetYearQuery } = top2000;
