import React, { FC, useState, useEffect, FormEvent } from 'react';
import {
    Stack,
    TextField,
    ComboBox,
    IComboBoxOption,
    DatePicker,
    DayOfWeek,
    Checkbox,
    IComboBox,
} from '@fluentui/react';
import { Employee, EmployeeEdit, EmploymentTypes } from 'src/DAL/Employees';
import { toUTC, getDateFromLocaleString, DAY_PICKER_STRINGS, getNextDate } from 'src/shared/DateUtils';
import { requiredMessage, EMPLOYEE } from 'src/shared/Constants';
import { EmailReg, PhoneReg } from 'src/shared/RegExpressions';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    employee: EmployeeEdit;
    closeManagers: Employee[];
    posting: boolean;
    saveEmployee: (employee: EmployeeEdit) => ActionAsyncThunk<boolean, EmployeeEdit>;
    clearEmployee: () => void;
}

interface ValidationState {
    isValidFullName: boolean;
    isValidEmail: boolean;
    isValidPhone: boolean;
    isValidEmployeedDate: boolean;
    isValidLeaveDate: boolean;
    isValidLeave: boolean;
    isValidCloseManagerId: boolean;
}

type myDate = Date | null | undefined;

const EmployeeEditComponent: FC<Props> = (props: Props) => {
    // Initial values
    const [employeeFullName, setEmployeeFullname] = useState<string | undefined>(props.employee.fullName);
    const [employeeBirthDate, setEmployeeBirthDate] = useState<Date>(props.employee.birthDate);
    const [employeeEmail, setEmployeeEmail] = useState<string | undefined>(props.employee.email);
    const [employeePhone, setEmployeePhone] = useState<string | undefined>(props.employee.phone);
    const [employeeEmployedDate, setEmployeeEmployedDate] = useState<Date>(props.employee.employedDate);
    const [employeeLeaveDate, setEmployeeLeaveDate] = useState<Date | null>(
        props.employee.leaveDate ? getNextDate(props.employee.leaveDate) : null,
    );
    const [employeeLeave, setEmployeeLeave] = useState<boolean>(props.employee.leaveDate ? true : false);
    const [employeeManagerId, setEmployeeManagerId] = useState<string>(props.employee.managerId);
    const [employeeEmploymentTypeId, setEmployeeEmploymetTypeId] = useState<string>(props.employee.employmentTypeId);

    const [CloseManagerOptions, setCloseManagerOptions] = useState<IComboBoxOption[]>();

    const EmploymentTypeOptions: IComboBoxOption[] = EmploymentTypes.map(item => {
        return {
            key: item.employmentTypeId,
            text: item.title,
        };
    });

    const [validation, setValidation] = useState<ValidationState>({
        isValidFullName: props.employee.fullName ? props.employee.fullName.trim().length !== 0 : false,
        isValidEmail: props.employee.email ? EmailReg.test(props.employee.email) : false,
        isValidPhone: props.employee.phone ? PhoneReg.test(props.employee.phone) : false,
        isValidEmployeedDate: props.employee.employedDate !== null,
        isValidLeaveDate: props.employee.leaveDate ? props.employee.employedDate < props.employee.leaveDate : true,
        isValidLeave: props.employee.isLeave ? props.employee.isLeave : false,
        isValidCloseManagerId: props.employee.managerId !== '',
    });

    const errorDatesMessage = 'Указан неверный период';

    // Set CloseManagers list options
    useEffect(() => {
        const options: IComboBoxOption[] = props.closeManagers.map(item => {
            return {
                key: item.id,
                text: item.fullName,
            } as IComboBoxOption;
        });
        setCloseManagerOptions(options);
    }, [props.closeManagers]);

    const _onCloseDialog = () => {
        props.clearEmployee();
    };

    const _onSave = () => {
        const newEmployee: EmployeeEdit = {
            id: props.employee.id,
            fullName: employeeFullName!.trim(),
            birthDate: toUTC(employeeBirthDate),
            email: employeeEmail!.trim(),
            phone: employeePhone!.trim(),
            employedDate: toUTC(employeeEmployedDate),
            leaveDate: employeeLeave && employeeLeaveDate ? toUTC(employeeLeaveDate) : null,
            isLeave: employeeLeave,
            managerId: employeeManagerId,
            roles: props.employee.roles ? props.employee.roles : [{ id: EMPLOYEE, title: 'Сотрудник' }],
            employmentTypeId: employeeEmploymentTypeId,
            utilization: props.employee.utilization,
        };
        props.saveEmployee(newEmployee);
    };

    const _onChangeManager = (
        event: FormEvent<IComboBox>,
        option?: IComboBoxOption | undefined,
        index?: number | undefined,
        value?: string | undefined,
    ): void => {
        if (option) {
            setEmployeeManagerId(option.key.toString());
            setValidation({ ...validation, isValidCloseManagerId: true });
        }
    };

    const _onChangeFullname = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setEmployeeFullname(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidFullName: newValue.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidFullName: false });
        }
    };

    const _onChangeEmail = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setEmployeeEmail(newValue);
        if (newValue) {
            if (EmailReg.test(newValue)) {
                setValidation({ ...validation, isValidEmail: true });
            } else {
                setValidation({ ...validation, isValidEmail: false });
            }
        } else {
            setValidation({ ...validation, isValidEmail: false });
        }
    };

    const _onChangePhone = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
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

    const _onChangeBirthDate = (date: myDate) => {
        date ? setEmployeeBirthDate(date) : setEmployeeBirthDate(new Date());
    };

    const _onChangeEmployedDate = (date: myDate) => {
        date ? setEmployeeEmployedDate(date) : setEmployeeEmployedDate(new Date());
        setValidation({ ...validation, isValidEmployeedDate: date !== null });
        if (employeeLeave) setValidation({ ...validation, isValidLeaveDate: toUTC(date!) < toUTC(employeeLeaveDate!) });
    };

    const _onChangeLeaveDate = (date: myDate) => {
        date ? setEmployeeLeaveDate(date) : setEmployeeLeaveDate(null);
        setValidation({ ...validation, isValidLeaveDate: toUTC(employeeEmployedDate) < toUTC(date!) });
    };

    const _onChangeLeave = (
        ev?: FormEvent<HTMLInputElement | HTMLElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        setEmployeeLeaveDate(getNextDate(new Date()));
        if (!checked) {
            setEmployeeLeave(false);
            setValidation({ ...validation, isValidLeaveDate: true });
        } else {
            setEmployeeLeave(checked);
            setValidation({ ...validation, isValidLeaveDate: toUTC(employeeEmployedDate)! < toUTC(new Date()) });
        }
    };

    const _onChangeEmploymenttype = (
        event: FormEvent<IComboBox>,
        option?: IComboBoxOption | undefined,
        index?: number | undefined,
        value?: string | undefined,
    ): void => {
        if (option) {
            setEmployeeEmploymetTypeId(option.key.toString());
            //setEmployeeEmploymetTypeId(Number.parseInt(option.key.toString()))
        }
    };

    const _onKeyPressPhone = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key < '0' || event.key > '9') {
            event.preventDefault();
        }
    };

    const isValidForm =
        validation.isValidFullName &&
        validation.isValidEmail &&
        validation.isValidPhone &&
        validation.isValidEmployeedDate &&
        validation.isValidLeaveDate &&
        validation.isValidCloseManagerId;

    return (
        <EditDialog
            hidden={false}
            disabledSaveBtn={!isValidForm}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <ComboBox
                    required
                    label="Руководитель"
                    options={CloseManagerOptions}
                    onChange={_onChangeManager}
                    selectedKey={employeeManagerId}
                    errorMessage={validation.isValidCloseManagerId ? undefined : requiredMessage}
                />
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
                    label="Email"
                    value={employeeEmail}
                    onChange={_onChangeEmail}
                    errorMessage={validation.isValidEmail ? undefined : 'Введите корректный email'}
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
                <ComboBox
                    label="Тип трудоустройства"
                    options={EmploymentTypeOptions}
                    selectedKey={employeeEmploymentTypeId}
                    onChange={_onChangeEmploymenttype}
                />
                <DatePicker
                    label="Дата устройства"
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date!.toLocaleDateString()}
                    value={employeeEmployedDate}
                    onSelectDate={_onChangeEmployedDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    strings={DAY_PICKER_STRINGS}
                />
                <Checkbox label="Уволен" checked={employeeLeave} onChange={_onChangeLeave} />
                <DatePicker
                    label="Дата увольнения"
                    disabled={!employeeLeave}
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date!.toLocaleDateString()}
                    value={employeeLeaveDate || getNextDate(new Date())}
                    onSelectDate={_onChangeLeaveDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    strings={DAY_PICKER_STRINGS}
                    textField={!validation.isValidLeaveDate ? { errorMessage: errorDatesMessage } : undefined}
                />
            </Stack>
        </EditDialog>
    );
};

export default EmployeeEditComponent;
