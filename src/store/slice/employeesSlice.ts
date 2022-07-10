import {
    Employee,
    EmployeeEdit,
    getEmployees,
    mapEmployeeFromServer,
    getEmployee,
    mapEmployeeEditFromServer,
    postEmployee,
    putEmployee,
    deleteEmployee,
    Role,
    EmploymentTypes,
    EmployeeFromServer,
    EmployeeEditFromServer,
} from 'src/DAL/Employees';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toUTC } from 'src/shared/DateUtils';
import { EMPLOYEE, zeroGuid } from 'src/shared/Constants';
import { AxiosResponse } from 'axios';
import { ErrorObject, NetworkError } from 'src/shared/Common';
import { loginAsyncThunk } from './accountSlice';

export interface EmployeesState {
    loading: boolean;
    posting: boolean;
    employees: Employee[];
    current: EmployeeEdit | null;
    postedResult: EmployeeEdit | null;
    isAdding: boolean;
    isEditing: boolean;
    isDeleting: boolean;

    needToUpdate: boolean;
    error: ErrorObject | null;
}

const InitialEmployeesState: EmployeesState = {
    loading: false,
    posting: false,
    employees: [],
    current: null,
    postedResult: null,
    isAdding: false,
    isEditing: false,
    isDeleting: false,
    needToUpdate: true,
    error: null,
};

export type PatchEmployeeInfoType = {
    id: string;
    roles: Role[];
};

//#region ------------- AsynkThunk --------------------
export const getEmployeesAsyncThunk = createAsyncThunk<
    Employee[],
    boolean | undefined,
    {
        rejectValue: NetworkError;
    }
>('employees/getEmployees', async (includeFired = false, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EmployeeFromServer[]> = await getEmployees(includeFired);
        const employees = response.data.map(mapEmployeeFromServer);
        return employees;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const getEmployeeAsyncThunk = createAsyncThunk<
    EmployeeEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('employees/getEmployee', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EmployeeEditFromServer> = await getEmployee(id);
        const employee = mapEmployeeEditFromServer(response.data);
        return employee;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const postEmployeeAsyncThunk = createAsyncThunk<
    boolean,
    EmployeeEdit,
    {
        rejectValue: NetworkError;
    }
>('employees/postEmployee', async (employee, { rejectWithValue }) => {
    try {
        await postEmployee(employee);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const putEmployeeAsyncThunk = createAsyncThunk<
    boolean,
    EmployeeEdit,
    {
        rejectValue: NetworkError;
    }
>('employees/putEmployee', async (employee, { rejectWithValue }) => {
    try {
        await putEmployee(employee);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteEmployeeAsyncThunk = createAsyncThunk<
    boolean,
    string,
    {
        rejectValue: NetworkError;
    }
>('employees/deleteEmployee', async (id, { rejectWithValue }) => {
    try {
        await deleteEmployee(id);
        return true;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const patchEmployeeAsyncThunk = createAsyncThunk<
    boolean,
    PatchEmployeeInfoType,
    {
        rejectValue: NetworkError;
    }
>('employees/patchEmployee', async (patchEmployeeInfo, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EmployeeEditFromServer> = await getEmployee(patchEmployeeInfo.id);
        let employee: EmployeeEdit | null = null;
        employee = mapEmployeeEditFromServer(response.data);
        employee.roles = patchEmployeeInfo.roles;
        employee.birthDate = toUTC(employee.birthDate);
        employee.employedDate = toUTC(employee.employedDate);
        employee.leaveDate = employee.leaveDate ? toUTC(employee.leaveDate) : null;

        if (employee) {
            await putEmployee(employee);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deletingEmployeeAsyncThunk = createAsyncThunk<
    EmployeeEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('employees/deletingEmployee', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EmployeeEditFromServer> = await getEmployee(id);
        const employee = mapEmployeeEditFromServer(response.data);
        return employee;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const editingEmployeeAsyncThunk = createAsyncThunk<
    EmployeeEdit,
    string,
    {
        rejectValue: NetworkError;
    }
>('employees/editingEmployee', async (id, { rejectWithValue }) => {
    try {
        const response: AxiosResponse<EmployeeEditFromServer> = await getEmployee(id);
        const employee = mapEmployeeEditFromServer(response.data);
        return employee;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});
//#endregion

const employeesSlice = createSlice({
    name: 'employees',
    initialState: InitialEmployeesState,
    reducers: {
        addingEmployee(state) {
            const employee: EmployeeEdit | null = {
                id: zeroGuid,
                fullName: undefined,
                email: undefined,
                phone: undefined,
                birthDate: new Date(),
                employedDate: new Date(),
                leaveDate: null,
                isLeave: false,
                managerId: zeroGuid,
                roles: [{ id: EMPLOYEE, title: 'Сотрудник' }],
                employmentTypeId: EmploymentTypes[0].employmentTypeId,
                utilization: NaN,
            };

            state.isAdding = true;
            state.current = employee;
        },
        clearEmployee(state) {
            state.isAdding = false;
            state.isEditing = false;
            state.isDeleting = false;
            state.postedResult = null;
            state.current = null;
        },
        clearErrorEmployees(state) {
            state.error = null;
        },
    },
    extraReducers: builder => {
        builder
            //#region -------------- getEmployees -----------------------
            .addCase(getEmployeesAsyncThunk.pending, state => {
                state.loading = true;
                state.employees = [];
            })
            .addCase(getEmployeesAsyncThunk.fulfilled, (state, action: PayloadAction<Employee[]>) => {
                state.employees = action.payload;
                state.needToUpdate = false;
                state.loading = false;
            })
            .addCase(getEmployeesAsyncThunk.rejected, (state, action) => {
                state.loading = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не уалось получить список сотрудников', error: action.error.message };
            })
            //#endregion

            //#region -------------- getEmployee -----------------------
            .addCase(getEmployeeAsyncThunk.pending, state => {
                state.current = null;
            })
            .addCase(getEmployeeAsyncThunk.fulfilled, (state, action: PayloadAction<EmployeeEdit>) => {
                state.current = action.payload;
            })
            .addCase(getEmployeeAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию о сотруднике',
                        error: action.error.message,
                    };
            })
            //#endregion

            //#region -------------- postEmployee -----------------------
            .addCase(postEmployeeAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(postEmployeeAsyncThunk.fulfilled, state => {
                state.isAdding = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(postEmployeeAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region -------------- putEmployee -----------------------
            .addCase(putEmployeeAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(putEmployeeAsyncThunk.fulfilled, state => {
                state.isEditing = false;
                state.needToUpdate = true;
                state.posting = false;
                state.current = null;
            })
            .addCase(putEmployeeAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region -------------- patchEmployee -----------------------
            .addCase(patchEmployeeAsyncThunk.pending, state => {
                state.posting = true;
            })
            .addCase(patchEmployeeAsyncThunk.fulfilled, (state, action: PayloadAction<boolean>) => {
                if (action.payload) {
                    state.isEditing = false;
                    state.needToUpdate = true;
                    state.current = null;
                } else {
                    state.error = { message: 'Не удалось получить информацию о сотруднике' };
                }

                state.posting = false;
            })
            .addCase(patchEmployeeAsyncThunk.rejected, (state, action) => {
                state.posting = false;

                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось сохранить изменения', error: action.error.message };
            })
            //#endregion

            //#region -------------- deleteEmployee -----------------------
            .addCase(deleteEmployeeAsyncThunk.fulfilled, state => {
                state.isDeleting = false;
                state.needToUpdate = true;
                state.current = null;
            })
            .addCase(deleteEmployeeAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else state.error = { message: 'Не удалось выполнить удаление', error: action.error.message };
            })
            //#endregion

            //#region -------------- deletingEmployee -----------------------
            .addCase(deletingEmployeeAsyncThunk.fulfilled, (state, action: PayloadAction<EmployeeEdit>) => {
                state.isDeleting = true;
                state.current = action.payload;
            })
            .addCase(deletingEmployeeAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию о сотруднике',
                        error: action.error.message,
                    };
            })
            //#endregion

            //#region -------------- editingEmployee -----------------------
            .addCase(editingEmployeeAsyncThunk.fulfilled, (state, action: PayloadAction<EmployeeEdit>) => {
                state.isEditing = true;
                state.current = action.payload;
            })
            .addCase(editingEmployeeAsyncThunk.rejected, (state, action) => {
                if (action.payload !== undefined && Boolean(action.payload))
                    state.error = { message: action.payload.Message };
                else
                    state.error = {
                        message: 'Не удалось получить информацию о сотруднике',
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

export const { addingEmployee, clearEmployee, clearErrorEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;
