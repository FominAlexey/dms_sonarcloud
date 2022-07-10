import React, { FC, useState } from 'react';
import { Stack, TextField, DatePicker, DayOfWeek } from '@fluentui/react';
import { EmployeeEdit } from 'src/DAL/Employees';
import { toUTC, getDateFromLocaleString, DAY_PICKER_STRINGS } from 'src/shared/DateUtils';
import { requiredMessage } from 'src/shared/Constants';
import { PhoneReg } from 'src/shared/RegExpressions';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    employee: EmployeeEdit;
    posting: boolean;
    saveEmployee: (employee: EmployeeEdit) => ActionAsyncThunk<boolean, EmployeeEdit>;
    clearEmployee: () => void;
}

interface validationState {
    isValidFullName: boolean;
    isValidPhone: boolean;
}

const UserProfileEditComponent: FC<Props> = (props: Props) => {
    // Initial values
    const [employeeFullName, setEmployeeFullname] = useState<string | undefined>(props.employee.fullName);
    const [employeeBirthDate, setEmployeeBirthDate] = useState<Date>(props.employee.birthDate);
    const [employeePhone, setEmployeePhone] = useState<string | undefined>(props.employee.phone);

    const [validation, setValidation] = useState<validationState>({
        isValidFullName: props.employee.fullName ? props.employee.fullName.trim().length !== 0 : false,
        isValidPhone: props.employee.phone ? PhoneReg.test(props.employee.phone) : false,
    });

    const _onCloseDialog = () => {
        props.clearEmployee();
    };

    const _onSave = () => {
        const newEmployee: EmployeeEdit = {
            id: props.employee.id,
            fullName: employeeFullName!.trim(),
            birthDate: toUTC(employeeBirthDate),
            email: props.employee.email,
            phone: employeePhone!.trim(),
            employedDate: toUTC(props.employee.employedDate),
            leaveDate: props.employee.leaveDate ? toUTC(props.employee.leaveDate) : null,
            isLeave: props.employee.isLeave,
            managerId: props.employee.managerId,
            roles: props.employee.roles,
            employmentTypeId: props.employee.employmentTypeId,
            utilization: props.employee.utilization,
        };
        props.saveEmployee(newEmployee);
    };

    const _onChangeFullname = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setEmployeeFullname(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidFullName: newValue.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidFullName: false });
        }
    };

    const _onChangePhone = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setEmployeePhone(newValue);
        if (newValue) {
            if (PhoneReg.test(newValue)) {
                setValidation({ ...validation, isValidPhone: newValue.trim().length !== 0 });
            } else {
                setValidation({ ...validation, isValidPhone: false });
            }
        } else {
            setValidation({ ...validation, isValidPhone: false });
        }
    };

    const _onChangeBirthDate = (date: Date | null | undefined) => {
        date ? setEmployeeBirthDate(date) : setEmployeeBirthDate(new Date());
    };

    const _onKeyPressPhone = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key < '0' || event.key > '9') {
            event.preventDefault();
        }
    };

    const isValidForm = validation.isValidFullName && validation.isValidPhone;

    return (
        <EditDialog
            hidden={false}
            disabledSaveBtn={!isValidForm}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <TextField
                    required
                    label="ФИО"
                    value={employeeFullName}
                    onChange={_onChangeFullname}
                    errorMessage={validation.isValidFullName ? undefined : requiredMessage}
                />
                <DatePicker
                    label="Дата рождения"
                    value={employeeBirthDate}
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date!.toLocaleDateString()}
                    onSelectDate={_onChangeBirthDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    strings={DAY_PICKER_STRINGS}
                />
                <TextField
                    required
                    prefix="+"
                    label="Телефон"
                    value={employeePhone}
                    onChange={_onChangePhone}
                    onKeyPress={_onKeyPressPhone}
                    errorMessage={validation.isValidPhone ? undefined : 'Введите корректный номер телефона'}
                />
            </Stack>
        </EditDialog>
    );
};

export default UserProfileEditComponent;
