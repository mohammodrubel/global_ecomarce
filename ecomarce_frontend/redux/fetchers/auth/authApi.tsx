import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query({
      query: () => ({
        url: `/user/me`,
        method: "GET",
      }),
      providesTags: [tagTypes.user],
    }),
    updateMe: builder.mutation({
      query: (data) => ({
        url: `/user/me`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    updateMyPhoto: builder.mutation<{ success: boolean; data: any }, FormData>({
      query: (data) => ({
        url: `/user/me/photo`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.user],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/auth/change-password`,
        method: "PATCH",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: "POST",
        body: data,
      }),
    }),
    logoutFromDb: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useMeQuery,
  useUpdateMeMutation,
  useUpdateMyPhotoMutation,
  useChangePasswordMutation,
  useLoginMutation,
  useLogoutFromDbMutation,
  useRegisterMutation,
} = authApi;
