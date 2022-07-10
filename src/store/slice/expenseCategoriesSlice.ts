import {
    ExpenseCategory,
    getExpenseCategories,
    postExpenseCategory,
    putExpenseCategory,
    deleteExpenseCategory,
    getExpenseCategory,
} from 'src/DAL/Dictionaries';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { zeroGuid } from 'src/shared/Constants';
import { loginAsyncThunk } from './accountSlice';

export interface ExpenseCategoriesState {
    loading: boolean;
    posting: boolean;
    expenseCategories: ExpenseCategory[];
    current: ExpenseCategory | null;
    postedResult: ExpenseCategory | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;
    needToUpdate: boolean;
    error: ErrorObject | null;
}

const InitialExpenseCategoriesState: ExpenseCategoriesState = {
    loading: false,
    posting: false,
    expenseCategories: [],
    current: null,
    postedResult: null,
    isAdding: false,
    isEditing: false,
    isDeleting: false,
    needToUpdate: true,
    error: null,
};

//#region -------------- AsyncThunk ----------------------------

export const getExpenseCategoriesAsyncThunk = createAsyncThunk<
    ExpenseCategory[],
    void,
    {
        rejectValue: NetworkError;
    }
>('expenseCategories/getExpenseCategories', async (_, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<ExpenseCategory[]> = await getExpenseCategories();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postExpenseCategoryAsyncThunk = createAsyncThunk<
    boolean,
    ExpenseCategory,
    {
        rejectValue: NetworkError;
    }
>('expenseCategories/postExpenseCategory', async (expenseCategory, { rejectWithValue }) => {
    try {
        await postExpenseCategory(expenseCategory);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putExpenseCategoryAsyncThunk = createAsyncThunk<
    boolean,
    ExpenseCategory,
    {
        rejectValue: NetworkError;
    }
>('expenseCategories/putExpenseCategory', async (expenseCategory, { rejectWithValue }) => {
    try {
        await putExpenseCategory(expenseCategory);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteExpenseCategoryAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('expenseCategories/deleteExpenseCategory', async (id, { rejectWithValue }) => {
    try {
        await deleteExpenseCategory(id);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletingExpenseCategoryAsyncThunk = createAsyncThunk<
    ExpenseCategory,
    string,
    {
        rejectValue: NetworkError;
    }
>('expenseCategories/deletingExpenseCategory', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<ExpenseCategory> = await getExpenseCategory(id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingExpenseCategoryAsyncThunk = createAsyncThunk<
    ExpenseCategory,
    string,
    {
        rejectValue: NetworkError;
    }
>('expenseCategories/editingExpenseCategory', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<ExpenseCategory> = await getExpenseCategory(id);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
//#endregion

const expenseCategoriesSlice = createSlice({
    name: 'expenseCategories',
    initialState: InitialExpenseCategoriesState,
    reducers: {
        addingExpenseCategory(state) {
            const expenseCategory: ExpenseCategory = {
                id: zeroGuid,
                title: undefined,
                color: undefined,
            };

            state.isAdding = true;
            state.current = expenseCategory;
        },
        clearExpenseCategory(state) {
            state.isAdding = false;
            state.isEditing = false;
            state.isDeleting = false;
            state.current = null;
            state.postedResult = null;
        },
        clearErrorExpenseCategories(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder

            //#region ---------------- getExpenseCategories --------------------
            .addCase(getExpenseCategoriesAsyncThunk.pending, state => {
                state.expenseCategories = [];
                state.loading = true;
            })
            .addCase(getExpenseCategoriesAsyncThunk.fulfilled, (state, action: PayloadAction<ExpenseCategory[]>) => {
                state.expenseCategories = action.payload;
                state.loading = false;
                state.needToUpdate = false;
            })
            .addCase(getExpenseCategoriesAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить список категорий расходов',
                        error: action.error.message,
                    };

                state.loading = false;
            })
            //#endregion

            //#region ---------------- postExpenseCategory --------------------
            .addCase(postExpenseCategoryAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postExpenseCategoryAsyncThunk.fulfilled, state => {
                state.current = null;
                state.isAdding = false;
                state.needToUpdate = true;
                state.posting = false;
            })
            .addCase(postExpenseCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };

                state.posting = false;
            })
            //#endregion

            //#region ---------------- putExpenseCategory --------------------
            .addCase(putExpenseCategoryAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(putExpenseCategoryAsyncThunk.fulfilled, state => {
                state.isEditing = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(putExpenseCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };

                state.posting = false;
            })
            //#endregion

            //#region ---------------- deleteExpenseCategory --------------------
            .addCase(deleteExpenseCategoryAsyncThunk.fulfilled, state => {
                state.isDeleting = false;
                state.needToUpdate = true;
                state.current = null;
            })
            .addCase(deleteExpenseCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить удаление', error: action.error.message };
            })
            //#endregion

            //#region ---------------- deletingExpenseCategory --------------------
            .addCase(deletingExpenseCategoryAsyncThunk.fulfilled, (state, action: PayloadAction<ExpenseCategory>) => {
                state.current = action.payload;
                state.isDeleting = true;
            })
            .addCase(deletingExpenseCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию о категории',
                        error: action.error.message,
                    };
            })
            //#endregion

            //#region ---------------- editingExpenseCategory --------------------
            .addCase(editingExpenseCategoryAsyncThunk.fulfilled, (state, action: PayloadAction<ExpenseCategory>) => {
                state.isEditing = true;
                state.current = action.payload;
            })
            .addCase(editingExpenseCategoryAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию о категории',
                        error: action.error.message,
                    };
            })
            //#endregion

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { addingExpenseCategory, clearExpenseCategory, clearErrorExpenseCategories } =
    expenseCategoriesSlice.actions;
export default expenseCategoriesSlice.reducer;
