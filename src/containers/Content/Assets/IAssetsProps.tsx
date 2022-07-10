import { Employee } from 'src/DAL/Employees';
import { AssetEdit, Asset } from 'src/DAL/Assets';

import {
    addingAsset,
    clearAsset,
    getAssetsAsyncThunk,
    postAssetAsyncThunk,
    putAssetAsyncThunk,
    deleteAssetAsyncThunk,
    editingAssetAsyncThunk,
    deletingAssetAsyncThunk,
} from 'src/store/slice/assetsSlice';

import { getEmployeesAsyncThunk } from 'src/store/slice/employeesSlice';
import { AppState } from 'src/store/slice';
import { ActionAsyncThunk } from 'src/shared/Common';

export interface IAssetsProps {
    assets: Asset[];
    assetsLoading: boolean;
    posting: boolean;
    currentAsset: AssetEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;

    addingAsset: () => void;

    clearAsset: () => void;

    getAssets: () => ActionAsyncThunk<Asset[], void>;

    editingAsset: (id: string) => ActionAsyncThunk<AssetEdit, string>;

    postAsset: (asset: AssetEdit) => ActionAsyncThunk<boolean, AssetEdit>;

    putAsset: (asset: AssetEdit) => ActionAsyncThunk<boolean, AssetEdit>;

    deletingAsset: (id: string) => ActionAsyncThunk<AssetEdit, string>;

    deleteAsset: (id: string) => ActionAsyncThunk<boolean, string>;

    employees: Employee[] | null;
    getEmployees: () => ActionAsyncThunk<Employee[], boolean | undefined>;
    needToUpdateAssets: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        assets: store.assets.assets,
        assetsLoading: store.assets.loading,
        posting: store.assets.posting,
        currentAsset: store.assets.current,
        isAdding: store.assets.isAdding,
        isEditing: store.assets.isEditing,
        isDeleting: store.assets.isDeleting,

        employees: store.employees.employees,

        needToUpdateAssets: store.assets.needToUpdate,
    };
};

export const mapDispatchToProps = {
    getAssets: () => getAssetsAsyncThunk(),
    addingAsset: () => addingAsset(),
    editingAsset: (id: string) => editingAssetAsyncThunk(id),
    postAsset: (asset: AssetEdit) => postAssetAsyncThunk(asset),
    putAsset: (asset: AssetEdit) => putAssetAsyncThunk(asset),
    clearAsset: () => clearAsset(),
    getEmployees: () => getEmployeesAsyncThunk(),
    deleteAsset: (id: string) => deleteAssetAsyncThunk(id),
    deletingAsset: (id: string) => deletingAssetAsyncThunk(id),
};
