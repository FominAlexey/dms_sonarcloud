import { Project } from 'src/DAL/Projects';
import { TimeTracking } from 'src/DAL/TimeTracking';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';
import { getProjectsAsyncThunk } from 'src/store/slice/projectsSlice';
import { AppState } from 'src/store/slice';
import { getTimeTrackingsAsyncThunk, GetTimeTrackingsInfoType } from 'src/store/slice/timeTrackingsSlice';

export interface IProjectsReportOverviewProps {
    projects: Project[] | null;
    getProjects: () => ActionAsyncThunk<Project[], string | null | undefined>;
    projectsLoading: boolean;

    timeTrackings: TimeTracking[] | null;
    getTimeTrackings: (
        timeTrackingsInfoArg: GetTimeTrackingsInfoType,
    ) => ActionAsyncThunk<TimeTracking[], GetTimeTrackingsInfoType>;
    timeTrackingsLoading: boolean;

    searchProps: ISearchProps;
}

export const mapStateToProps = (store: AppState) => {
    return {
        projects: store.projects.projects,
        projectsLoading: store.projects.loading,

        timeTrackings: store.timeTrackings.timeTrackings,
        timeTrackingsLoading: store.timeTrackings.loading,
    };
};

export const mapDispatchToProps = {
    getProjects: () => getProjectsAsyncThunk(),

    getTimeTrackings: (timeTrackingsInfoArg: GetTimeTrackingsInfoType) =>
        getTimeTrackingsAsyncThunk(timeTrackingsInfoArg),
};
