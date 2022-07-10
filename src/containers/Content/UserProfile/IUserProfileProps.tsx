import { EmployeeEdit } from 'src/DAL/Employees';
import { AppState } from 'src/store/slice';

import {
    getEmployeeAsyncThunk,
    editingEmployeeAsyncThunk,
    putEmployeeAsyncThunk,
    clearEmployee,
} from 'src/store/slice/employeesSlice';

import { ActionAsyncThunk } from 'src/shared/Common';

export interface IUserProfileProps {
    userId: string;
    currentEmployee: EmployeeEdit | null;
    isEditing: boolean;
    posting: boolean;
    getEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;
    editingEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;
    putEmployee: (employee: EmployeeEdit) => ActionAsyncThunk<boolean, EmployeeEdit>;
    clearEmployee: () => void;
    needToUpdateEmployee: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        userId: store.account.userId,
        employeesLoading: store.employees.loading,
        currentEmployee: store.employees.current,
        isEditing: store.employees.isEditing,
        posting: store.employees.posting,
        needToUpdateEmployee: store.employees.needToUpdate,
    };
};

export const mapDispatchToProps = {
    getEmployee: (id: string) => getEmployeeAsyncThunk(id),
    editingEmployee: (id: string) => editingEmployeeAsyncThunk(id),
    putEmployee: (employee: EmployeeEdit) => putEmployeeAsyncThunk(employee),
    clearEmployee: () => clearEmployee(),
};
