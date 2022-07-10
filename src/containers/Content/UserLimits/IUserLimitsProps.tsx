import { EmployeeEdit } from 'src/DAL/Employees';
import { EventLog } from 'src/DAL/Calendar';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { IProductionCalendar } from 'src/DAL/ProductionCalendar';

import { AppState } from 'src/store/slice';
import { getEventLogsAsyncThunk, EventLogsInfoType } from 'src/store/slice/calendarSlice';
import { getEventLogCategoriesAsyncThunk } from 'src/store/slice/eventLogCategoriesSlice';
import { getProductionCalendarAsyncThunk } from 'src/store/slice/productionCalendarSlice';
import { getEmployeeAsyncThunk } from 'src/store/slice/employeesSlice';
import { ActionAsyncThunk } from 'src/shared/Common';

export interface IUserLimitsProps {
    userId: string;
    employee: EmployeeEdit | null;
    getEmployee: (employeeId: string) => ActionAsyncThunk<EmployeeEdit, string>;

    eventLogs: EventLog[] | null;
    eventLogsLoading: boolean;
    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => ActionAsyncThunk<EventLog[], EventLogsInfoType>;

    getEventLogCategories: () => ActionAsyncThunk<EventLogCategory[], void>;
    eventLogCategories: EventLogCategory[] | null;
    eventLogCategoriesLoading: boolean;

    productionCalendar: IProductionCalendar[];
    getProductionCalendar: () => ActionAsyncThunk<IProductionCalendar[], void>;
    productionCalendarLoading: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        userId: store.account.userId,
        employee: store.employees.current,

        eventLogs: store.eventLogs.eventLogs,
        eventLogsLoading: store.eventLogs.loading,

        eventLogCategories: store.eventLogCategories.eventLogCategories,
        eventLogCategoriesLoading: store.eventLogCategories.loading,

        productionCalendar: store.productionCalendar.productionCalendar,
        productionCalendarLoading: store.productionCalendar.loading,
    };
};

export const mapDispacthToProps = {
    getEmployee: (employeeId: string) => getEmployeeAsyncThunk(employeeId),

    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => getEventLogsAsyncThunk(eventLogsInfoArg),
    getEventLogCategories: () => getEventLogCategoriesAsyncThunk(),
    getProductionCalendar: () => getProductionCalendarAsyncThunk(),
};
