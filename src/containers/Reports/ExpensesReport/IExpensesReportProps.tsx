import { RouteComponentProps } from 'react-router-dom';
import { EmployeeEdit } from 'src/DAL/Employees';
import { Expense } from 'src/DAL/Expenses';
import { ISearchProps, ActionAsyncThunk } from 'src/shared/Common';
import { getEmployeeAsyncThunk } from 'src/store/slice/employeesSlice';
import {
    getExpensesAsyncThunk,
    saveDocumentAsyncThunk,
    DocumentInfoType,
    ExpensesInfoType,
} from 'src/store/slice/expensesSlice';
import { AppState } from 'src/store/slice';

interface RouteParams {
    employeeId: string;
}

export interface IExpensesReportProps extends RouteComponentProps<RouteParams> {
    employee: EmployeeEdit | null;
    getEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;

    expenses: Expense[] | null;
    getExpenses: (expensesInfoArg: ExpensesInfoType) => ActionAsyncThunk<Expense[], ExpensesInfoType>;
    expensesLoading: boolean;
    saveFile: (documentInfoArg: DocumentInfoType) => ActionAsyncThunk<boolean, DocumentInfoType>;
    isLoadingDocument: boolean;

    searchProps: ISearchProps;
}

export const mapStateToProps = (store: AppState) => {
    return {
        employee: store.employees.current,
        expenses: store.expenses.expenses,
        expensesLoading: store.expenses.loading,
        isLoadingDocument: store.expenses.loadingDocument,
    };
};

export const mapDispatchToProps = {
    getEmployee: (employeeId: string) => getEmployeeAsyncThunk(employeeId),

    getExpenses: (expensesInfoArg: ExpensesInfoType) => getExpensesAsyncThunk(expensesInfoArg),

    saveFile: (documentInfoArg: DocumentInfoType) => saveDocumentAsyncThunk(documentInfoArg),
};
