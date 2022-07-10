import React, { FC, useState } from 'react';
import { Stack, Checkbox, Label } from '@fluentui/react';
import { EmployeeEdit, Role } from 'src/DAL/Employees';
import EditDialog from 'src/components/EditDialog';
import { verticalGapStackTokens } from 'src/shared/Styles';
import { EMPLOYEE, MANAGER, ADMINISTRATOR } from 'src/shared/Constants';
import { PatchEmployeeInfoType } from 'src/store/slice/employeesSlice';
import { ActionAsyncThunk } from 'src/shared/Common';

interface RolesProps {
    employee: EmployeeEdit;
    posting: boolean;
    patchEmployee: (patchEmployeeInfoArg: PatchEmployeeInfoType) => ActionAsyncThunk<boolean, PatchEmployeeInfoType>;
    clearEmployee: () => void;
    setUserPassword: (id: string, password: string) => Promise<void>;
}
const UsersManagementEditComponent: FC<RolesProps> = (props: RolesProps) => {
    // Set initial values
    const [isEmployee, setIsEmployee] = useState<boolean>(
        props.employee.roles.findIndex(r => r.id === EMPLOYEE) !== -1,
    );
    const [isManager, setIsManager] = useState<boolean>(props.employee.roles.findIndex(r => r.id === MANAGER) !== -1);
    const [isAdministrator, setIsAdministrator] = useState<boolean>(
        props.employee.roles.findIndex(r => r.id === ADMINISTRATOR) !== -1,
    );
    // const [password, setPassword]=useState<string | undefined>(undefined);
    // const [isValidPassword, setIsValidPassword] = useState(true);

    const _onChangeIsEmployee = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        if (!checked) {
            setIsEmployee(false);
        } else {
            setIsEmployee(true);
        }
    };

    const _onChangeIsManager = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        if (!checked) {
            setIsManager(false);
        } else {
            setIsManager(true);
        }
    };

    const _onChangeIsAdministrator = (
        ev?: React.FormEvent<HTMLElement | HTMLInputElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        if (!checked) {
            setIsAdministrator(false);
        } else {
            setIsAdministrator(true);
        }
    };

    // const _onChangePassword = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => {
    //     setPassword(newValue);
    //     if(newValue){
    //         if(newValue.match(/^[a-zA-Z0-9!@#$%^&*]{8,}$/)){
    //             setIsValidPassword(true)
    //         }
    //         else{
    //             setIsValidPassword(false)
    //         }
    //     }
    //     else{
    //         setIsValidPassword(true)
    //     }
    // }

    const _onCloseDialog = () => {
        props.clearEmployee();
    };

    const _onSave = () => {
        // Update roles
        const roles: Role[] = [];

        if (isEmployee) roles.push({ id: EMPLOYEE, title: 'Сотрудник' });

        if (isManager) roles.push({ id: MANAGER, title: 'Менеджер' });

        if (isAdministrator) roles.push({ id: ADMINISTRATOR, title: 'Администратор' });

        props.patchEmployee({ id: props.employee.id, roles });

        // Update password
        // if(password && isValidPassword){
        //     props.setUserPassword(props.employee.id, password);
        // }
    };

    return (
        <EditDialog
            hidden={false}
            disabledSaveBtn={false}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <Label>Роли</Label>
                <Checkbox label="Сотрудник" checked={isEmployee} onChange={_onChangeIsEmployee} />
                <Checkbox label="Менеджер" checked={isManager} onChange={_onChangeIsManager} />
                <Checkbox label="Администратор" checked={isAdministrator} onChange={_onChangeIsAdministrator} />
                {/* <TextField 
                    label="Пароль" 
                    value={password}
                    onChange={_onChangePassword}
                    description="Введите новый пароль или оставьте поле пустым"
                    errorMessage={isValidPassword ? undefined : errorPasswordMessage}
                    type="password"
                /> */}
            </Stack>
        </EditDialog>
    );
};

export default UsersManagementEditComponent;
