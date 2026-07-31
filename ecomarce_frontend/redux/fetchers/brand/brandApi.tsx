import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

// Brand type
export interface Brand {
  message(message: any): unknown;
  data(data: any): unknown;
  id: string;
  logo: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const BrandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Add new brand
    addNewBrand: builder.mutation({
      query: (data) => ({
        url: `/brand`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.brand],
    }),

    // Update brand info
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `/brand/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.brand],
    }),

    // Get all brands
    getAllBrand: builder.query<{ data: Brand[] }, void>({
      query: () => ({
        url: "/brand",
        method: "GET",
      }),
      providesTags: [tagTypes.brand],
    }),

    // Update only brand logo
    updateBrandImage: builder.mutation<Brand, { id: string; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/brand/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.brand],
    }),

    // Get single brand
    getSingleBrand: builder.query<Brand, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.brand],
    }),

    // Delete brand
    deleteBrand: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/brand/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.brand],
    }),
  }),
});

export const {
  useAddNewBrandMutation,
  useUpdateBrandMutation,
  useGetAllBrandQuery,
  useGetSingleBrandQuery,
  useDeleteBrandMutation,
  useUpdateBrandImageMutation,
} = BrandApi;
