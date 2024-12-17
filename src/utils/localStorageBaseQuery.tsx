import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

type localStorageBaseQueryOptions = {
  baseUrl: string;
  cacheSet?: ({
    data,
    url,
    params,
  }: {
    data: unknown;
    params: unknown;
    url: string;
  }) => void;
  cacheGet?: ({ url, params }: { url: string; params: unknown }) => unknown;
};

export const localStorageBaseQuery = ({
  baseUrl,
  cacheSet,
  cacheGet,
}: localStorageBaseQueryOptions): BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> => {
  const baseQuery = fetchBaseQuery({ baseUrl });

  return async (args, api, extraOptions) => {
    const url = typeof args === "string" ? args : args.url;

    const params = api.queryCacheKey
      ?.replaceAll(api.endpoint, "")
      .replaceAll(/[()]*/g, "");

    // If a custom cacheGet function is defined, use it
    if (cacheGet) {
      const cachedData = cacheGet({ url, params });
      if (cachedData) {
        return { data: cachedData };
      }
    }

    // Fallback to network request if not cached
    const result = await baseQuery(args, api, extraOptions);

    // If a custom cacheSet function is defined, use it
    if (cacheSet && result.data) {
      cacheSet({ data: result.data, url, params });
    }

    return result;
  };
};
