// features/siteDiary/api/siteDiaryApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getApiBaseUrl } from "../../../config";

/* --------------------------------------
   INTERFACES
---------------------------------------*/
export interface SiteDiaryProject {
  id: string;
  name: string;
  code: string;
}

export interface SiteDiaryItem {
  id: string;
  projectId: string;
  date: string; // ISO string
  weather: "SUNNY" | "RAINY" | "PARTLY_CLOUDY";
  manpower: number;
  equipment: number;
  workDone: string;
  issues?: string;
  createdAt?: string;
  updatedAt?: string;

  // Returned in GET ALL response
  project?: { id: string; name: string; code?: string };

  // Returned in GET ALL response
  reportedByUser?: { fullName: string; email: string };
}

/* --------------------------------------
   API SETUP
---------------------------------------*/
export const siteDiaryApi = createApi({
  reducerPath: "siteDiaryApi",

  baseQuery: fetchBaseQuery({
    baseUrl: getApiBaseUrl(),
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),

  tagTypes: ["SiteDiary", "SiteDiaryProjects"],

  endpoints: (builder) => ({
    /* --------------------------------------
       GET ALL (Pagination + Search + Filters)

       SEARCH:
       → search = project.name OR weather

       FILTERS:
       → projectId
       → startDate (createdAt)
       → endDate (createdAt)
    ---------------------------------------*/
    getSiteDiaries: builder.query<
      {
        data: { siteDiaryList: SiteDiaryItem[] };
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      },
      {
        page?: number;
        limit?: number;
        search?: string; // project name + weather
        projectId?: string;
        startDate?: string;
        endDate?: string;
      }
    >({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        projectId = "",
        startDate = "",
        endDate = "",
      }) => {
        const params = new URLSearchParams();

        params.append("page", String(page));
        params.append("limit", String(limit));

        // SEARCH — backend must search project.name + weather
        if (search.trim()) params.append("search", search.trim());

        // FILTERS
        if (projectId) params.append("projectId", projectId);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return `/site-diary?${params.toString()}`;
      },

      providesTags: ["SiteDiary"],
    }),

    /* --------------------------------------
       GET BY ID
    ---------------------------------------*/
    getSiteDiaryById: builder.query<{ data: SiteDiaryItem }, string>({
      query: (id) => `/site-diary/${id}`,
      providesTags: ["SiteDiary"],
    }),

    /* --------------------------------------
       CREATE
    ---------------------------------------*/
    createSiteDiary: builder.mutation<SiteDiaryItem, Partial<SiteDiaryItem>>({
      query: (payload) => ({
        url: `/site-diary`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["SiteDiary"],
    }),

    /* --------------------------------------
       UPDATE
    ---------------------------------------*/
    updateSiteDiary: builder.mutation<
      SiteDiaryItem,
      { id: string; payload: Partial<SiteDiaryItem> }
    >({
      query: ({ id, payload }) => ({
        url: `/site-diary/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["SiteDiary"],
    }),

    /* --------------------------------------
       DELETE multiple
    ---------------------------------------*/
    deleteSiteDiaries: builder.mutation<any, string[]>({
      query: (ids) => ({
        url: `/site-diary`,
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["SiteDiary"],
    }),

    /* --------------------------------------
       GET Projects For Dropdown
    ---------------------------------------*/
    getSiteDiaryProjects: builder.query<
      { data: { projects: SiteDiaryProject[] } },
      void
    >({
      query: () => `/site-diary/projects`,
      providesTags: ["SiteDiaryProjects"],
    }),
  }),
});

export const {
  useGetSiteDiariesQuery,
  useGetSiteDiaryByIdQuery,
  useCreateSiteDiaryMutation,
  useUpdateSiteDiaryMutation,
  useDeleteSiteDiariesMutation,
  useGetSiteDiaryProjectsQuery,
} = siteDiaryApi;
