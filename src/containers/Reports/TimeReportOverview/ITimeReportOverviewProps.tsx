import { Employee } from 'src/DAL/Employees';
import { TimeTracking } from 'src/DAL/TimeTracking';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';
import { getEmployeesAsyncThunk } from 'src/store/slice/employeesSlice';
import { getFileReportTimeTrackingAsyncThunk } from 'src/store/slice/timeTrackingsSlice';
import { AppState } from 'src/store/slice';
import { getTimeTrackingsAsyncThunk, GetTimeTrackingsInfoType } from 'src/store/slice/timeTrackingsSlice';

export interface ITimeReportOverviewProps {
    employees: Employee[] | null;
    getEmployees: () => ActionAsyncThunk<Employee[], boolean | undefined>;
    employeesLoading: boolean;

    timeTrackings: TimeTracking[] | null;
    getTimeTrackings: (
        timeTrackingsInfoArg: GetTimeTrackingsInfoType,
    ) => ActionAsyncThunk<TimeTracking[], GetTimeTrackingsInfoType>;
    timeTrackingsLoading: boolean;

    getFileReportTimeReportOverview: () => ActionAsyncThunk<any>;

    searchProps: ISearchProps;
}

export const mapStateToProps = (store: AppState) => {
    return {
        employees: store.employees.employees,
        employeesLoading: store.employees.loading,

        timeTrackings: store.timeTrackings.timeTrackings,
        timeTrackingsLoading: store.timeTrackings.loading
    };
};

export const mapDispatchToProps = {
    getEmployees: () => getEmployeesAsyncThunk(),
    getTimeTrackings: (timeTrackingsInfoArg: GetTimeTrackingsInfoType) =>
        getTimeTrackingsAsyncThunk(timeTrackingsInfoArg),
    getFileReportTimeReportOverview: () => getFileReportTimeTrackingAsyncThunk(),
};
