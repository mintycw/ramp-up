import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Create the slice
export const contextSlice = createSlice({
    name: "context",
    initialState: {
        colorTheme: "dark",
        title: "Feed",
        toasts: [],
    },
    reducers: {
        updateColorTheme: (state, action) => {
            state.colorTheme = action.payload;
        },
        updateTitle: (state, action) => {
            state.title = action.payload;
        },
        addToast: (state, action) => {
            const { id, message, level, duration } = action.payload;
            state.toasts.push({ id, message, level, duration });
        },
        removeToast: (state, action) => {
            state.toasts = state.toasts.filter(
                (toast) => toast.id !== action.payload,
            );
        },
    },
});

export const showToast = createAsyncThunk(
    "context/showToast",
    async ({ message, level, duration = 3000 }, { dispatch }) => {
        // level: 0 info, 1 success, 2 error
        const id = Date.now(); // Use timestamp as a unique ID

        // Dispatch the addToast action
        dispatch(
            contextSlice.actions.addToast({ id, message, level, duration }),
        );

        // Remove toast after specified duration
        setTimeout(() => {
            dispatch(contextSlice.actions.removeToast(id));
        }, duration);
    },
);

// Export actions and reducer
export const { updateColorTheme, updateTitle, addToast, removeToast } =
    contextSlice.actions;
export default contextSlice.reducer;
