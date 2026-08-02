import { Product } from "@/lib/type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "sonner";

interface CartState {
  product: Product[];
  totalQuantity: number;
  totalAmount: number;
}

const initialState: CartState = {
  product: [],
  totalQuantity: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingProduct = state.product.find(
        (item) => item.id === action.payload.id
      );

      if (existingProduct) {
        existingProduct.quantity += 1;

        state.totalQuantity += 1;
        state.totalAmount += existingProduct.price;

        toast.info("Quantity increased in cart ");
      } else {
        state.product.push({ ...action.payload, quantity: 1 });

        state.totalQuantity += 1;
        state.totalAmount += action.payload.price;

        toast.success("Product added to cart ");
      }
    },

    incrementQuantity: (state, action: PayloadAction<{ id: string }>) => {
      const existingProduct = state.product.find(
        (item) => item.id === action.payload.id
      );

      if (existingProduct) {
        existingProduct.quantity += 1;
        state.totalQuantity += 1;
        state.totalAmount += existingProduct.price;

        toast.success("Quantity increased ");
      }
    },

    decrementQuantity: (state, action: PayloadAction<{ id: string }>) => {
      const existingProduct = state.product.find(
        (item) => item.id === action.payload.id
      );

      if (!existingProduct) return;

      if (existingProduct.quantity > 1) {
        existingProduct.quantity -= 1;
        state.totalQuantity -= 1;
        state.totalAmount -= existingProduct.price;

        toast.info("Quantity decreased ");
      } else {
        state.product = state.product.filter(
          (item) => item.id !== action.payload.id
        );

        state.totalQuantity -= 1;
        state.totalAmount -= existingProduct.price;

        toast.error("Product removed from cart ");
      }
    },

    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const existingProduct = state.product.find(
        (item) => item.id === action.payload.id
      );

      if (!existingProduct) return;

      state.totalQuantity -= existingProduct.quantity;
      state.totalAmount -= existingProduct.price * existingProduct.quantity;
      state.product = state.product.filter(
        (item) => item.id !== action.payload.id
      );

      toast.error("Product removed from cart ");
    },

    removeCart: (state) => {
      if (state.product.length === 0) {
        toast.warning("Cart is already empty ");
        return;
      }

      state.product = [];
      state.totalAmount = 0;
      state.totalQuantity = 0;

      toast.success("Cart cleared ");
    },
  },
});

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  removeCart,
} = cartSlice.actions;

export default cartSlice.reducer;