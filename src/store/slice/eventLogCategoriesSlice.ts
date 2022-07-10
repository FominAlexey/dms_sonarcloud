import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    EventLogCategory,
    getEventLogCategories,
    postEventLogCategory,
    putEventLogCategory,
    deleteEventLogCategory,
    getEventLogCategory,
} from 'src/DAL/Dictionaries';
import { AxiosResponse } from 'axios';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { zeroGuid } from 'src/shared/Constants';
import { loginAsyncThunk } from './accountSlice';

export interface EventLogCategoriesState {
    loading: boolean;
    posting: boolean;
    eventLogCategories: EventLogCategory[];
    current: EventLogCategory | null;
    postedResult: EventLogCategory | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;

    needToUpdate: boolean;
    error: ErrorObject | null;
}

const InitialEventLogCategoriesState: EventLogCategoriesState = {
    loading: false,
    posting: false,
    eventLogCategories: [],
    current: null,
    postedResult: null,
    isAdding: false,
    isEditing: false,
    isDeleting: false,
    needToUpdate: true,
    error: null,
};

//#region -------------- AsyncThunk ----------------------------
export const getEventLogCategoriesAsyncThunk = createAsyncThunk<
    EventLogCategory[],
    void,
    {
        rejectValue: NetworkError;
    }
>('eventLogCategories/getEventLogCategories', async (_, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EventLogCategory[]> = await getEventLogCategories();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postEventLogCategoryAsyncThunk = createAsyncThunk<
    boolean,
    EventLogCategory,
    {
        rejectValue: NetworkError;
    }
>('eventLogCategories/postEventLogCategory', async (eventLogCategory, { rejectWithValue }) => {
    try {
        await postEventLogCategory(eventLogCategory);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putEventLogCategoryAsyncThunk = createAsyncThunk<
    boolean,
    EventLogCategory,
    {
        rejectValue: NetworkError;
    }
>('eventLogCategories/putEventLogCategory', async (eventLogCategory, { rejectWithValue }) => {
    try {
        await putEventLogCategory(eventLogCategory);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteEventLogCategoryAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('eventLogCategories/deleteEventLogCategory', async (id, { rejectWithValue }) => {
    try {
        await deleteEventLogCategory(id);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletingEventLogCategoryAsyncThunk = createAsyncThunk<
    EventLogCategory,
    string,
    {
        rejectValue: NetworkError;
    }
>('eventLogCategories/deletingEventLogCategory', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EventLogCategory> = await getEventLogCategory(id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingEventLogCategoryAsyncThunk = createAsyncThunk<
    EventLogCategory,
    string,
    {
        rejectValue: NetworkError;
    }
>('eventLogCategories/editingEventLogCategory', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EventLogCategory> = await getEventLogCategory(id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
//#endregion

const eventLogCategoriesSlice = createSlice({
    name: 'eventLogCategories',
    initialState: InitialEventLogCategoriesState,
    reducers: {
        addingEventLogCategory(state) {
            const eventLogCategory: EventLogCategory = {
                id: zeroGuid,
                title: undefined,
                color: undefined,
                limit: 0,
            };

            state.isAdding = true;
            state.current = eventLogCategory;
        },
        clearEventLogCategory(state) {
            state.isEditing = false;
            state.isDeleting = false;
            state.current = null;
            state.postedResult = null;
        },
        clearErrorEventLogCategories(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder

            //#region ---------------- getEventLogCategories --------------------
            .addCase(getEventLogCategoriesAsyncThunk.pending, state => {
                state.eventLogCategories = [];
                state.loading = true;
            })
            .addCase(getEventLogCategoriesAsyncThunk.fulfilled, (state, action: PayloadAction<EventLogCategory[]>) => {
                state.eventLogCategories = action.payload;
                state.loading = false;
                state.needToUpdate = false;
            })
            .addCase(getEventLogCategoriesAsyncThunk.rejected, (state, action) => {
                state.loading = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить список категорий изменений в каледнаре',
                        error: action.error.message,
                    };
            })
            //#endregion

            //#region ---------------- postEventLogCategory --------------------
            .addCase(postEventLogCategoryAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postEventLogCategoryAsyncThunk.fulfilled, state => {
                state.postedResult = null;
                state.current = null;
                state.isAdding = false;
                state.needToUpdate = true;
                state.posting = false;
            })
            .addCase(postEventLogCategoryAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ---------------- putEventLogCategory --------------------
            .addCase(putEventLogCategoryAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(putEventLogCategoryAsyncThunk.fulfilled, state => {
                state.isEditing = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(putEventLogCategoryAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ---------------- deleteEventLogCategory --------------------
            .addCase(deleteEventLogCategoryAsyncThunk.fulfilled, state => {
                state.isDeleting = false;
                state.needToUpdate = true;
                state.current = null;
            })
            .addCase(deleteEventLogCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить удаление', error: action.error.message };
            })
            //#endregion

            //#region ---------------- deletingEventLogCategory --------------------
            .addCase(deletingEventLogCategoryAsyncThunk.fulfilled, (state, action: PayloadAction<EventLogCategory>) => {
                state.current = action.payload;
                state.isDeleting = true;
            })
            .addCase(deletingEventLogCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию о категории',
                        error: action.error.message,
                    };
            })
            //#endregion

            //#region ---------------- editingEventLogCategory --------------------
            .addCase(editingEventLogCategoryAsyncThunk.fulfilled, (state, action: PayloadAction<EventLogCategory>) => {
                state.isEditing = true;
                state.current = action.payload;
            })
            .addCase(editingEventLogCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию о категории',
                        error: action.error.message,
                    };
            })
            //#endregion

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { addingEventLogCategory, clearEventLogCategory, clearErrorEventLogCategories } =
    eventLogCategoriesSlice.actions;
export default eventLogCategoriesSlice.reducer;
