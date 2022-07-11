import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    TimeTracking,
    getTimeTrackings,
    mapTimeTrackingFromServer,
    TimeTrackingEdit,
    postTimeTracking,
    putTimeTracking,
    deleteTimeTracking,
    copyTimeTracking,
    getTimeTracking,
    mapTimeTrackingEditFromServer,
    TimeTrackingFromServer,
    TimeTrackingEditFromServer,
    TimeTrackingUpdate,
    getFileReportTimeTracking,
} from 'src/DAL/TimeTracking';
import { AxiosResponse } from 'axios';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { zeroGuid } from 'src/shared/Constants';
import { loginAsyncThunk } from './accountSlice';
import { getUserId } from 'src/shared/LocalStorageUtils';

export interface TimeTrackingsState {
    loading: boolean;
    posting: boolean;
    timeTrackings: TimeTracking[];
    current: TimeTrackingEdit | null;
    postedResult: TimeTrackingEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDisabled: boolean;
    needToUpdate: boolean;
    error: ErrorObject | null;
}

const InitialTimeTrackingsState: TimeTrackingsState = {
    loading: false,
    posting: false,
    timeTrackings: [],
    current: null,
    postedResult: null,
    isAdding: false,
    isEditing: false,
    isDisabled: false,
    needToUpdate: false,
    error: null,
};

export type GetTimeTrackingsInfoType = {
    projectId: string | null;
    employeeId: string | null;
    workTaskId: string | null;
    fromDate: Date | null;
    toDate: Date | null;
    billable: boolean | undefined;
};

type AddingTimeTrackingsInfoType = {
    projectId?: string | null;
    taskCategoryId?: string | null;
    startDate?: Date | null;
    billable: boolean | undefined;
    taskNumber?: string | null;
    taskName?: string | null;
    taskDescription?: string | null;
    taskIsDone: boolean | undefined;
};

const isValidDates = async (timeTracking: TimeTrackingEdit): Promise<boolean> => {
    // Get timeTrackings by worktask and period
    let timeTrackings: TimeTrackingEdit[] = [];

    let isExisists = false;

    const employeeId = getUserId();

    await getTimeTrackings(null, employeeId, null, timeTracking.startDate, timeTracking.startDate).then(res => {
        timeTrackings = res.data.map(mapTimeTrackingFromServer);
        // Check is exists time tracking
        isExisists = timeTrackings.some(
            e => e.projectId === timeTracking.projectId && e.taskCategoryId === timeTracking.taskCategoryId,
        );
    });

    if (isExisists) {
        return false;
    } else {
        return true;
    }
};

//#region ---------------- AsuncThunk --------------------------------
export const getTimeTrackingsAsyncThunk = createAsyncThunk<
    TimeTracking[],
    GetTimeTrackingsInfoType,
    {
        rejectValue: NetworkError;
    }
>('timeTrackings/getTimeTrackings', async (timeTrackingsInfo, { rejectWithValue }) => {
    try {
        const { projectId, employeeId, workTaskId, fromDate, toDate } = timeTrackingsInfo;
        const response: AxiosResponse<TimeTrackingFromServer[]> = await getTimeTrackings(
            projectId,
            employeeId,
            workTaskId,
            fromDate,
            toDate,
        );
        const timeTrackings = response.data.map(mapTimeTrackingFromServer);
        return timeTrackings;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postTimeTrackingAsyncThunk = createAsyncThunk<
    boolean,
    TimeTrackingEdit,
    {
        rejectValue: NetworkError;
    }
>('timeTrackings/postTimeTracking', async (timeTracking, { rejectWithValue }) => {
    try {
        if (await isValidDates(timeTracking)) {
            await postTimeTracking(timeTracking);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putTimeTrackingAsyncThunk = createAsyncThunk<
    boolean,
    TimeTrackingEdit,
    {
        rejectValue: NetworkError;
    }
>('timeTrackings/putTimeTracking', async (timeTracking, { rejectWithValue }) => {
    const timeTrackingUpdate: TimeTrackingUpdate = {
        id: timeTracking.id,
        startDate: timeTracking.startDate,
        timeSpent: timeTracking.timeSpent,
        billable: timeTracking.billable,
        taskNumber: timeTracking.taskNumber,
        taskName: timeTracking.taskName,
        taskDescription: timeTracking.taskDescription,
        taskIsDone: timeTracking.taskIsDone,
    };

    try {
        await putTimeTracking(timeTrackingUpdate);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteTimeTrackingAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('timeTrackings/deleteTimeTracking', async (id, { rejectWithValue }) => {
    try {
        await deleteTimeTracking(id);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const copyTimeTrackingAsyncThunk = createAsyncThunk<
    boolean,
    Date,
    {
        rejectValue: NetworkError;
    }
>('timeTrackings/copyTimeTracking', async (startDate, { rejectWithValue }) => {
    try {
        await copyTimeTracking(startDate);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingTimeTrackingAsyncThunk = createAsyncThunk<
    TimeTrackingEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('timeTrackings/editingTimeTracking', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<TimeTrackingEditFromServer> = await getTimeTracking(id);
        const timeTracking = mapTimeTrackingEditFromServer(response.data);
        return timeTracking;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getFileReportTimeTrackingAsyncThunk = createAsyncThunk<
    any,
    void,
    {
        rejectValue: NetworkError;
    }
>('timeTrackings/getFileReportTimeTracking', async (_, { rejectWithValue }) => {
    try {
        return window.open((await getFileReportTimeTracking()).config.url);
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
//#endregion

const timeTracking = createSlice({
    name: 'timeTrackings',
    initialState: InitialTimeTrackingsState,
    reducers: {
        addingTimeTracking: {
            reducer(state, action: PayloadAction<AddingTimeTrackingsInfoType>) {
                const timeTracking: TimeTrackingEdit | null = {
                    id: zeroGuid,
                    startDate: action.payload.startDate || new Date(),
                    timeSpent: 8,
                    projectId: action.payload.projectId || zeroGuid,
                    taskCategoryId: action.payload.taskCategoryId || zeroGuid,
                    billable: false,
                    taskNumber: '',
                    taskName: '',
                    taskDescription: '',
                    taskIsDone: false,
                };

                state.isAdding = true;
                state.isDisabled = Boolean(action.payload.projectId) || Boolean(action.payload.taskCategoryId);
                state.current = timeTracking;
            },
            prepare(projectId?: string | null, taskCategoryId?: string | null, startDate?: Date | null) {
                return {
                    payload: { projectId, taskCategoryId, startDate },
                };
            },
        },
        clearTimeTracking(state) {
            state.isAdding = false;
            state.isEditing = false;
            state.postedResult = null;
            state.current = null;
        },
        clearErrorTimeTrackings(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder

            //#region ------------------ getTimeTrackings -----------------------
            .addCase(getTimeTrackingsAsyncThunk.pending, state => {
                state.timeTrackings = [];
                state.loading = true;
            })
            .addCase(getTimeTrackingsAsyncThunk.fulfilled, (state, action: PayloadAction<TimeTracking[]>) => {
                state.timeTrackings = action.payload;
                state.loading = false;
                state.needToUpdate = false;
            })
            .addCase(getTimeTrackingsAsyncThunk.rejected, (state, action) => {
                state.loading = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = { message: 'Не удалось получить список учтенных часов', error: action.error.message };
            })
            //#endregion

            //#region ------------------ postTimeTracking -----------------------
            .addCase(postTimeTrackingAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postTimeTrackingAsyncThunk.fulfilled, (state, action: PayloadAction<boolean>) => {
                if (action.payload) {
                    state.isAdding = false;
                    state.needToUpdate = true;
                    state.current = null;
                } else {
                    state.error = { message: 'Часы для этой задачи уже учтены', error: '409' };
                }

                state.posting = false;
            })
            .addCase(postTimeTrackingAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ------------------ putTimeTracking -----------------------
            .addCase(putTimeTrackingAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(putTimeTrackingAsyncThunk.fulfilled, (state, action: PayloadAction<boolean>) => {
                if (action.payload) {
                    state.isEditing = false;
                    state.isDisabled = false;
                    state.needToUpdate = true;
                    state.current = null;
                } else {
                    state.error = { message: 'Часы для этой задачи уже учтены', error: '409' };
                }
                state.posting = false;
            })
            .addCase(putTimeTrackingAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ------------------ deleteTimeTracking -----------------------
            .addCase(deleteTimeTrackingAsyncThunk.fulfilled, state => {
                state.current = null;
                state.needToUpdate = true;
            })
            .addCase(deleteTimeTrackingAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить удаление', error: action.error.message };
            })
            //#endregion

            //#region ------------------ copyTimeTracking -----------------------
            .addCase(copyTimeTrackingAsyncThunk.fulfilled, state => {
                state.needToUpdate = true;
            })
            .addCase(copyTimeTrackingAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить копирование', error: action.error.message };
            })
            //#endregion

            //#region ------------------ editingTimeTracking -----------------------
            .addCase(editingTimeTrackingAsyncThunk.fulfilled, (state, action: PayloadAction<TimeTrackingEdit>) => {
                state.isEditing = true;
                state.isDisabled = true;
                state.current = action.payload;
            })
            .addCase(editingTimeTrackingAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию об учтенных часах',
                        error: action.error.message,
                    };
            })
            //#endregion

            //#region ------------------ getFileReportTimeTracking -----------------------
            .addCase(getFileReportTimeTrackingAsyncThunk.fulfilled, state => {
                state.current = null;
                state.loading = false;
                state.needToUpdate = false;
            })
            .addCase(getFileReportTimeTrackingAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сформировать отчёт', error: action.error.message };
            })
            //#endregion

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { addingTimeTracking, clearTimeTracking, clearErrorTimeTrackings } = timeTracking.actions;
export default timeTracking.reducer;
