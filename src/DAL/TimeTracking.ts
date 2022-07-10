import baseAPI from './Config';
import { SERVER_URL } from './Constants';
import { AxiosResponse } from 'axios';
import { stringify } from 'querystring';
import { getISOString } from 'src/shared/DateUtils';

// Interfaces
export interface WorkTask {
    id: string;

    projectId: string;
    projectName: string;

    taskCategoryId: string;
    taskCategoryName: string;

    employeeId: string;
}

export interface TimeTracking {
    id: string;
    workTaskId: string;
    taskCategoryId: string;
    startDate: Date;
    timeSpent: number;
    projectId: string;
    employeeId: string;
    billable: boolean;
    taskNumber: string;
    taskName: string;
    taskDescription: string;
    taskIsDone: boolean;
}

export interface TimeTrackingEdit {
    id: string;
    projectId: string;
    taskCategoryId: string;
    startDate: Date;
    timeSpent: number;
    billable: boolean;
    taskNumber: string;
    taskName: string;
    taskDescription: string;
    taskIsDone: boolean;
}

export interface TimeTrackingFromServer {
    id: string;
    workTaskId: string;
    taskCategoryId: string;
    startDate: string;
    timeSpent: number;
    projectId: string;
    employeeId: string;
    billable: boolean;
    taskNumber: string;
    taskName: string;
    taskDescription: string;
    taskIsDone: boolean;
}

export interface TimeTrackingEditFromServer {
    id: string;
    projectId: string;
    taskCategoryId: string;
    startDate: string;
    timeSpent: number;
    billable: boolean;
    taskNumber: string;
    taskName: string;
    taskDescription: string;
    taskIsDone: boolean;
}

export interface TimeTrackingUpdate {
    id: string;
    startDate: Date;
    timeSpent: number;
    billable: boolean;
    taskNumber: string;
    taskName: string;
    taskDescription: string;
    taskIsDone: boolean;
}

// Map methods
export const mapTimeTrackingFromServer = (timeTracking: TimeTrackingFromServer): TimeTracking => ({
    ...timeTracking,
    startDate: new Date(timeTracking.startDate),
});

export const mapTimeTrackingEditFromServer = (timeTracking: TimeTrackingEditFromServer): TimeTrackingEdit => ({
    ...timeTracking,
    startDate: new Date(timeTracking.startDate),
});

// WorkTasks
export const getWorkTasks = async (employeeId: string | null): Promise<AxiosResponse<WorkTask[]>> => {
    const query = {
        employeeId: employeeId,
    };
    return baseAPI.get(`${SERVER_URL}WorkTasks?${stringify(query)}`);
};

export const getWorkTask = async (id: string): Promise<AxiosResponse<WorkTask>> => {
    return baseAPI.get(`${SERVER_URL}WorkTasks/${id}`);
};

export const postWorkTask = async (workTask: WorkTask): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}WorkTasks/`, workTask);
};

export const putWorkTask = async (workTask: WorkTask): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}WorkTasks/${workTask.id}`, workTask);
};

// TimeTrackings
export const getTimeTrackings = async (
    projectId: string | null,
    employeeId: string | null,
    workTaskId: string | null,
    fromDate: Date | null,
    toDate: Date | null,
): Promise<AxiosResponse<TimeTrackingFromServer[]>> => {
    const query = {
        projectId: projectId,
        employeeId: employeeId,
        workTaskId: workTaskId,
        fromDate: fromDate ? getISOString(fromDate) : null,
        toDate: toDate ? getISOString(toDate) : null,
    };

    return baseAPI.get(`${SERVER_URL}TimeTrackings?${stringify(query)}`);
};

export const getTimeTracking = async (id: string): Promise<AxiosResponse<TimeTrackingEditFromServer>> => {
    return baseAPI.get(`${SERVER_URL}TimeTrackings/${id}`);
};

export const postTimeTracking = async (timeTracking: TimeTrackingEdit): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}TimeTrackings/`, timeTracking);
};

export const putTimeTracking = async (timeTracking: TimeTrackingUpdate): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}TimeTrackings/${timeTracking.id}`, timeTracking);
};

export const deleteTimeTracking = async (id: string): Promise<AxiosResponse> => {
    return baseAPI.delete(`${SERVER_URL}TimeTrackings/${id}`);
};

export const copyTimeTracking = async (startDate: Date): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}TimeTrackings/AddWeeklyTimeTrackings?startDate=${startDate.toDateString()}`);
};

export const getFileReportTimeTracking = async (): Promise<AxiosResponse> => {
    return baseAPI.get(`${SERVER_URL}TimeTrackings/FileReport`);
};
