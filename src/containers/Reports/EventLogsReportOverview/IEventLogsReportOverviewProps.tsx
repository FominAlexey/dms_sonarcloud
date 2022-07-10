import { Employee } from 'src/DAL/Employees';
import { EventLog } from 'src/DAL/Calendar';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';
import { IProductionCalendar } from 'src/DAL/ProductionCalendar';

import { getEmployeesAsyncThunk } from 'src/store/slice/employeesSlice';
import { AppState } from 'src/store/slice';
import { getEventLogsAsyncThunk, EventLogsInfoType } from 'src/store/slice/calendarSlice';
import { getEventLogCategoriesAsyncThunk } from 'src/store/slice/eventLogCategoriesSlice';
import { getProductionCalendarAsyncThunk } from 'src/store/slice/productionCalendarSlice';

export interface IEventLogsReportOverviewProps {
    employees: Employee[] | null;
    getEmployees: () => ActionAsyncThunk<Employee[], boolean | undefined>;
    employeesLoading: boolean;

    eventLogs: EventLog[] | null;
    eventLogsLoaging: boolean;
    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => ActionAsyncThunk<EventLog[], EventLogsInfoType>;

    eventLogCategories: EventLogCategory[] | null;
    eventLogCategoriesLoading: boolean;
    getEventLogCategories: () => ActionAsyncThunk<EventLogCategory[], void>;

    searchProps: ISearchProps;

    productionCalendar: IProductionCalendar[];
    getProductionCalendar: () => ActionAsyncThunk<IProductionCalendar[], void>;
    productionCalendarLoading: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        employees: store.employees.employees,
        employeesLoading: store.employees.loading,
        eventLogs: store.eventLogs.eventLogs,
        eventLogsLoaging: store.eventLogs.loading,
        eventLogCategories: store.eventLogCategories.eventLogCategories,
        eventLogCategoriesLoading: store.eventLogCategories.loading,

        productionCalendar: store.productionCalendar.productionCalendar,
        productionCalendarLoading: store.productionCalendar.loading,
    };
};

export const mapDispatchToProps = {
    getEmployees: () => getEmployeesAsyncThunk(),

    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => getEventLogsAsyncThunk(eventLogsInfoArg),
    getEventLogCategories: () => getEventLogCategoriesAsyncThunk(),
    getProductionCalendar: () => getProductionCalendarAsyncThunk(),
};
