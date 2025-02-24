import { createSlice } from "@reduxjs/toolkit";

const PostSlice = createSlice({
    name: "post",
    initialState: {
        posts: []
    },
    reducers: {
        setPosts: (state, action) => { // ✅ Fix: Correct parameter order (state first)
            state.posts = action.payload;
        }
    }
});

export const { setPosts } = PostSlice.actions;
export default PostSlice.reducer;
