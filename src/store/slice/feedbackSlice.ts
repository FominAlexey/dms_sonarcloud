import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sendFeedback } from 'src/DAL/Feedback';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { loginAsyncThunk } from './accountSlice';

export interface FeedbackState {
    isAdding: boolean;
    result: boolean;
    posting: boolean;
    error: ErrorObject | null;
}

const InitialFeedbackState: FeedbackState = {
    isAdding: false,
    result: false,
    posting: false,
    error: null,
};

export const sendFeedbackAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('feedback/sendFeedback', async (message, { rejectWithValue }) => {
    try {
        await sendFeedback(message);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const feedbackSlice = createSlice({
    name: 'feedback',
    initialState: InitialFeedbackState,
    reducers: {
        addingFeedback(state) {
            state.isAdding = true;
        },
        clearFeedback(state) {
            state.isAdding = false;
        },
        clearErrorFeedback(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(sendFeedbackAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(sendFeedbackAsyncThunk.fulfilled, (state, action: PayloadAction<boolean>) => {
                state.isAdding = false;
                state.posting = false;
                state.result = action.payload;
            })
            .addCase(sendFeedbackAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось отправить отзыв', error: action.error.message };
            })

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { addingFeedback, clearFeedback, clearErrorFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
