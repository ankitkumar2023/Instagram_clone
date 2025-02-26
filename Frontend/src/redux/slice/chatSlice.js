import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        selectedUser: null,
        onLineUsers: [],
        messages:[]
    },
    reducers: {
        setSelectedUser: (state,action) => {
            state.selectedUser = action.payload;
        },
        setOnLineUsers: (state,action) => {
            state.onLineUsers = action.payload
        },
        setMessages: (state,action) => {
            state.messages = action.payload
        }
    }
})

export const { setSelectedUser,setOnLineUsers,setMessages } = chatSlice.actions;
export default chatSlice.reducer;