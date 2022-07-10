import { key } from 'src/DAL/Constants';
import { UserInfo } from 'src/DAL/Account';
import CryptoJS from 'crypto-js';

// Get values from local storage
export const getEmail = (): string => {
    return localStorage.getItem('email')?.toString() || '';
};

export const getPassword = (): string => {
    return CryptoJS.AES.decrypt(localStorage.getItem('password')?.toString() || '', key).toString(CryptoJS.enc.Utf8);
};

export const getUserId = () => {
    return localStorage.getItem('userId')
        ? CryptoJS.AES.decrypt(localStorage.getItem('userId')!, key).toString(CryptoJS.enc.Utf8)
        : '';
};

export const getUserName = () => {
    return localStorage.getItem('username') || '';
};

export const getRoles = () => {
    return localStorage.getItem('roles')
        ? CryptoJS.AES.decrypt(localStorage.getItem('roles')!, key).toString(CryptoJS.enc.Utf8).split(',')
        : [];
};

export const hasCredentials = (): boolean => {
    return localStorage.getItem('email') && localStorage.getItem('password') ? true : false;
};

export const isEmployee = (): boolean => {
    return getRoles().includes('Сотрудник');
};

export const isManager = (): boolean => {
    return getRoles().includes('Менеджер');
};

export const isAdmin = (): boolean => {
    return getRoles().includes('Администратор');
};

// Set values to local storage

export const setUserInfo = (userInfo: UserInfo) => {
    const encryptedPassword = CryptoJS.AES.encrypt(userInfo.password, key);
    const encryptedRoles = CryptoJS.AES.encrypt(userInfo.roles.toString(), key);
    const encryptedUserId = CryptoJS.AES.encrypt(userInfo.id.toString(), key);

    localStorage.setItem('email', userInfo.email);
    localStorage.setItem('password', encryptedPassword.toString());
    localStorage.setItem('userId', encryptedUserId.toString());
    localStorage.setItem('username', userInfo.fullName);
    localStorage.setItem('roles', encryptedRoles.toString());
};

export const removeUserInfo = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('email');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('roles');
};

export const updatePassword = (password: string) => {
    const encryptedPassword = CryptoJS.AES.encrypt(password, key);
    localStorage.setItem('password', encryptedPassword.toString());
};

export const isInvertedTheme = () => {
    return localStorage.getItem('theme') === ('dark' || undefined) ? true : false;
};

export const toggleTheme = () => {
    localStorage.getItem('theme') === 'light'
        ? localStorage.setItem('theme', 'dark')
        : localStorage.setItem('theme', 'light');
};
