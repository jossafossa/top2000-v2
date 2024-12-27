import { createApi } from "@reduxjs/toolkit/query/react";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Top2000Api, Track, EnhancedTrack, Artist } from "@assets/Top2000Api";

const API = new Top2000Api();

type APiQueryOptions = {
  endpoint: keyof Top2000Api;
  arg: unknown;
};

const ApiQuery =
  (apiInstance: Top2000Api) =>
  async ({ endpoint, arg }: APiQueryOptions) => {
    if (typeof apiInstance[endpoint] === "function") {
      // @ts-expect-errore -- We only use one single arg
      const result = await apiInstance[endpoint](arg);
      return { data: result };
    } else {
      throw new Error(`Endpoint ${endpoint} does not exist.`);
    }
  };

export const top2000 = createApi({
  reducerPath: "top2000",
  baseQuery: ApiQuery(API),
  endpoints: (builder) => ({
    getYear: builder.query<Track[], string>({
      query: (year) => ({ endpoint: "getYear", arg: year }),
    }),
    getYears: builder.query<Track[], string[]>({
      query: (years) => ({ endpoint: "getYears", arg: years }),
    }),
    getSongs: builder.query<EnhancedTrack[], string[]>({
      query: (years) => ({ endpoint: "getSongs", arg: years }),
    }),
    getArtists: builder.query<Artist[], void>({
      query: () => ({ endpoint: "getArtists", arg: undefined }),
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

export const {
  useGetYearQuery,
  useGetYearsQuery,
  useGetSongsQuery,
  useGetArtistsQuery,
} = top2000;
