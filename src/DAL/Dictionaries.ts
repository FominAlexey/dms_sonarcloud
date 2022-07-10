import baseAPI from './Config';
import { SERVER_URL } from './Constants';
import { AxiosResponse } from 'axios';

// Interfaces
export interface ExpenseCategory {
    id: string;
    title?: string;
    color?: string;
}

export interface EventLogCategory {
    id: string;
    title?: string;
    color?: string;
    limit: number;
}

export interface TaskCategory {
    id: string;
    name: string;
}

export interface TaskCategoryEdit {
    id: string;
    name?: string;
}

// Fetch methods
// ExpenseCategories
export const getExpenseCategories = async (): Promise<AxiosResponse<ExpenseCategory[]>> => {
    return baseAPI.get(`${SERVER_URL}ExpenseCategories/`);
};

export const getExpenseCategory = async (id: string): Promise<AxiosResponse<ExpenseCategory>> => {
    return baseAPI.get(`${SERVER_URL}ExpenseCategories/${id}`);
};

export const postExpenseCategory = async (expenseCategory: ExpenseCategory): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}ExpenseCategories/`, expenseCategory);
};

export const putExpenseCategory = async (expenseCategory: ExpenseCategory): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}ExpenseCategories/${expenseCategory.id}`, expenseCategory);
};

export const deleteExpenseCategory = async (id: string): Promise<AxiosResponse> => {
    return baseAPI.delete(`${SERVER_URL}ExpenseCategories/${id}`);
};

// EventCategories
export const getEventLogCategories = async (): Promise<AxiosResponse<EventLogCategory[]>> => {
    return baseAPI.get(`${SERVER_URL}EventCategories/`);
};

export const getEventLogCategory = async (id: string): Promise<AxiosResponse<EventLogCategory>> => {
    return baseAPI.get(`${SERVER_URL}EventCategories/${id}`);
};

export const postEventLogCategory = async (eventLogCategory: EventLogCategory): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}EventCategories/`, eventLogCategory);
};

export const putEventLogCategory = async (eventLogCategory: EventLogCategory): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}EventCategories/${eventLogCategory.id}`, eventLogCategory);
};

export const deleteEventLogCategory = async (id: string): Promise<AxiosResponse> => {
    return baseAPI.delete(`${SERVER_URL}EventCategories/${id}`);
};

//TaskCategories

export const getTaskCategories = async (): Promise<AxiosResponse<TaskCategory[]>> => {
    return baseAPI.get(`${SERVER_URL}TaskCategories`);
};

export const getTaskCategory = async (id: string): Promise<AxiosResponse<TaskCategoryEdit>> => {
    return baseAPI.get(`${SERVER_URL}TaskCategories/${id}`);
};

export const postTaskCategory = async (taskCategory: TaskCategoryEdit): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}TaskCategories/`, taskCategory);
};

export const putTaskCategory = async (taskCategory: TaskCategoryEdit): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}TaskCategories/${taskCategory.id}`, taskCategory);
};

export const deleteTaskCategory = async (id: string): Promise<AxiosResponse> => {
    return baseAPI.delete(`${SERVER_URL}TaskCategories/${id}`);
};
