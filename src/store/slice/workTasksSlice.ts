import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WorkTask, getWorkTasks, postWorkTask, putWorkTask, getWorkTask } from 'src/DAL/TimeTracking';
import { AxiosResponse } from 'axios';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { zeroGuid } from 'src/shared/Constants';
import { loginAsyncThunk } from './accountSlice';

export interface WorkTasksState {
    loading: boolean;
    posting: boolean;
    workTasks: WorkTask[];
    current: WorkTask | null;
    postedResult: WorkTask | null;
    isAdding: boolean;
    isEditing: boolean;
    needToUpdate: boolean;
    error: ErrorObject | null;
}

const InitialWorkTasksState: WorkTasksState = {
    loading: false,
    posting: false,
    workTasks: [],
    current: null,
    postedResult: null,
    isAdding: false,
    isEditing: false,
    needToUpdate: false,
    error: null,
};

//#region ----------------- AsyncThunk --------------------------
export const getWorkTasksAsyncThunk = createAsyncThunk<
    WorkTask[],
    string | null,
    {
        rejectValue: NetworkError;
    }
>('workTasks/getWorkTasks', async (employeeId = null, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<WorkTask[]> = await getWorkTasks(employeeId);
        const workTasks = response.data;
        return workTasks;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postWorkTaskAsyncThunk = createAsyncThunk<
    boolean,
    WorkTask,
    {
        rejectValue: NetworkError;
    }
>('workTasks/postWorkTask', async (workTask, { rejectWithValue }) => {
    try {
        await postWorkTask(workTask);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putWorkTaskAsyncThynk = createAsyncThunk<
    boolean,
    WorkTask,
    {
        rejectValue: NetworkError;
    }
>('workTasks/putWorkTask', async (workTask, { rejectWithValue }) => {
    try {
        await putWorkTask(workTask);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingWorkTaskAsyncThunk = createAsyncThunk<
    WorkTask,
    string,
    {
        rejectValue: NetworkError;
    }
>('workTasks/editingWorkTask', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<WorkTask> = await getWorkTask(id);
        const workTask = response.data;
        return workTask;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//#endregion

const workTasksSlice = createSlice({
    name: 'workTasks',
    initialState: InitialWorkTasksState,
    reducers: {
        addingWorkTask(state) {
            const workTask: WorkTask | null = {
                id: zeroGuid,
                projectId: zeroGuid,
                projectName: '',
                taskCategoryId: zeroGuid,
                taskCategoryName: '',
                employeeId: '',
            };

            state.isAdding = true;
            state.current = workTask;
        },
        clearWorkTask(state) {
            state.isAdding = false;
            state.isEditing = false;
            state.postedResult = null;
            state.current = null;
        },
        clearErrorWorkTasks(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            //#region ------------------ getWorkTasks -----------------------
            .addCase(getWorkTasksAsyncThunk.pending, state => {
                state.loading = true;
                state.workTasks = [];
            })
            .addCase(getWorkTasksAsyncThunk.fulfilled, (state, action: PayloadAction<WorkTask[]>) => {
                state.workTasks = action.payload;
                state.loading = false;
                state.needToUpdate = false;
            })
            .addCase(getWorkTasksAsyncThunk.rejected, (state, action) => {
                state.loading = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить список задач', error: action.error.message };
            })
            //#endregion

            //#region ------------------ postWorkTask -----------------------
            .addCase(postWorkTaskAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postWorkTaskAsyncThunk.fulfilled, state => {
                state.postedResult = null;
                state.current = null;
                state.isAdding = false;
                state.needToUpdate = true;
                state.posting = false;
            })
            .addCase(postWorkTaskAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ------------------ putWorkTask -----------------------
            .addCase(putWorkTaskAsyncThynk.pending, state => {
                state.posting = true;
            })
            .addCase(putWorkTaskAsyncThynk.fulfilled, state => {
                state.isEditing = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(putWorkTaskAsyncThynk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ------------------ editingWorkTask -----------------------
            .addCase(editingWorkTaskAsyncThunk.fulfilled, (state, action: PayloadAction<WorkTask>) => {
                state.isEditing = true;
                state.current = action.payload;
            })
            .addCase(editingWorkTaskAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить инфромацию о задаче', error: action.error.message };
            })
            //#endregion

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { addingWorkTask, clearWorkTask, clearErrorWorkTasks } = workTasksSlice.actions;
export default workTasksSlice.reducer;
