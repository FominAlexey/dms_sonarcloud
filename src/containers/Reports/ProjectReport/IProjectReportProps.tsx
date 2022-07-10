import { ProjectEdit } from 'src/DAL/Projects';
import { TimeTracking } from 'src/DAL/TimeTracking';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';
import { RouteComponentProps } from 'react-router-dom';
import { getTimeTrackingsAsyncThunk, GetTimeTrackingsInfoType } from 'src/store/slice/timeTrackingsSlice';
import { getProjectAsyncThunk } from 'src/store/slice/projectsSlice';
import { AppState } from 'src/store/slice';

interface RouteParams {
    projectId: string;
}

export interface IProjectReportProps extends RouteComponentProps<RouteParams> {
    project: ProjectEdit | null;
    getProject: (id: string) => ActionAsyncThunk<ProjectEdit, string>;
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
        project: store.projects.current,
        projectsLoading: store.projects.loading,
        timeTrackings: store.timeTrackings.timeTrackings,
        timeTrackingsLoading: store.timeTrackings.loading,
    };
};

export const mapDispatchToProps = {
    getTimeTrackings: (timeTrackingsInfoArg: GetTimeTrackingsInfoType) =>
        getTimeTrackingsAsyncThunk(timeTrackingsInfoArg),
    getProject: (id: string) => getProjectAsyncThunk(id),
};
