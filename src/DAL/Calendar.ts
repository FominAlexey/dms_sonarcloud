import baseAPI from './Config';
import { SERVER_URL } from './Constants';
import { stringify } from 'querystring';
import { getISOString } from 'src/shared/DateUtils';
import { AxiosResponse } from 'axios';

// Interfaces
export interface EventLog {
    id: string;
    employeeId: string;
    employeeName: string;
    eventCategoryId: string;
    eventCategoryName: string;
    reason: string;
    startDate: Date;
    endDate: Date | null;
    approvalStatusId: string;
    approvalStatusTitle: string;
    requestedDate: Date;
    approvalDate: Date | null;
}

export interface EventLogEdit {
    id: string;
    employeeId: string;
    eventCategoryId: string;
    reason?: string;
    startDate: Date;
    endDate: Date | null;
    approvalStatusId: string;
    approvalDate: Date | null;
    currentUser: boolean | null;
}

export interface EventLogFromServer {
    id: string;
    employeeId: string;
    employeeName: string;
    eventCategoryId: string;
    eventCategoryName: string;
    reason: string;
    startDate: string;
    endDate: string | null;
    approvalStatusId: string;
    approvalStatusTitle: string;
    dateRequested: string;
    approvalDate: string | null;
}

export interface EventLogEditFromServer {
    id: string;
    employeeId: string;
    eventCategoryId: string;
    reason: string;
    startDate: string;
    endDate: string | null;
    approvalStatusId: string;
    approvalDate: string | null;
    currentUser: boolean | null;
}

// Map methods
export const mapEventLogFromServer = (eventLog: EventLogFromServer): EventLog => ({
    ...eventLog,
    startDate: new Date(eventLog.startDate),
    endDate: eventLog.endDate ? new Date(eventLog.endDate) : null,
    requestedDate: new Date(eventLog.dateRequested),
    approvalDate: eventLog.approvalDate ? new Date(eventLog.approvalDate) : null,
});

export const mapEventLogEditFromServer = (eventLog: EventLogEditFromServer): EventLogEdit => ({
    ...eventLog,
    startDate: new Date(eventLog.startDate),
    endDate: eventLog.endDate ? new Date(eventLog.endDate) : null,
    approvalDate: eventLog.approvalDate ? new Date(eventLog.approvalDate) : null,
    currentUser: eventLog.currentUser,
});

// Fetch methods
export const getEventLogs = async (
    employeeId: string | null,
    status: string | null,
    fromDate: Date | null,
    toDate: Date | null,
    currentUser: boolean | null,
): Promise<AxiosResponse<EventLogFromServer[]>> => {
    const query = {
        employeeId: employeeId,
        approvalStatus: status,
        fromDate: fromDate ? getISOString(fromDate) : null,
        toDate: toDate ? getISOString(toDate) : null,
        currentUser: currentUser,
    };

    return baseAPI.get(`${SERVER_URL}Calendar/EventLogs?${stringify(query)}`);
};

export const getEventLog = async (id: string): Promise<AxiosResponse<EventLogEditFromServer>> => {
    return baseAPI.get(`${SERVER_URL}Calendar/EventLogs/${id}`);
};

export const postEventLog = async (eventLog: EventLogEdit): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}Calendar/EventLogs/`, eventLog);
};

export const putEventLog = async (eventLog: EventLogEdit): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}Calendar/EventLogs/${eventLog.id}`, eventLog);
};

export const deleteEventLog = async (id: string): Promise<AxiosResponse> => {
    return baseAPI.delete(`${SERVER_URL}Calendar/EventLogs/${id}`);
};
