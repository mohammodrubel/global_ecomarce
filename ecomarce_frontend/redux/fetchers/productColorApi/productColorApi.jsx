import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const productColorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    addNewProductColor: builder.mutation({
      query: (data) => ({
        url: `/product-color`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.productColor],
    }),

    updateProductColor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/product-color/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.productColor],
    }),

    getAllProductColor: builder.query({
      query: () => ({
        url: "/product-color",
        method: "GET",
      }),
      providesTags: [tagTypes.productColor],
    }),

    getSingleProductColor: builder.query({
      query: (id) => ({
        url: `/product-color/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.productColor],
    }),

    deleteProductColor: builder.mutation({
      query: (id) => ({
        url: `/product-color/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.productColor],
    }),
  }),
});

// Export hooks
export const {
  useAddNewProductColorMutation,
  useUpdateProductColorMutation,
  useGetAllProductColorQuery,
  useGetSingleProductColorQuery,
  useDeleteProductColorMutation,
} = productColorApi;
