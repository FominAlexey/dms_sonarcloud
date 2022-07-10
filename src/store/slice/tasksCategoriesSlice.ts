import { ErrorObject, NetworkError } from 'src/shared/Common';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { zeroGuid } from 'src/shared/Constants';
import {
    TaskCategory,
    getTaskCategories,
    TaskCategoryEdit,
    postTaskCategory,
    putTaskCategory,
    deleteTaskCategory,
    getTaskCategory,
} from 'src/DAL/Dictionaries';
import { AxiosResponse } from 'axios';
import { loginAsyncThunk } from './accountSlice';

export interface TaskCategoriesState {
    loading: boolean;
    posting: boolean;
    taskCategories: TaskCategory[];
    current: TaskCategoryEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;
    needToUpdate: boolean;
    error: ErrorObject | null;
}

const InitialTaskCategoriesState: TaskCategoriesState = {
    loading: false,
    posting: false,
    taskCategories: [],
    current: null,
    isAdding: false,
    isDeleting: false,
    isEditing: false,
    needToUpdate: true,
    error: null,
};

//#region -------------- AsyncThunk ----------------------------

export const getTaskCategoriesAsyncThunk = createAsyncThunk<
    TaskCategory[],
    void,
    {
        rejectValue: NetworkError;
    }
>('tasksCategories/getTaskCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await getTaskCategories();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postTaskCategoryAsyncThunk = createAsyncThunk<
    boolean,
    TaskCategoryEdit,
    {
        rejectValue: NetworkError;
    }
>('taskCategories/postTaskCategory', async (taskCategory, { rejectWithValue }) => {
    try {
        await postTaskCategory(taskCategory);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putTaskCategoryAsyncThunk = createAsyncThunk<
    boolean,
    TaskCategoryEdit,
    {
        rejectValue: NetworkError;
    }
>('taskCategories/putTaskCategory', async (taskCategory, { rejectWithValue }) => {
    try {
        await putTaskCategory(taskCategory);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteTaskCategoryAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('taskCategories/deleteTaskCategory', async (id, { rejectWithValue }) => {
    try {
        await deleteTaskCategory(id);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletingTaskCategoryAsyncThunk = createAsyncThunk<
    TaskCategoryEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('taskCategories/deletingTaskCategory', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<TaskCategoryEdit> = await getTaskCategory(id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingTaskCategoryAsyncThunk = createAsyncThunk<
    TaskCategoryEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('taskCategories/editingTaskCategory', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<TaskCategoryEdit> = await getTaskCategory(id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//#endregion ---------------------------------------------------

const tasksCategoriesSlice = createSlice({
    name: 'tasksCategories',
    initialState: InitialTaskCategoriesState,
    reducers: {
        addingTaskCategory(state) {
            const taskCategory: TaskCategoryEdit = {
                id: zeroGuid,
                name: undefined,
            };

            state.isAdding = true;
            state.current = taskCategory;
        },
        clearTaskCategory(state) {
            state.current = null;
            state.isAdding = false;
            state.isDeleting = false;
            state.isEditing = false;
        },
        clearErrorTaskCategories(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder

            //#region ---------------- getTaskCategories --------------------
            .addCase(getTaskCategoriesAsyncThunk.pending, state => {
                state.loading = true;
                state.taskCategories = [];
            })
            .addCase(getTaskCategoriesAsyncThunk.fulfilled, (state, action: PayloadAction<TaskCategory[]>) => {
                state.taskCategories = action.payload;
                state.loading = false;
                state.needToUpdate = false;
            })
            .addCase(getTaskCategoriesAsyncThunk.rejected, (state, action) => {
                state.loading = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить список категорий задач',
                        error: action.error.message,
                    };
            })
            //#endregion ---------------------------------------------------

            //#region ---------------- postTaskCategory --------------------

            .addCase(postTaskCategoryAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postTaskCategoryAsyncThunk.fulfilled, state => {
                state.current = null;
                state.isAdding = false;
                state.needToUpdate = true;
                state.posting = false;
            })
            .addCase(postTaskCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };

                state.posting = false;
            })

            //#endregion --------------------------------------------------

            //#region ---------------- putTaskCategory --------------------

            .addCase(putTaskCategoryAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(putTaskCategoryAsyncThunk.fulfilled, state => {
                state.isEditing = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(putTaskCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };

                state.posting = false;
            })

            //#endregion -------------------------------------------------------

            //#region ---------------- deleteTaskCategory --------------------
            .addCase(deleteTaskCategoryAsyncThunk.fulfilled, state => {
                state.isDeleting = false;
                state.needToUpdate = true;
                state.current = null;
            })
            .addCase(deleteTaskCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить удаление', error: action.error.message };
            })
            //#endregion

            //#region ---------------- deletingTaskCategory --------------------
            .addCase(deletingTaskCategoryAsyncThunk.fulfilled, (state, action: PayloadAction<TaskCategoryEdit>) => {
                state.current = action.payload;
                state.isDeleting = true;
            })
            .addCase(deletingTaskCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию о категории',
                        error: action.error.message,
                    };
            })
            //#endregion

            //#region ---------------- editingTaskCategory --------------------
            .addCase(editingTaskCategoryAsyncThunk.fulfilled, (state, action: PayloadAction<TaskCategoryEdit>) => {
                state.isEditing = true;
                state.current = action.payload;
            })
            .addCase(editingTaskCategoryAsyncThunk.rejected, (state, action) => {
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

export const { addingTaskCategory, clearTaskCategory, clearErrorTaskCategories } = tasksCategoriesSlice.actions;
export default tasksCategoriesSlice.reducer;
