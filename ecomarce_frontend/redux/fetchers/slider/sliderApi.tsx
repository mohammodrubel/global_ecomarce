// /slider
import { baseApi } from "@/redux/api/baseApi";
import { tagTypes } from "@/redux/TagTypes";

export const sliderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Create
    addSlider: builder.mutation({
      query: (data) => ({
        url: `/slider`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [tagTypes.slider],
    }),

    // Get all
    getAllSliders: builder.query({
      query: () => ({
        url: `/slider`,
        method: "GET",
      }),
      providesTags: [tagTypes.slider],
    }),

    // Get single
    getSingleSlider: builder.query({
      query: (id: string) => ({
        url: `/slider/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.slider],
    }),

    // Update
    updateSlider: builder.mutation({
      query: ({ id, data }) => ({
        url: `/slider/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [tagTypes.slider],
    }),

  
    // Delete
    deleteSlider: builder.mutation({
      query: (id: string) => ({
        url: `/slider/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [tagTypes.slider],
    }),
  }),
});

export const {
  useAddSliderMutation,
  useGetAllSlidersQuery,
  useGetSingleSliderQuery,
  useUpdateSliderMutation,
  useDeleteSliderMutation,
} = sliderApi;
