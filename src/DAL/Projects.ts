import baseAPI from './Config';
import { SERVER_URL } from './Constants';
import { AxiosResponse } from 'axios';
import { stringify } from 'querystring';

// Interfaces
export interface Project {
    id: string;
    title: string;
    client: string;
    manager: string;
    teamMembersCount: number;
}

export interface ProjectEdit {
    id: string;
    title?: string;
    client?: string;
    managerId: string;
    teamMembers: TeamMember[];
}

export interface TeamMember {
    employeeId: string;
    fullName: string;
}

// Fetch methods
export const getProjects = async (employeeId: string | null): Promise<AxiosResponse<Project[]>> => {
    const query = {
        employeeId: employeeId,
    };

    return baseAPI.get(`${SERVER_URL}Projects?${stringify(query)}`);
};

export const getProject = async (id: string): Promise<AxiosResponse<ProjectEdit>> => {
    return baseAPI.get(`${SERVER_URL}Projects/${id}`);
};

export const postProject = async (project: ProjectEdit): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}Projects/`, project);
};

export const putProject = async (project: ProjectEdit): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}Projects/${project.id}`, project);
};

export const deleteProject = async (id: string): Promise<AxiosResponse> => {
    return baseAPI.delete(`${SERVER_URL}Projects/${id}`);
};
