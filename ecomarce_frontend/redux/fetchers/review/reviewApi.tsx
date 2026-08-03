import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (data: { productId: string; rating: number; comment?: string }) => ({
        url: `/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.review, tagTypes.product],
    }),
    getProductReviews: builder.query({
      query: (productId: string) => ({
        url: `/reviews/product/${productId}`,
        method: "GET",
      }),
      providesTags: [tagTypes.review],
    }),
    getMyReviews: builder.query({
      query: () => ({
        url: `/reviews/me`,
        method: "GET",
      }),
      providesTags: [tagTypes.review],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetProductReviewsQuery,
  useGetMyReviewsQuery,
} = reviewApi;
