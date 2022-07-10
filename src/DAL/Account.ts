import baseAPI from './Config';
import { SERVER_URL } from './Constants';
import { AxiosResponse } from 'axios';

export interface UserInfo {
    id: string;
    fullName: string;
    email: string;
    password: string;
    roles: string[];
}

export interface ResetPassword {
    employeeId: string | null;
    token: string | null;
    newPassword?: string | null;
}

export const getUserInfo = async (username: string, password: string): Promise<AxiosResponse<UserInfo>> => {
    return baseAPI.post(`${SERVER_URL}Users/authenticate/`, { username, password });
};

export const resetUserPassword = async (email: string): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}Users/ResetPassword?email=${email}`);
};

export const changeUserPassword = async (resetPassword: ResetPassword): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}Users/ChangePassword`, resetPassword);
};
