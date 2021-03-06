import React, { FC, FormEvent, useState } from 'react';
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

    const _onChangeIsEmployee = (
        ev?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        if (!checked) {
            setIsEmployee(false);
        } else {
            setIsEmployee(true);
        }
    };

    const _onChangeIsManager = (
        ev?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        if (!checked) {
            setIsManager(false);
        } else {
            setIsManager(true);
        }
    };

    const _onChangeIsAdministrator = (
        ev?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        if (!checked) {
            setIsAdministrator(false);
        } else {
            setIsAdministrator(true);
        }
    };

    const _onCloseDialog = () => {
        props.clearEmployee();
    };

    const _onSave = () => {
        // Update roles
        const roles: Role[] = [];

        if (isEmployee) roles.push({ id: EMPLOYEE, title: '??????????????????' });

        if (isManager) roles.push({ id: MANAGER, title: '????????????????' });

        if (isAdministrator) roles.push({ id: ADMINISTRATOR, title: '??????????????????????????' });

        props.patchEmployee({ id: props.employee.id, roles });

    };

    return (
        <EditDialog
            hidden={false}
            disabledSaveBtn={false}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props!.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <Label>????????</Label>
                <Checkbox label="??????????????????" checked={isEmployee} onChange={_onChangeIsEmployee} />
                <Checkbox label="????????????????" checked={isManager} onChange={_onChangeIsManager} />
                <Checkbox label="??????????????????????????" checked={isAdministrator} onChange={_onChangeIsAdministrator} />
            </Stack>
        </EditDialog>
    );
};

export default UsersManagementEditComponent;
