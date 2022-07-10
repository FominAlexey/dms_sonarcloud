import { Employee, EmployeeEdit } from 'src/DAL/Employees';

import { AppState } from 'src/store/slice';
import {
    addingEmployee,
    clearEmployee,
    getEmployeesAsyncThunk,
    editingEmployeeAsyncThunk,
    postEmployeeAsyncThunk,
    putEmployeeAsyncThunk,
    deletingEmployeeAsyncThunk,
    deleteEmployeeAsyncThunk,
} from 'src/store/slice/employeesSlice';
import { ActionAsyncThunk } from 'src/shared/Common';

export interface IEmployeesProps {
    employees: Employee[];
    employeesLoading: boolean;
    currentEmployee: EmployeeEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;
    posting: boolean;
    getEmployees: (includeFired: boolean) => ActionAsyncThunk<Employee[], boolean | undefined>;
    addingEmployee: () => void;
    editingEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;
    postEmployee: (employee: EmployeeEdit) => ActionAsyncThunk<boolean, EmployeeEdit>;
    putEmployee: (employee: EmployeeEdit) => ActionAsyncThunk<boolean, EmployeeEdit>;
    clearEmployee: () => void;
    deletingEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;
    deleteEmployee: (id: string) => ActionAsyncThunk<boolean, string>;

    needToUpdateEmployees: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        employees: store.employees.employees,
        employeesLoading: store.employees.loading,
        currentEmployee: store.employees.current,
        isAdding: store.employees.isAdding,
        isEditing: store.employees.isEditing,
        isDeleting: store.employees.isDeleting,
        posting: store.employees.posting,

        needToUpdateEmployees: store.employees.needToUpdate,
    };
};

export const mapDispatchToProps = {
    getEmployees: (includeFired: boolean) => getEmployeesAsyncThunk(includeFired),
    addingEmployee: () => addingEmployee(),
    editingEmployee: (id: string) => editingEmployeeAsyncThunk(id),
    postEmployee: (employee: EmployeeEdit) => postEmployeeAsyncThunk(employee),
    putEmployee: (employee: EmployeeEdit) => putEmployeeAsyncThunk(employee),
    clearEmployee: () => clearEmployee(),
    deletingEmployee: (id: string) => deletingEmployeeAsyncThunk(id),
    deleteEmployee: (id: string) => deleteEmployeeAsyncThunk(id),
};
