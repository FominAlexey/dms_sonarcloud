import { Expense, ExpenseEdit } from 'src/DAL/Expenses';
import { ExpenseCategory } from 'src/DAL/Dictionaries';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';

import { AppState } from 'src/store/slice';

import {
    addingExpense,
    clearExpense,
    getExpensesAsyncThunk,
    postExpenseAsyncThunk,
    putExpenseAsyncThunk,
    deletingExpenseAsyncThunk,
    deleteExpenseAsyncThunk,
    saveDocumentAsyncThunk,
    editingExpenseAsyncThunk,
    ExpensesInfoType,
    ExpenseInfoType,
    DocumentInfoType,
} from 'src/store/slice/expensesSlice';

import { getExpenseCategoriesAsyncThunk } from 'src/store/slice/expenseCategoriesSlice';

export interface IExpensesProps {
    userId: string;
    expenses: Expense[];
    expensesLoading: boolean;
    currentExpense: ExpenseEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;
    posting: boolean;
    addingExpense: () => void;
    clearExpense: () => void;
    getExpenses: (expensesInfoArg: ExpensesInfoType) => ActionAsyncThunk<Expense[], ExpensesInfoType>;
    editingExpense: (id: string) => ActionAsyncThunk<ExpenseEdit, string>;
    postExpense: (expenseInfoArg: ExpenseInfoType) => ActionAsyncThunk<boolean, ExpenseInfoType>;
    putExpense: (expenseInfoArg: ExpenseInfoType) => ActionAsyncThunk<boolean, ExpenseInfoType>;
    deletingExpense: (id: string) => ActionAsyncThunk<ExpenseEdit, string>;
    deleteExpense: (id: string) => ActionAsyncThunk<boolean, string>;
    saveFile: (documentInfoArg: DocumentInfoType) => ActionAsyncThunk<boolean, DocumentInfoType>;

    expenseCategories: ExpenseCategory[] | null;
    getExpenseCategories: () => any;

    needToUpdateExpenses: boolean;

    searchProps: ISearchProps;

    isLoadingDocument: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        userId: store.account.userId,
        expenses: store.expenses.expenses,
        expensesLoading: store.expenses.loading,
        currentExpense: store.expenses.current,
        isAdding: store.expenses.isAdding,
        isEditing: store.expenses.isEditing,
        isDeleting: store.expenses.isDeleting,
        documentId: store.expenses.documentId,
        posting: store.expenses.posting,

        expenseCategories: store.expenseCategories.expenseCategories,

        needToUpdateExpenses: store.expenses.needToUpdate,

        isLoadingDocument: store.expenses.loadingDocument,
    };
};

export const mapDispatchToProps = {
    getExpenses: (expensesInfoArg: ExpensesInfoType) => getExpensesAsyncThunk(expensesInfoArg),
    addingExpense: () => addingExpense(),
    editingExpense: (id: string) => editingExpenseAsyncThunk(id),
    postExpense: (expenseInfoArg: ExpenseInfoType) => postExpenseAsyncThunk(expenseInfoArg),
    putExpense: (expenseInfoArg: ExpenseInfoType) => putExpenseAsyncThunk(expenseInfoArg),
    clearExpense: () => clearExpense(),
    getExpenseCategories: () => getExpenseCategoriesAsyncThunk(),
    deletingExpense: (id: string) => deletingExpenseAsyncThunk(id),
    deleteExpense: (id: string) => deleteExpenseAsyncThunk(id),
    saveFile: (documentInfoArg: DocumentInfoType) => saveDocumentAsyncThunk(documentInfoArg),
};
