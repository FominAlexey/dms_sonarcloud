import baseAPI from './Config';
import { SERVER_URL } from './Constants';
import { stringify } from 'querystring';
import { AxiosResponse } from 'axios';

// Interfaces
export interface Employee {
    id: string;
    fullName: string;
    birthDate: Date;
    email: string;
    phone: string;
    employedDate: Date;
    leaveDate: Date | null;
    isLeave: boolean;
    roles: string[];
    employmentType: string;
    utilization: number;
}

export interface Role {
    id: string;
    title: string;
}

export interface EmployeeEdit {
    id: string;
    fullName?: string;
    email?: string;
    phone?: string;
    birthDate: Date;
    employedDate: Date;
    leaveDate: Date | null;
    isLeave: boolean;
    managerId: string;
    roles: Role[];
    employmentTypeId: string;
    utilization: number;
}

export interface EmployeeFromServer {
    id: string;
    fullName: string;
    birthDate: string;
    email: string;
    phone: string;
    employedDate: string;
    leaveDate: string | null;
    isLeave: boolean;
    roles: string[];
    manager: string | undefined;
    employmentType: string;
    utilization: number;
}

export interface EmployeeEditFromServer {
    id: string;
    fullName: string;
    birthDate: string;
    email: string;
    phone: string;
    employedDate: string;
    leaveDate: string | null;
    isLeave: boolean;
    managerId: string;
    roles: Role[];
    employmentTypeId: string;
    utilization: number;
}

// Map methods
export const mapEmployeeFromServer = (employee: EmployeeFromServer): Employee => ({
    ...employee,
    birthDate: new Date(employee.birthDate),
    employedDate: new Date(employee.employedDate),
    leaveDate: employee.leaveDate ? new Date(employee.leaveDate) : null,
});

export const mapEmployeeEditFromServer = (employee: EmployeeEditFromServer): EmployeeEdit => ({
    ...employee,
    birthDate: new Date(employee.birthDate),
    employedDate: new Date(employee.employedDate),
    leaveDate: employee.leaveDate ? new Date(employee.leaveDate) : null,
    //managerId: Number.parseInt(employee.managerId)
    managerId: employee.managerId,
});

// Const lists
export const EmploymentTypes = [
    {
        employmentTypeId: 'be9cbdd3-b386-41f1-bd79-1a3e514ab084',
        title: 'Полная занятость',
    },
    {
        employmentTypeId: '18d25932-45a3-4c1d-9a74-34798814b827',
        title: 'Частичная занятость',
    },
    {
        employmentTypeId: '3353ecd6-e6f7-4490-a7a4-a8b7e7e6f0da',
        title: 'Контрактор',
    },
];

// Fetch methods
export const getEmployees = async (includeFired: boolean | null): Promise<AxiosResponse<EmployeeFromServer[]>> => {
    const query = {
        includeFired: includeFired,
    };

    return baseAPI.get(`${SERVER_URL}Employees?${stringify(query)}`);
};

export const getEmployee = async (id: string): Promise<AxiosResponse<EmployeeEditFromServer>> => {
    return baseAPI.get(`${SERVER_URL}Employees/${id}`);
};

export const postEmployee = async (employee: EmployeeEdit): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}Employees/`, employee);
};

export const putEmployee = async (employee: EmployeeEdit): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}Employees/${employee.id}`, employee);
};

export const deleteEmployee = async (id: string): Promise<AxiosResponse> => {
    return baseAPI.delete(`${SERVER_URL}Employees/${id}`);
};
