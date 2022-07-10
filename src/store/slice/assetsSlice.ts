import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    getAssets,
    getAsset,
    mapAssetsEditFromServer,
    AssetEdit,
    postAsset,
    putAsset,
    Asset,
    deleteAsset,
    mapAssetsFromServer,
    AssetEditFromServer,
    AssetFromServer,
} from 'src/DAL/Assets';
import { AxiosResponse } from 'axios';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { zeroGuid } from 'src/shared/Constants';
import { loginAsyncThunk } from './accountSlice';

export interface AssetsState {
    loading: boolean;
    posting: boolean;
    assets: Asset[];
    current: AssetEdit | null;
    postedResult: AssetEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;

    needToUpdate: boolean;
    error: ErrorObject | null;
}

const InitialAssetsState: AssetsState = {
    loading: false,
    posting: false,
    assets: [],
    current: null,
    postedResult: null,
    isAdding: false,
    isEditing: false,
    isDeleting: false,
    needToUpdate: true,
    error: null,
};

//#region AsyncThunk
export const getAssetsAsyncThunk = createAsyncThunk<
    Asset[],
    void,
    {
        rejectValue: NetworkError;
    }
>('assets/getAssets', async (_, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<AssetFromServer[]> = await getAssets();
        const assets = response.data.map(mapAssetsFromServer);
        return assets;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getAssetAsyncThunk = createAsyncThunk<
    AssetEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('assets/getAsset', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<AssetEditFromServer> = await getAsset(id);
        const asset = mapAssetsEditFromServer(response.data);
        return asset;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postAssetAsyncThunk = createAsyncThunk<
    boolean,
    AssetEdit,
    {
        rejectValue: NetworkError;
    }
>('assets/postAsset', async (asset, { rejectWithValue }) => {
    try {
        await postAsset(asset);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putAssetAsyncThunk = createAsyncThunk<
    boolean,
    AssetEdit,
    {
        rejectValue: NetworkError;
    }
>('assets/putAsset', async (asset, { rejectWithValue }) => {
    try {
        await putAsset(asset);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteAssetAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('assets/deleteAsset', async (id, { rejectWithValue }) => {
    try {
        await deleteAsset(id);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingAssetAsyncThunk = createAsyncThunk<
    AssetEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('assets/editingAsset', async (id, { rejectWithValue }) => {
    try {
        const response = await getAsset(id);
        const asset = mapAssetsEditFromServer(response.data);
        return asset;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletingAssetAsyncThunk = createAsyncThunk<
    AssetEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('assets/deletingAsset', async (id, { rejectWithValue }) => {
    try {
        const response = await getAsset(id);
        const asset = mapAssetsEditFromServer(response.data);
        return asset;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//#endregion

const assetsSlice = createSlice({
    name: 'assets',
    initialState: InitialAssetsState,
    reducers: {
        addingAsset(state) {
            const asset: AssetEdit = {
                id: zeroGuid,
                employeeId: zeroGuid,
                title: undefined,
                description: undefined,
                serialNumber: undefined,
                receiveDate: null,
            };

            state.isAdding = true;
            state.current = asset;
        },
        clearAsset(state) {
            state.isAdding = false;
            state.isEditing = false;
            state.isDeleting = false;
            state.postedResult = null;
            state.current = null;
        },
        clearErrorAssets(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            //#region ------------------- getAssets --------------------------
            .addCase(getAssetsAsyncThunk.pending, state => {
                state.loading = true;
            })
            .addCase(getAssetsAsyncThunk.fulfilled, (state, action: PayloadAction<Asset[]>) => {
                state.assets = action.payload;
                state.loading = false;
                state.needToUpdate = false;
            })
            .addCase(getAssetsAsyncThunk.rejected, (state, action) => {
                state.loading = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить список активов', error: action.error.message };
            })
            //#endregion

            //#region ------------------- getAsset --------------------------
            .addCase(getAssetAsyncThunk.pending, state => {
                state.current = null;
            })
            .addCase(getAssetAsyncThunk.fulfilled, (state, action: PayloadAction<AssetEdit>) => {
                state.current = action.payload;
            })
            .addCase(getAssetAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию об активе', error: action.error.message };
            })
            //#endregion

            //#region ------------------- postAssets --------------------------
            .addCase(postAssetAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postAssetAsyncThunk.fulfilled, state => {
                state.isAdding = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(postAssetAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ------------------- putAssets --------------------------
            .addCase(putAssetAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(putAssetAsyncThunk.fulfilled, state => {
                state.isEditing = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(putAssetAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region ------------------ deleteAssets --------------------------
            .addCase(deleteAssetAsyncThunk.fulfilled, state => {
                state.isDeleting = false;
                state.needToUpdate = true;
                state.current = null;
            })
            .addCase(deleteAssetAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить удаление', error: action.error.message };
            })
            //#endregion

            //#region ------------------ editingAssets --------------------------
            .addCase(editingAssetAsyncThunk.fulfilled, (state, action: PayloadAction<AssetEdit>) => {
                state.isEditing = true;
                state.current = action.payload;
            })
            .addCase(editingAssetAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию об активе', error: action.error.message };
            })
            //#endregion

            //#region ------------------ deletingAssets --------------------------
            .addCase(deletingAssetAsyncThunk.fulfilled, (state, action: PayloadAction<AssetEdit>) => {
                state.isDeleting = true;
                state.current = action.payload;
            })
            .addCase(deletingAssetAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию об активе', error: action.error.message };
            })
            //#endregion

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { addingAsset, clearAsset, clearErrorAssets } = assetsSlice.actions;
export default assetsSlice.reducer;
