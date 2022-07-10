import { RouteComponentProps } from 'react-router-dom';
import { EmployeeEdit } from 'src/DAL/Employees';
import { Project } from 'src/DAL/Projects';
import { TimeTracking, WorkTask } from 'src/DAL/TimeTracking';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';

import { AppState } from 'src/store/slice';
import { getEmployeeAsyncThunk } from 'src/store/slice/employeesSlice';
import { getProjectsAsyncThunk } from 'src/store/slice/projectsSlice';
import { getTimeTrackingsAsyncThunk, GetTimeTrackingsInfoType } from 'src/store/slice/timeTrackingsSlice';
import { getWorkTasksAsyncThunk } from 'src/store/slice/workTasksSlice';

interface RouteParams {
    employeeId: string;
}

export interface ITimeReportProps extends RouteComponentProps<RouteParams> {
    employee: EmployeeEdit | null;
    getEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;

    getProjects: (employee: string | null) => ActionAsyncThunk<Project[], string | null | undefined>;
    projects: Project[] | null;
    projectsLoading: boolean;

    getTimeTrackings: (
        timeTrackingsInfoArg: GetTimeTrackingsInfoType,
    ) => ActionAsyncThunk<TimeTracking[], GetTimeTrackingsInfoType>;
    timeTrackings: TimeTracking[] | null;
    timeTrackingsLoading: boolean;

    getWorkTasks: (employeeId: string) => ActionAsyncThunk<WorkTask[], string | null | undefined>;
    workTasks: WorkTask[] | null;
    worktasksLoading: boolean;

    searchProps: ISearchProps;
}

export const mapStateToProps = (store: AppState) => {
    return {
        employee: store.employees.current,

        projects: store.projects.projects,
        projectsLoading: store.projects.loading,

        timeTrackings: store.timeTrackings.timeTrackings,
        timeTrackingsLoading: store.timeTrackings.loading,

        workTasks: store.workTasks.workTasks,
        worktasksLoading: store.workTasks.loading,
    };
};

export const mapDispatchToProps = {
    getEmployee: (id: string) => getEmployeeAsyncThunk(id),
    getProjects: (employee: string | null) => getProjectsAsyncThunk(employee),
    getTimeTrackings: (timeTrackingsInfoArg: GetTimeTrackingsInfoType) =>
        getTimeTrackingsAsyncThunk(timeTrackingsInfoArg),
    getWorkTasks: (employeeId: string) => getWorkTasksAsyncThunk(employeeId),
};
