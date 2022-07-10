import { Expense } from 'src/DAL/Expenses';
import { Employee } from 'src/DAL/Employees';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';
import { AppState } from 'src/store/slice';
import {
    getExpensesAsyncThunk,
    saveDocumentAsyncThunk,
    DocumentInfoType,
    ExpensesInfoType,
} from 'src/store/slice/expensesSlice';
import { getEmployeesAsyncThunk } from 'src/store/slice/employeesSlice';

export interface IExpensesReportOverviewProps {
    expenses: Expense[] | null;
    getExpenses: (expensesInfoArg: ExpensesInfoType) => ActionAsyncThunk<Expense[], ExpensesInfoType>;
    expensesLoading: boolean;
    saveFile: (documentInfoArg: DocumentInfoType) => ActionAsyncThunk<boolean, DocumentInfoType>;
    employees: Employee[] | null;
    getEmployees: () => ActionAsyncThunk<Employee[], boolean | undefined>;
    searchProps: ISearchProps;
    isLoadingDocument: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        expenses: store.expenses.expenses,
        expensesLoading: store.expenses.loading,
        employees: store.employees.employees,
        isLoadingDocument: store.expenses.loadingDocument,
    };
};

export const mapDispatchToProps = {
    getExpenses: (expensesInfoArg: ExpensesInfoType) => getExpensesAsyncThunk(expensesInfoArg),
    saveFile: (documentInfoArg: DocumentInfoType) => saveDocumentAsyncThunk(documentInfoArg),
    getEmployees: () => getEmployeesAsyncThunk(),
};
