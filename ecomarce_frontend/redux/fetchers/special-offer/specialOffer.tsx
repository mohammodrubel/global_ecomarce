// /special-offer
import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const specialOfferApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create
    addSpecialOffer: builder.mutation({
      query: (data) => ({
        url: `/special-offer`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.specialoffer],
    }),

    // Get all
    getAllSpecialOffers: builder.query({
      query: () => ({
        url: `/special-offer`,
        method: "GET",
      }),
      providesTags: [tagTypes.specialoffer],
    }),

    // Get single
    getSingleSpecialOffer: builder.query({
      query: (id: string) => ({
        url: `/special-offer/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.specialoffer],
    }),

    // Update
    updateSpecialOffer: builder.mutation({
      query: ({ id, data }) => ({
        url: `/special-offer/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.specialoffer],
    }),

    // Update image
    updateSpecialOfferImage: builder.mutation({
      query: ({ id, data }) => ({
        url: `/special-offer/${id}/image`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.specialoffer],
    }),

    // Delete
    deleteSpecialOffer: builder.mutation({
      query: (id: string) => ({
        url: `/special-offer/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.specialoffer],
    }),
  }),
});

export const {
  useAddSpecialOfferMutation,
  useGetAllSpecialOffersQuery,
  useGetSingleSpecialOfferQuery,
  useUpdateSpecialOfferMutation,
  useUpdateSpecialOfferImageMutation,
  useDeleteSpecialOfferMutation,
} = specialOfferApi;
