import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";



export const AdvertisementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add new advertisement
    addNewAdvertisement: builder.mutation({
      query: (data) => ({
        url: `/advertisement`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.advertisement],
    }),

    // Update advertisement info
    updateAdvertisement: builder.mutation({
      query: ({ id, data }) => ({
        url: `/advertisement/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.advertisement],
    }),

    // Get all advertisements
    getAllAdvertisement: builder.query({
      query: () => ({
        url: "/advertisement",
        method: "GET",
      }),
      providesTags: [tagTypes.advertisement],
    }),

    // Update only advertisement image
    updateAdvertisementImage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/advertisement/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.advertisement],
    }),

    // Get single advertisement
    getSingleAdvertisement: builder.query({
      query: (id) => ({
        url: `/advertisement/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.advertisement],
    }),

    // Delete advertisement
    deleteAdvertisement: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/advertisement/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.advertisement],
    }),
  }),
});

export const {
  useAddNewAdvertisementMutation,
  useUpdateAdvertisementMutation,
  useGetAllAdvertisementQuery,
  useGetSingleAdvertisementQuery,
  useDeleteAdvertisementMutation,
  useUpdateAdvertisementImageMutation,
} = AdvertisementApi;
