import {
    IProductionCalendar,
    getProductionCalendar,
    mapProductionCalendarFromServer,
} from 'src/DAL/ProductionCalendar';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { loginAsyncThunk } from './accountSlice';

export interface ProductionCalendarState {
    loading: boolean;
    posting: boolean;

    isAdding: boolean;
    isEditing: boolean;

    needToUpdate: boolean;

    productionCalendar: IProductionCalendar[];

    error: ErrorObject | null;
}

const InitialProductionCalendarState: ProductionCalendarState = {
    loading: false,
    posting: false,
    isAdding: false,
    isEditing: false,
    needToUpdate: false,
    productionCalendar: [],
    error: null,
};

export const getProductionCalendarAsyncThunk = createAsyncThunk<
    IProductionCalendar[],
    void,
    {
        rejectValue: NetworkError;
    }
>('productionCalendar/getProductionCalendar', async (_, { rejectWithValue }) => {
    try {
        const response = await getProductionCalendar();
        const productionCalendar = response.map(mapProductionCalendarFromServer);
        return productionCalendar;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const productionCalendarSlice = createSlice({
    name: 'productionCalendar',
    initialState: InitialProductionCalendarState,
    reducers: {
        clearErrorProductionCalendar(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getProductionCalendarAsyncThunk.pending, state => {
                state.loading = true;
            })
            .addCase(
                getProductionCalendarAsyncThunk.fulfilled,
                (state, action: PayloadAction<IProductionCalendar[]>) => {
                    state.productionCalendar = action.payload;
                    state.loading = false;
                },
            )
            .addCase(getProductionCalendarAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить производственный календарь',
                        error: action.error.message,
                    };

                state.loading = false;
            })

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { clearErrorProductionCalendar } = productionCalendarSlice.actions;
export default productionCalendarSlice.reducer;
