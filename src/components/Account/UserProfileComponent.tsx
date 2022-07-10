import React, { FC } from 'react';
import { TextField, PrimaryButton } from '@fluentui/react';
import { EmployeeEdit } from 'src/DAL/Employees';
import { getExperienseString } from 'src/shared/DateUtils';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    employee: EmployeeEdit;
    editingEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;
}

const UserProfileComponent: FC<Props> = (props: Props) => {
    return (
        <div>
            <TextField label="ФИО:" defaultValue={props.employee.fullName} borderless readOnly />
            <TextField label="Email:" defaultValue={props.employee.email} borderless readOnly />
            <TextField label="Телефон:" defaultValue={props.employee.phone} borderless readOnly />
            <TextField
                label="Дата рождения:"
                defaultValue={props.employee.birthDate.toLocaleDateString()}
                borderless
                readOnly
            />
            <TextField
                label="Дата устройства:"
                defaultValue={props.employee.employedDate.toLocaleDateString()}
                borderless
                readOnly
            />
            <TextField
                label="Стаж"
                defaultValue={getExperienseString(props.employee.employedDate)}
                borderless
                readOnly
            />
            <PrimaryButton text="Редактировать" onClick={() => props.editingEmployee(props.employee.id)} />
        </div>
    );
};

export default UserProfileComponent;
