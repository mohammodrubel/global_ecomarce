import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: () => ({
        url: `/coupons`,
        method: "GET",
      }),
      providesTags: [tagTypes.coupon],
    }),
    getLatestCoupon: builder.query({
      query: () => ({
        url: `/coupons/latest`,
        method: "GET",
      }),
      providesTags: [tagTypes.coupon],
    }),
    createCoupon: builder.mutation({
      query: (data) => ({
        url: `/coupons`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    toggleCoupon: builder.mutation({
      query: (id: string) => ({
        url: `/coupons/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    deleteCoupon: builder.mutation({
      query: (id: string) => ({
        url: `/coupons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.coupon],
    }),
    applyCoupon: builder.mutation({
      query: (data: { code: string; subtotal: number }) => ({
        url: `/coupons/apply`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useGetLatestCouponQuery,
  useCreateCouponMutation,
  useToggleCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
} = couponApi;
