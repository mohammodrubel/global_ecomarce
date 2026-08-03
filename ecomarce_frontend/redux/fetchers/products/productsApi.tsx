import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewProduct: builder.mutation({
      query: (data) => ({
        url: `/products`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    updateProductImages: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}/images`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: [tagTypes.product],
    }),

    getAllProducts: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        args?.forEach(({ name, value }: any) => {
          if (value !== undefined && name !== undefined) {
            // Handle array values
            if (Array.isArray(value)) {
              value.forEach((item) => params.append(name, item));
            } else {
              params.append(name, value);
            }
          }
        });

        return {
          url: `/products?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: [tagTypes.product],
    }),
    getAllfetchersProducts: builder.query({
      query: () => ({
        url: "/products/fetchers-products",
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),

    getAllNewProducts: builder.query({
      query: () => ({
        url: "/products/new-products",
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),

    getBestsellerProducts: builder.query({
      query: (limit: number = 20) => ({
        url: `/products/bestsellers?limit=${limit}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),

    getSingleProduct: builder.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.product],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.product],
    }),
  }),
});

export const {
  useAddNewProductMutation,
  useUpdateProductMutation,
  useUpdateProductImagesMutation,
  useGetAllProductsQuery,
  useGetSingleProductQuery,
  useDeleteProductMutation,
  useGetAllfetchersProductsQuery,
  useGetAllNewProductsQuery,
  useGetBestsellerProductsQuery,
} = productApi;
