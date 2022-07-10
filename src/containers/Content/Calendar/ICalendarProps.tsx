import { EventLog, EventLogEdit } from 'src/DAL/Calendar';
import { Employee } from 'src/DAL/Employees';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';
import { IProductionCalendar } from 'src/DAL/ProductionCalendar';

import {
    addingEventLog,
    clearEventLog,
    getEventLogsAsyncThunk,
    editingEventLogAsyncThunk,
    postEventLogAsyncThunk,
    putEventLogAsyncThunk,
    deleteEventLogAsyncThunk,
    EventLogsInfoType,
} from 'src/store/slice/calendarSlice';

import { getEmployeesAsyncThunk } from 'src/store/slice/employeesSlice';
import { getEventLogCategoriesAsyncThunk } from 'src/store/slice/eventLogCategoriesSlice';
import { getProductionCalendarAsyncThunk } from 'src/store/slice/productionCalendarSlice';
import { AppState } from 'src/store/slice';

export interface ICalendarProps {
    userId: string;

    eventLogs: EventLog[];
    eventLogsLoading: boolean;
    currentEventLog: EventLogEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    posting: boolean;

    addingEventLog: () => void;
    clearEventLog: () => void;

    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => ActionAsyncThunk<EventLog[], EventLogsInfoType>;
    editingEventLog: (id: string) => ActionAsyncThunk<EventLogEdit, string>;
    postEventLog: (eventLog: EventLogEdit) => ActionAsyncThunk<boolean, EventLogEdit>;
    putEventLog: (eventLog: EventLogEdit) => ActionAsyncThunk<boolean, EventLogEdit>;

    deleteEventLog: (id: string) => ActionAsyncThunk<boolean, string>;

    getEmployees: () => ActionAsyncThunk<Employee[], boolean | undefined>;
    employees: Employee[] | null;
    employeesLoading: boolean;

    getEventLogCategories: () => ActionAsyncThunk<EventLogCategory[], void>;
    eventLogCategories: EventLogCategory[] | null;
    eventLogCategoriesLoading: boolean;

    needToUpdateEventLogs: boolean;

    searchProps: ISearchProps;

    productionCalendar: IProductionCalendar[];
    getProductionCalendar: () => ActionAsyncThunk<IProductionCalendar[], void>;
    productionCalendarLoading: boolean;

    invertedTheme: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        userId: store.account.userId,
        eventLogs: store.eventLogs.eventLogs,
        eventLogsLoading: store.eventLogs.loading,
        currentEventLog: store.eventLogs.current,
        isAdding: store.eventLogs.isAdding,
        isEditing: store.eventLogs.isEditing,
        posting: store.eventLogs.posting,

        employees: store.employees.employees,
        employeesLoading: store.employees.loading,

        eventLogCategories: store.eventLogCategories.eventLogCategories,
        eventLogCategoriesLoading: store.eventLogCategories.loading,

        needToUpdateEventLogs: store.eventLogs.needToUpdate,

        productionCalendar: store.productionCalendar.productionCalendar,
        productionCalendarLoading: store.productionCalendar.loading,

        invertedTheme: store.theme.inverted,
    };
};

export const mapDispacthToProps = {
    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => getEventLogsAsyncThunk(eventLogsInfoArg),
    addingEventLog: () => addingEventLog(),
    editingEventLog: (id: string) => editingEventLogAsyncThunk(id),
    postEventLog: (eventLog: EventLogEdit) => postEventLogAsyncThunk(eventLog),
    putEventLog: (eventLog: EventLogEdit) => putEventLogAsyncThunk(eventLog),
    clearEventLog: () => clearEventLog(),
    deleteEventLog: (id: string) => deleteEventLogAsyncThunk(id),

    getEmployees: () => getEmployeesAsyncThunk(),
    getEventLogCategories: () => getEventLogCategoriesAsyncThunk(),

    getProductionCalendar: () => getProductionCalendarAsyncThunk(),
};
