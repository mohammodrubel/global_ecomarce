import { Product } from "@/lib/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistState {
  product: Product[];
  totalwishlistProduct: number;
}

const initialState: WishlistState = {
  product: [],
  totalwishlistProduct: 0,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.product.find(
        (item) => item.id === action.payload.id
      );

      if (existingProduct) {
        // toggle wishlist property
        existingProduct.wishlist = !existingProduct.wishlist;
      } else {
        // add new product with wishlist true
        state.product.push({
          ...action.payload,
          wishlist: true,
        });
      }

      // update count
      state.totalwishlistProduct = state.product.filter(
        (item) => item.wishlist
      ).length;
    },

    removeFromWishlist: (state, action: PayloadAction<string>) => {
      const product = state.product.find(
        (item) => item.id === action.payload
      );

      if (product) {
        product.wishlist = false;
      }

      state.totalwishlistProduct = state.product.filter(
        (item) => item.wishlist
      ).length;
    },

    clearWishlist: (state) => {
      state.product.forEach((item) => {
        item.wishlist = false;
      });

      state.totalwishlistProduct = 0;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;