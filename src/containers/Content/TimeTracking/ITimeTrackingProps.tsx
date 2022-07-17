import { Project } from 'src/DAL/Projects';
import { TimeTracking, TimeTrackingEdit, WorkTask } from 'src/DAL/TimeTracking';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';
import { getProjectsAsyncThunk } from 'src/store/slice/projectsSlice';
import { AppState } from 'src/store/slice';

import {
    getTimeTrackingsAsyncThunk,
    clearTimeTracking,
    editingTimeTrackingAsyncThunk,
    postTimeTrackingAsyncThunk,
    putTimeTrackingAsyncThunk,
    deleteTimeTrackingAsyncThunk,
    copyTimeTrackingAsyncThunk,
    GetTimeTrackingsInfoType,
    addingTimeTracking,
} from 'src/store/slice/timeTrackingsSlice';

import {
    getWorkTasksAsyncThunk,
    addingWorkTask,
    postWorkTaskAsyncThunk,
    clearWorkTask,
} from 'src/store/slice/workTasksSlice';
import { TaskCategory } from 'src/DAL/Dictionaries';
import { getTaskCategoriesAsyncThunk } from 'src/store/slice/tasksCategoriesSlice';

export interface ITimeTrackingProps {
    userId: string;

    projects: Project[] | null;
    projectsLoading: boolean;
    getProjects: (employee: string) => ActionAsyncThunk<Project[], string | null | undefined>;

    timeTrackings: TimeTracking[] | null;
    timeTrackingsLoading: boolean;
    currentTimeTracking: TimeTrackingEdit | null;
    isTimeTrackingAdding: boolean;
    isTimeTrackingEditing: boolean;
    timeTrackingsPosting: boolean;
    addingTimeTracking: (projectId?: string | null, taskCategoryId?: string | null, startDate?: Date | null) => void;
    clearTimeTracking: () => void;
    getTimeTrackings: (
        timeTrackingsInfoArg: GetTimeTrackingsInfoType,
    ) => ActionAsyncThunk<TimeTracking[], GetTimeTrackingsInfoType>;
    editingTimeTracking: (id: string) => ActionAsyncThunk<TimeTrackingEdit, string>;
    postTimeTracking: (timeTracking: TimeTrackingEdit) => ActionAsyncThunk<boolean, TimeTrackingEdit>;
    putTimeTracking: (timeTracking: TimeTrackingEdit) => ActionAsyncThunk<boolean, TimeTrackingEdit>;
    deleteTimeTracking: (id: string) => ActionAsyncThunk<boolean, string>;
    copyTimeTracking: (startDate: Date) => ActionAsyncThunk<boolean, Date>;

    workTasks: WorkTask[] | null;
    workTasksLoading: boolean;
    currentWorkTask: WorkTask | null;
    isWorkTaskAdding: boolean;
    workTasksPosting: boolean;
    clearWorkTask: () => void;
    addingWorkTask: () => void;
    getWorkTasks: (employeeId: string) => ActionAsyncThunk<WorkTask[], string | null | undefined>;
    postWorkTask: (workTask: WorkTask) => ActionAsyncThunk<boolean, WorkTask>;

    taskCategories: TaskCategory[];
    getTaskCategories: () => ActionAsyncThunk<TaskCategory[], void>;

    isTimeTrackingDisabled: boolean;

    needToUpdateWorkTasks: boolean;
    needToUpdateTimeTrackings: boolean;

    searchProps: ISearchProps;
}

export const mapStateToProps = (store: AppState) => {
    return {
        userId: store.account.userId,
        projects: store.projects.projects,
        projectsLoading: store.projects.loading,
        timeTrackings: store.timeTrackings.timeTrackings,
        timeTrackingsLoading: store.timeTrackings.loading,
        currentTimeTracking: store.timeTrackings.current,
        isTimeTrackingAdding: store.timeTrackings.isAdding,
        isTimeTrackingEditing: store.timeTrackings.isEditing,
        timeTrackingsPosting: store.timeTrackings.posting,
        workTasks: store.workTasks.workTasks,
        workTasksLoading: store.workTasks.loading,
        currentWorkTask: store.workTasks.current,
        isWorkTaskAdding: store.workTasks.isAdding,
        workTasksPosting: store.workTasks.posting,

        taskCategories: store.taskCategories.taskCategories,

        isTimeTrackingDisabled: store.timeTrackings.isDisabled,

        needToUpdateTimeTrackings: store.timeTrackings.needToUpdate,
        needToUpdateWorkTasks: store.workTasks.needToUpdate,
    };
};

export const mapDispatchToProps = {
    getProjects: (employee: string) => getProjectsAsyncThunk(employee),

    getTimeTrackings: (timeTrackingsInfoArg: GetTimeTrackingsInfoType) =>
        getTimeTrackingsAsyncThunk(timeTrackingsInfoArg),

    addingTimeTracking: (projectId?: string | null, taskCategoryId?: string | null, startDate?: Date | null) =>
        addingTimeTracking(projectId, taskCategoryId, startDate),
    editingTimeTracking: (id: string) => editingTimeTrackingAsyncThunk(id),
    postTimeTracking: (timeTracking: TimeTrackingEdit) => postTimeTrackingAsyncThunk(timeTracking),
    putTimeTracking: (timeTracking: TimeTrackingEdit) => putTimeTrackingAsyncThunk(timeTracking),
    clearTimeTracking: () => clearTimeTracking(),
    deleteTimeTracking: (id: string) => deleteTimeTrackingAsyncThunk(id),
    copyTimeTracking: (startDate: Date) => copyTimeTrackingAsyncThunk(startDate),

    getWorkTasks: (employeeId: string) => getWorkTasksAsyncThunk(employeeId),
    addingWorkTask: () => addingWorkTask(),
    postWorkTask: (workTask: WorkTask) => postWorkTaskAsyncThunk(workTask),
    clearWorkTask: () => clearWorkTask(),

    getTaskCategories: () => getTaskCategoriesAsyncThunk(),
};
