import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mockSignIn } from "../../mock/mockAuthApi";

export const signIn = createAsyncThunk(
  "auth/signIn",
  async ({ username }: { username: string }) => {
    const user = await mockSignIn(username);
    return user;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null as null | { username: string },
    status: "idle" as string,
  },
  reducers: {
    signOut(state) {
      state.user = null;
    },
  },
  extraReducers(builder) {
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;
