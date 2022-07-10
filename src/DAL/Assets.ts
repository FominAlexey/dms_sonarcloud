import baseAPI from './Config';
import { SERVER_URL } from './Constants';
import { AxiosResponse } from 'axios';

// Interfaces
export interface Asset {
    id: string;
    employee: string;
    title: string;
    description: string | null;
    serialNumber: string | null;
    receiveDate: Date | null;
}

export interface AssetEdit {
    id: string;
    employeeId: string;
    title?: string;
    description?: string;
    serialNumber?: string;
    receiveDate: Date | null;
}

export interface AssetFromServer {
    id: string;
    employee: string;
    title: string;
    description: string;
    serialNumber: string;
    receiveDate: string;
}

export interface AssetEditFromServer {
    id: string;
    employeeId: string;
    title: string;
    description: string | null;
    serialNumber: string | null;
    receiveDate: string | null;
}

// Map methods
export const mapAssetsFromServer = (asset: AssetFromServer): Asset => ({
    ...asset,
    receiveDate: asset.receiveDate ? new Date(asset.receiveDate) : null,
});

export const mapAssetsEditFromServer = (asset: AssetEditFromServer): AssetEdit => ({
    ...asset,
    receiveDate: asset.receiveDate ? new Date(asset.receiveDate) : null,
    description: asset.description || undefined,
    serialNumber: asset.serialNumber || undefined,
});

// Fetch methods
export const getAssets = async (): Promise<AxiosResponse<AssetFromServer[]>> => {
    return baseAPI.get(`${SERVER_URL}Assets/`);
};

export const getAsset = async (id: string): Promise<AxiosResponse<AssetEditFromServer>> => {
    return baseAPI.get(`${SERVER_URL}Assets/${id}`);
};

export const postAsset = async (asset: AssetEdit): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}Assets/`, asset);
};

export const putAsset = async (asset: AssetEdit): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}Assets/${asset.id}`, asset);
};

export const deleteAsset = async (id: string): Promise<AxiosResponse> => {
    return baseAPI.delete(`${SERVER_URL}Assets/${id}`);
};
