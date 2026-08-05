import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    initEpsPayment: builder.mutation({
      query: (orderId: string) => ({
        url: `/payment/eps/init/${orderId}`,
        method: "POST",
      }),
      invalidatesTags: [tagTypes.order],
    }),
    verifyEpsPayment: builder.query({
      query: (orderId: string) => ({
        url: `/payment/eps/verify/${orderId}`,
        method: "GET",
      }),
      providesTags: (_r, _e, id) => [{ type: tagTypes.order, id }],
    }),
  }),
});

export const { useInitEpsPaymentMutation, useVerifyEpsPaymentQuery } =
  paymentApi;
