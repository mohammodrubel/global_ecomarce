import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewBanner: builder.mutation({
      query: (data) => ({
        url: `/banner`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.banner],
    }),

    updateBanner: builder.mutation({
      query: ({ id, data }) => ({
        url: `/banner/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.banner],
    }),

    getAllBanners: builder.query({
      query: () => ({
        url: "/banner",
        method: "GET",
      }),
      providesTags: [tagTypes.banner],
    }),

    getSingleBanner: builder.query({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.banner],
    }),

    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `/banner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.banner],
    }),
  }),
});

export const {
  useAddNewBannerMutation,
  useUpdateBannerMutation,
  useGetAllBannersQuery,
  useGetSingleBannerQuery,
  useDeleteBannerMutation,
} = bannerApi;
