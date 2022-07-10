import {
    Expense,
    ExpenseEdit,
    getExpenses,
    mapExpenseFromServer,
    uploadFile,
    postExpense,
    putExpense,
    getExpense,
    mapExpenseEditFromServer,
    deleteExpense,
    saveFile,
    Currencies,
    PaymentMethods,
    ExpenseFromServer,
    ExpenseEditFromServer,
    putExpenseChangeStatus,
} from 'src/DAL/Expenses';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import save from 'save-file';
import { CREATED, zeroGuid } from 'src/shared/Constants';
import { AxiosResponse } from 'axios';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { loginAsyncThunk } from './accountSlice';

export interface ExpensesState {
    loading: boolean;
    posting: boolean;
    expenses: Expense[];
    current: ExpenseEdit | null;
    postedResult: ExpenseEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;
    documentId: number | null;

    needToUpdate: boolean;
    loadingDocument: boolean;
    error: ErrorObject | null;
}

const InitialExpensesState: ExpensesState = {
    loading: false,
    posting: false,
    expenses: [],
    current: null,
    postedResult: null,
    isAdding: false,
    isEditing: false,
    isDeleting: false,
    documentId: null,
    needToUpdate: false,
    loadingDocument: false,
    error: null,
};

export type ExpensesInfoType = {
    employeeId: string | null;
    status: string | null;
    fromDate: Date | null;
    toDate: Date | null;
};

export type ExpenseInfoType = {
    expense: ExpenseEdit;
    file: FormData | null;
};

export type PatchExpenseInfoType = {
    id: string;
    status: string;
};

export type DocumentInfoType = {
    id: number;
    fileName: string;
};

//#region --------------------- AsyncThunk --------------------------

export const getExpensesAsyncThunk = createAsyncThunk<
    Expense[],
    ExpensesInfoType,
    {
        rejectValue: NetworkError;
    }
>('expenses/getExpenses', async (expensesInfo, { rejectWithValue }) => {
    try {
        const { employeeId, status, fromDate, toDate } = expensesInfo;
        const response: AxiosResponse<ExpenseFromServer[]> = await getExpenses(employeeId, status, fromDate, toDate);
        let expenses: Expense[] = response.data.map(mapExpenseFromServer);
        console.log(response.data);

        // For confirmations
        if (!fromDate && !toDate) expenses = expenses.sort((a, b) => (a.transactionDate > b.transactionDate ? -1 : 1));

        return expenses;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postExpenseAsyncThunk = createAsyncThunk<
    boolean,
    ExpenseInfoType,
    {
        rejectValue: NetworkError;
    }
>('expenses/postExpense', async (postExpenseInfo, { rejectWithValue }) => {
    try {
        if (postExpenseInfo.file) {
            const response: AxiosResponse<number> = await uploadFile(postExpenseInfo.file);
            postExpenseInfo.expense.documentId = response.data;
        }
        await postExpense(postExpenseInfo.expense);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putExpenseAsyncThunk = createAsyncThunk<
    boolean,
    ExpenseInfoType,
    {
        rejectValue: NetworkError;
    }
>('expenses/putExpense', async (putExpenseInfo, { rejectWithValue }) => {
    try {
        if (putExpenseInfo.file) {
            const response: AxiosResponse<number> = await uploadFile(putExpenseInfo.file);
            putExpenseInfo.expense.documentId = response.data;
        }

        await putExpense(putExpenseInfo.expense);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const patchExpenseAsyncThunk = createAsyncThunk<
    boolean,
    PatchExpenseInfoType,
    {
        rejectValue: NetworkError;
    }
>('expenses/patchExpense', async (patchExpenseInfo, { rejectWithValue }) => {
    try {
        await putExpenseChangeStatus(patchExpenseInfo.id, patchExpenseInfo.status);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteExpenseAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('expenses/deleteExpense', async (id, { rejectWithValue }) => {
    try {
        await deleteExpense(id);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const saveDocumentAsyncThunk = createAsyncThunk<
    boolean,
    DocumentInfoType,
    {
        rejectValue: NetworkError;
    }
>('expenses/saveDocument', async (documentInfo, { rejectWithValue }) => {
    try {
        const response = await saveFile(documentInfo.id);
        await save(new Blob([response.data]), documentInfo.fileName);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletingExpenseAsyncThunk = createAsyncThunk<
    ExpenseEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('expenses/deletingExpense', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<ExpenseEditFromServer> = await getExpense(id);
        const expense = mapExpenseEditFromServer(response.data);
        return expense;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingExpenseAsyncThunk = createAsyncThunk<
    ExpenseEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('expenses/editingExpense', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<ExpenseEditFromServer> = await getExpense(id);
        const expense = mapExpenseEditFromServer(response.data);
        return expense;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

//#endregion

const expensesSlice = createSlice({
    name: 'expenses',
    initialState: InitialExpensesState,
    reducers: {
        addingExpense(state) {
            const expense: ExpenseEdit | null = {
                id: zeroGuid,
                employeeId: zeroGuid,
                expenseCategoryId: zeroGuid,
                documentId: null,
                description: undefined,
                amount: 0,
                transactionDate: new Date(),
                paymentDate: null,
                approvalStatusId: CREATED,
                currencyId: Currencies[0].currencyId,
                paymentMethodId: PaymentMethods[0].paymentMethodId,
                managerId: null, // need to fix
            };

            state.isAdding = true;
            state.current = expense;
        },
        clearExpense(state) {
            state.isAdding = false;
            state.isEditing = false;
            state.isDeleting = false;
            state.postedResult = null;
            state.current = null;
        },
        clearErrorExpenses(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder

            //#region ------------- getExpenses ----------------------
            .addCase(getExpensesAsyncThunk.pending, state => {
                state.loading = true;
            })
            .addCase(getExpensesAsyncThunk.fulfilled, (state, action: PayloadAction<Expense[]>) => {
                const nextExpenses: Expense[] = Object.assign({}, state.expenses);

                action.payload.forEach((element, index) => {
                    if (!nextExpenses[index]) {
                        nextExpenses[index] = element;
                    }
                });

                state.expenses = action.payload;
                state.needToUpdate = false;
                state.loading = false;
            })
            .addCase(getExpensesAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить список расходов', error: action.error.message };

                state.loading = false;
            })
            //#endregion

            //#region ------------- postExpense ----------------------
            .addCase(postExpenseAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postExpenseAsyncThunk.fulfilled, state => {
                state.isAdding = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(postExpenseAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };

                state.posting = false;
            })
            //#endregion

            //#region ------------- putExpense ----------------------
            .addCase(putExpenseAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(putExpenseAsyncThunk.fulfilled, state => {
                state.isAdding = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(putExpenseAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };

                state.posting = false;
            })
            //#endregion

            //#region ------------- patchExpense ----------------------
            .addCase(patchExpenseAsyncThunk.fulfilled, (state, action) => {
                if (action.payload) {
                    state.isEditing = false;
                    state.needToUpdate = true;
                    state.current = null;
                } else {
                    state.error = { message: 'Не удалось получить информацию о расходе' };
                }

                state.posting = false;
            })
            .addCase(patchExpenseAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };

                state.posting = false;
            })
            //#endregion

            //#region ------------- saveDocument ----------------------
            .addCase(saveDocumentAsyncThunk.pending, state => {
                state.loadingDocument = true;
            })
            .addCase(saveDocumentAsyncThunk.fulfilled, state => {
                state.loadingDocument = false;
            })
            .addCase(saveDocumentAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить документ', error: action.error.message };

                state.loadingDocument = false;
            })
            //#endregion

            //#region ------------- deleteExpense ----------------------
            .addCase(deleteExpenseAsyncThunk.fulfilled, state => {
                state.isDeleting = false;
                state.needToUpdate = true;
                state.current = null;
            })
            .addCase(deleteExpenseAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить удаление', error: action.error.message };
            })
            //#endregion

            //#region ------------- deletingExpense ----------------------
            .addCase(deletingExpenseAsyncThunk.fulfilled, (state, action: PayloadAction<ExpenseEdit>) => {
                state.isDeleting = true;
                state.current = action.payload;
            })
            .addCase(deletingExpenseAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию о расходе', error: action.error.message };
            })
            //#endregion

            //#region ------------- editingExpense ----------------------
            .addCase(editingExpenseAsyncThunk.fulfilled, (state, action: PayloadAction<ExpenseEdit>) => {
                state.isEditing = true;
                state.current = action.payload;
            })
            .addCase(editingExpenseAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось получить информацию о расходе', error: action.error.message };
            })
            //#endregion

            // Clear error before Login
            .addCase(loginAsyncThunk.fulfilled, state => {
                state.error = null;
            });
    },
});

export const { addingExpense, clearExpense, clearErrorExpenses } = expensesSlice.actions;
export default expensesSlice.reducer;
