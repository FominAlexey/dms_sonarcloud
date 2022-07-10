import { Employee, EmployeeEdit, Role } from 'src/DAL/Employees';

import { AppState } from 'src/store/slice';
import {
    getEmployeesAsyncThunk,
    editingEmployeeAsyncThunk,
    patchEmployeeAsyncThunk,
    clearEmployee,
    PatchEmployeeInfoType,
} from 'src/store/slice/employeesSlice';

import { ActionAsyncThunk } from 'src/shared/Common';

export interface IUsersManagementProps {
    employees: Employee[] | null;
    employeesLoading: boolean;
    isEmployeesEditing: boolean;
    currentEmployee: EmployeeEdit | null;
    posting: boolean;
    getEmployees: () => ActionAsyncThunk<Employee[], boolean | undefined>;
    patchEmployee: (patchEmployeeInfoArg: PatchEmployeeInfoType) => ActionAsyncThunk<boolean, PatchEmployeeInfoType>;
    editingEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;
    clearEmployee: () => void;
    setUserPassword: (id: string, password: string) => any;

    needToUpdateEmployees: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        employees: store.employees.employees,
        employeesLoading: store.employees.loading,
        isEmployeesEditing: store.employees.isEditing,
        currentEmployee: store.employees.current,
        posting: store.employees.posting,
        needToUpdateEmployees: store.employees.needToUpdate,
    };
};

export const mapDispatchToProps = {
    getEmployees: () => getEmployeesAsyncThunk(),
    patchEmployee: (patchEmployeeInfoArg: PatchEmployeeInfoType) => patchEmployeeAsyncThunk(patchEmployeeInfoArg),
    editingEmployee: (id: string) => editingEmployeeAsyncThunk(id),
    clearEmployee: () => clearEmployee(),
};
