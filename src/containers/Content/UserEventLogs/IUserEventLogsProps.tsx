import { RouteComponentProps } from "react-router-dom"
import { EventLog } from "src/DAL/Calendar"
import { IProductionCalendar } from "src/DAL/ProductionCalendar"
import { EventLogCategory } from "src/DAL/Dictionaries"
import { ISearchProps, ActionAsyncThunk } from "src/shared/Common"

import { getEventLogsAsyncThunk, EventLogsInfoType } from "src/store/slice/calendarSlice"
import { getEventLogCategoriesAsyncThunk } from "src/store/slice/eventLogCategoriesSlice"
import { getProductionCalendarAsyncThunk } from "src/store/slice/productionCalendarSlice"
import { AppState } from "src/store/slice"

export interface IUserEventLogsProps extends RouteComponentProps {
    userId: string;
    eventLogs: EventLog[];
    eventLogsLoading: boolean;
    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => ActionAsyncThunk<EventLog[], EventLogsInfoType>;
    searchProps: ISearchProps;
    eventLogCategories: EventLogCategory[];
    getEventLogCategories: () => ActionAsyncThunk<EventLogCategory[], void>;
    productionCalendar: IProductionCalendar[];
    getProductionCalendar: () => ActionAsyncThunk<IProductionCalendar[], void>;
    productionCalendarLoading: boolean;
}


export const mapStateToProps = (store: AppState) => {
    return {
        userId: store.account.userId,
        eventLogs: store.eventLogs.eventLogs,
        eventLogCategories: store.eventLogCategories.eventLogCategories,
        eventLogsLoading: store.eventLogs.loading,
        productionCalendar: store.productionCalendar.productionCalendar,
        productionCalendarLoading: store.productionCalendar.loading
    }
}

export const mapDispacthToProps = {
    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => getEventLogsAsyncThunk(eventLogsInfoArg),
    getEventLogCategories: () => getEventLogCategoriesAsyncThunk(),
    getProductionCalendar: () => getProductionCalendarAsyncThunk()
}