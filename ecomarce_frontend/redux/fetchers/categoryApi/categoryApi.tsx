import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const CategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addNewCategory: builder.mutation({
      query: (data) => ({
        url: `/category`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.category],
    }),

    updateCategory: builder.mutation({
      query: ({ id, data }) => ({
        url: `/category/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.category],
    }),

    getAllCategory: builder.query({
      query: () => ({
        url: "/category",
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),

    GetAllCategoryForRelations: builder.query({
      query: () => ({
        url: "/category/forrelations",
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),

    getSingleCategory: builder.query({
      query: (id) => ({
        url: `/category/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.category],
    }),

    DeleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.category],
    }),
  }),
});

export const {
  useAddNewCategoryMutation,
  useUpdateCategoryMutation, 
  useGetAllCategoryQuery,
  useGetSingleCategoryQuery,
  useDeleteCategoryMutation,
  useGetAllCategoryForRelationsQuery
} = CategoryApi;
