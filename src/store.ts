import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export type Track = {
  id: string;
  artist: string;
  title: string;
  image: string;
  position: number;
  change: number;
  isNew: boolean;
  apiPrefPosition?: number;
  prefPosition?: number;
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
  input = input.toLowerCase();

  // remove  à etc
  input = input.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const empty = [
    "and",
    "the",
    "de",
    "en",
    "&",
    "n'",
    "ng",
    "pts",
    "part",
    "sta",
    "ster",
    "'m",
    "'em",
  ];
  for (const word of empty) {
    const regex = new RegExp(word, "gi");
    input = input.replace(regex, "");
  }

  input = input
    .toLowerCase()
    .replaceAll(/\(.*\)/g, "")
    .replaceAll(/['"()`,/.!?]/g, "")
    .replaceAll(/\s/g, "");

  // sort letters alphabetically
  input = input.split("").sort().join("");
  return input;
};

const getId = (position: ApiYear) => {
  const {
    track: { artist, title },
  } = position;
  return `${slugify(title)}${slugify(artist)}`;
};

const transformResponse = (response: ApiResponse): Track[] => {
  return response.positions.map((position) => {
    const coverURL =
      position.track?.coverUrl ??
      "https://www.nporadio2.nl/images/unknown_track_m.webp";
    const id = getId(position);
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
