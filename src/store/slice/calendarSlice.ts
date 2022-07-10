import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    EventLog,
    EventLogEdit,
    getEventLogs,
    postEventLog,
    putEventLog,
    deleteEventLog,
    getEventLog,
    mapEventLogFromServer,
    mapEventLogEditFromServer,
    EventLogFromServer,
    EventLogEditFromServer,
} from 'src/DAL/Calendar';

import { REJECTED, CREATED, zeroGuid } from 'src/shared/Constants';
import { toUTC } from 'src/shared/DateUtils';
import { AxiosResponse } from 'axios';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { loginAsyncThunk } from './accountSlice';

export type EventLogsInfoType = {
    employeeId: string | null;
    status: string | null;
    fromDate: Date | null;
    toDate: Date | null;
    currentUser: boolean | null;
};

export type PatchEventLogInfoType = {
    id: string;
    status: string;
};

export interface EventLogsState {
    loading: boolean;
    posting: boolean;
    eventLogs: EventLog[];
    current: EventLogEdit | null;
    postedResult: EventLogEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;

    needToUpdate: boolean;
    error: ErrorObject | null;
}

const InitialEventLogsState: EventLogsState = {
    loading: false,
    posting: false,
    eventLogs: [],
    current: null,
    postedResult: null,
    isAdding: false,
    isEditing: false,
    isDeleting: false,
    needToUpdate: false,
    error: null,
};

//#region AsyncThunk

// put to DAL ?????
const isValidDates = async (eventLog: EventLogEdit): Promise<boolean> => {
    let eventLogs: EventLog[] = [];

    await getEventLogs(
        eventLog.employeeId,
        null,
        eventLog.startDate,
        eventLog.endDate || eventLog.startDate,
        eventLog.currentUser,
    ).then(res => {
        eventLogs = res.data.map(mapEventLogFromServer);
        eventLogs = eventLogs.filter(ev => ev.approvalStatusId !== REJECTED);
        // Remove current eventLog
        eventLogs = eventLogs.filter(ev => ev.id !== eventLog.id);
    });

    if (eventLogs?.length === 0) {
        return true;
    } else {
        return false;
    }
};

export const getEventLogsAsyncThunk = createAsyncThunk<
    EventLog[],
    EventLogsInfoType,
    {
        rejectValue: NetworkError;
    }
>('calendar/getEventLogs', async (eventLogsInfo, { rejectWithValue }) => {
    try {
        const { employeeId, status, fromDate, toDate, currentUser } = eventLogsInfo;
        const response: AxiosResponse<EventLogFromServer[]> = await getEventLogs(
            employeeId,
            status,
            fromDate,
            toDate,
            currentUser,
        );
        let eventLogs = response.data.map(mapEventLogFromServer);

        // For confirmations
        if (!fromDate && !toDate) eventLogs = eventLogs.sort((a, b) => (a.startDate > b.startDate ? -1 : 1));

        return eventLogs;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postEventLogAsyncThunk = createAsyncThunk<
    boolean,
    EventLogEdit,
    {
        rejectValue: NetworkError;
    }
>('calendar/postEventLog', async (eventLog, { rejectWithValue }) => {
    try {
        if (await isValidDates(eventLog)) {
            await postEventLog(eventLog);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putEventLogAsyncThunk = createAsyncThunk<
    boolean,
    EventLogEdit,
    {
        rejectValue: NetworkError;
    }
>('calendar/putEventLog', async (eventLog, { rejectWithValue }) => {
    try {
        if (await isValidDates(eventLog)) {
            await putEventLog(eventLog);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const patchEventLogAsyncThunk = createAsyncThunk<
    boolean,
    PatchEventLogInfoType,
    {
        rejectValue: NetworkError;
    }
>('calendar/patchEventLog', async (patchEvenLogInfo, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EventLogEditFromServer> = await getEventLog(patchEvenLogInfo.id);
        let eventLog: EventLogEdit | null = null;
        eventLog = mapEventLogEditFromServer(response.data);
        eventLog.approvalStatusId = patchEvenLogInfo.status;
        eventLog.approvalDate = toUTC(new Date());
        eventLog.startDate = toUTC(eventLog.startDate);
        eventLog.endDate = eventLog.endDate ? toUTC(eventLog.endDate) : null;

        if (eventLog) {
            await putEventLog(eventLog);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteEventLogAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('calenda/deleteEventLog', async (id, { rejectWithValue }) => {
    try {
        await deleteEventLog(id);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletingEvenLogAsyncThunk = createAsyncThunk<
    EventLogEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('calendar/deletingEventLog', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EventLogEditFromServer> = await getEventLog(id);
        const eventLog = mapEventLogEditFromServer(response.data);
        return eventLog;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingEventLogAsyncThunk = createAsyncThunk<
    EventLogEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('calendar/editingEventLog', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EventLogEditFromServer> = await getEventLog(id);
        const eventLog = mapEventLogEditFromServer(response.data);
        return eventLog;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
//#endregion

const calendarSlice = createSlice({
    name: 'calendar',
    initialState: InitialEventLogsState,
    reducers: {
        addingEventLog(state) {
            const eventLog: EventLogEdit = {
                id: zeroGuid,
                employeeId: zeroGuid,
                eventCategoryId: zeroGuid,
                reason: undefined,
                startDate: new Date(),
                endDate: null,
                approvalStatusId: CREATED,
                approvalDate: null,
                currentUser: true,
            };

            state.isAdding = true;
            state.current = eventLog;
        },
        clearEventLog(state) {
            state.isAdding = false;
            state.isEditing = false;
            state.isDeleting = false;
            state.postedResult = null;
            state.current = null;
        },
        clearErrorCalendar(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            //#region ------------ getEventLogs -------------------------
            .addCase(getEventLogsAsyncThunk.pending, state => {
                state.loading = true;
                state.eventLogs = [];
            })
            .addCase(getEventLogsAsyncThunk.fulfilled, (state, action: PayloadAction<EventLog[]>) => {
                const nextEventLogs: EventLog[] = { ...state.eventLogs };

                action.payload.forEach((element, index) => {
                    if (!nextEventLogs[index]) {
                        nextEventLogs[index] = element;
                    }
                });

                state.eventLogs = action.payload;
                state.loading = false;
                state.needToUpdate = false;
            })
            .addCase(getEventLogsAsyncThunk.rejected, (state, action) => {
                state.loading = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию об изменениях в календаре',
                        error: action.error.message,
                    };
            })
            //#endregion

            //#region ------------ postEventLog -------------------------
            .addCase(postEventLogAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postEventLogAsyncThunk.fulfilled, (state, action: PayloadAction<boolean>) => {
                if (action.payload) {
                    state.isAdding = false;
                    state.needToUpdate = true;
                    state.current = null;
                } else {
                    state.error = { message: 'Выберите другой период' };
                }

                state.posting = false;
            })
            .addCase(postEventLogAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ------------ putEventLog -------------------------
            .addCase(putEventLogAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(putEventLogAsyncThunk.fulfilled, (state, action: PayloadAction<boolean>) => {
                if (action.payload) {
                    state.isEditing = false;
                    state.needToUpdate = true;
                    state.current = null;
                } else {
                    state.error = { message: 'Выберите другой период' };
                }

                state.posting = false;
            })
            .addCase(putEventLogAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ------------ patchEventLog -------------------------
            .addCase(patchEventLogAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(patchEventLogAsyncThunk.fulfilled, (state, action: PayloadAction<boolean>) => {
                if (action.payload) {
                    state.isEditing = false;
                    state.needToUpdate = true;
                    state.current = null;
                } else {
                    state.error = { message: 'Не удалось получить информацию о событии' };
                }
                state.posting = false;
            })
            .addCase(patchEventLogAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ------------ deletingEventLog -------------------------
            .addCase(deletingEvenLogAsyncThunk.fulfilled, (state, action: PayloadAction<EventLogEdit>) => {
                state.isDeleting = true;
                state.current = action.payload;
            })
            .addCase(deletingEvenLogAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию о событии', error: action.error.message };
            })
            //#endregion

            //#region ------------ deleteEventLog -------------------------
            .addCase(deleteEventLogAsyncThunk.fulfilled, state => {
                state.isDeleting = false;
                state.needToUpdate = true;
                state.current = null;
            })
            .addCase(deleteEventLogAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить удаление', error: action.error.message };
            })
            //#endregion

            //#region ------------ editingEventLog -------------------------
            .addCase(editingEventLogAsyncThunk.fulfilled, (state, action: PayloadAction<EventLogEdit>) => {
                state.isEditing = true;
                state.current = action.payload;
            })
            .addCase(editingEventLogAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию о событии', error: action.error.message };
            })
            //#endregion

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { addingEventLog, clearEventLog, clearErrorCalendar } = calendarSlice.actions;
export default calendarSlice.reducer;
