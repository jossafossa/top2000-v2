import { createApi } from "@reduxjs/toolkit/query/react";
import { configureStore } from "@reduxjs/toolkit";
import { fetchBaseQuery, setupListeners } from "@reduxjs/toolkit/query";
// import { localStorageBaseQuery } from "./utils/localStorageBaseQuery";
// import { compressTracks, decompressTracks } from "./utils/compressTracks";
import { getTrackId } from "./utils/getTrackId";

export type Track = {
  id: string;
  artist: string;
  title: string;
  image: string;
  position: number;
  change: number;
  isNew: boolean;
  apiPrefPosition: number;
  positions?: number[];
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

const downSize = (inputUrl: string, width: number, height: number) => {
  const url = new URL(inputUrl);
  const params = new URLSearchParams(url.search);
  params.set("width", width.toString());
  params.set("height", height.toString());

  return `${url.origin}${url.pathname}?${params.toString()}`;
};

const transformResponse = (response: ApiResponse): Track[] => {
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
};

// const cacheGet = (key: string) => {
//   const data = window.localStorage.getItem(key);
//   return data ? JSON.parse(data) : [];
// };

// const cacheSet = (key: string, data: Track[]) => {
//   window.localStorage.setItem(key, JSON.stringify(data));
// };

// Define a service using a base URL and expected endpoints
export const top2000 = createApi({
  reducerPath: "top2000",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.nporadio2.nl/api/charts/",
    // cacheSet: ({
    //   data,
    //   url,
    //   params,
    // }: {
    //   data: ApiResponse;
    //   url: string;
    //   params: string;
    // }) => {
    //   const tracks = cacheGet("getYear");
    //   const years = decompressTracks(tracks);
    //   years[params] = data.positions;

    //   console.log(years);
    //   const compressed = compressTracks(years);

    //   console.log("setting cache", { params, years, compressed });
    //   cacheSet("getYear", compressed);
    // },
    // cacheGet: ({ url, params }: { url: string; params: string }) => {
    //   const tracks = cacheGet("getYear");

    //   const years = decompressTracks(tracks);

    //   console.log(years);

    //   if (years[params]) {
    //     return { positions: years[params] };
    //   }
    // },
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
