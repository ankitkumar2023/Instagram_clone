import { createSlice } from "@reduxjs/toolkit";

const realTimeNotificationSlice = createSlice({
    name: "realTimeNotification",
    initialState: {
        likeNotifications: [] // ✅ Always start as an empty array
    },
    reducers: {
        setLikeNotifications: (state, action) => {
            if (!Array.isArray(state.likeNotifications)) {
                state.likeNotifications = []; // ✅ Ensure it's an array
            }

            if (action.payload.type === "like") {
                state.likeNotifications.push(action.payload);
            } else if (action.payload.type === "dislike") {
                state.likeNotifications = state.likeNotifications.filter(
                    (item) => item?.userId !== action.payload.userId
                );
            }
        }
    }
});

export const { setLikeNotifications } = realTimeNotificationSlice.actions;
export default realTimeNotificationSlice.reducer;
