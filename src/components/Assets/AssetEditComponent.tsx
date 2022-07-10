import React, { FC, useEffect, useState } from 'react';
import {
    Stack,
    TextField,
    Checkbox,
    IComboBoxOption,
    IComboBox,
    DatePicker,
    DayOfWeek,
    ComboBox,
} from '@fluentui/react';
import { AssetEdit } from 'src/DAL/Assets';
import { Employee } from 'src/DAL/Employees';
import { toUTC } from 'src/shared/DateUtils';
import { requiredMessage, zeroGuid } from 'src/shared/Constants';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';
import { DAY_PICKER_STRINGS } from 'src/shared/DateUtils';

interface Props {
    asset: AssetEdit;
    employees: Employee[];
    posting: boolean;
    saveAsset: (asset: AssetEdit) => void;
    clearAsset: () => void;
}

interface validationState {
    isValidTitle: boolean;
    isValidEmployee: boolean;
}

const AssetEditComponent: FC<Props> = (props: Props) => {
    // Initial values
    const [assetTitle, setAssetTitle] = useState<string | undefined>(props.asset.title);
    const [assetDescription, setAssetDescription] = useState<string | undefined>(props.asset.description);
    const [assetSerialNumber, setAssetSerialNumber] = useState<string | undefined>(props.asset.serialNumber);
    const [assetReceiveDate, setAssetReceiveDate] = useState<Date | null>(props.asset.receiveDate || null);
    const [assetEmployeeId, setAssetEmployeeId] = useState<string>(props.asset.employeeId);
    const [assetReceived, setAssetReceived] = useState<boolean>(props.asset.receiveDate ? true : false);

    const [EmployeesOptions, setEmployeesOptions] = useState<IComboBoxOption[]>();

    const [validation, setValidation] = useState<validationState>({
        isValidTitle: props.asset.title !== undefined,
        isValidEmployee: props.asset.employeeId !== zeroGuid,
    });

    // Set employees list options
    useEffect(() => {
        const options: IComboBoxOption[] = props.employees.map(item => {
            return {
                key: item.id,
                text: item.fullName,
            } as IComboBoxOption;
        });
        setEmployeesOptions(options);
    }, [props.employees]);

    const _onCloseDialog = () => {
        props.clearAsset();
    };

    const _onSave = () => {
        const newAsset: AssetEdit = {
            id: props.asset.id,
            employeeId: assetEmployeeId,
            title: assetTitle?.trim(),
            description: assetDescription
                ? assetDescription?.trim().length !== 0
                    ? assetDescription.trim()
                    : undefined
                : undefined,
            serialNumber: assetSerialNumber
                ? assetSerialNumber?.trim().length !== 0
                    ? assetSerialNumber.trim()
                    : undefined
                : undefined,
            receiveDate: assetReceived && assetReceiveDate ? toUTC(assetReceiveDate) : null,
        };
        props.saveAsset(newAsset);
    };

    const _onChangeTitle = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setAssetTitle(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidTitle: newValue?.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidTitle: false });
        }
    };

    const _onChangeDescription = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string,
    ) => {
        setAssetDescription(newValue);
    };

    const _onChangeSerialNumber = (
        event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string,
    ) => {
        setAssetSerialNumber(newValue);
    };

    const _onChangeReceiveDate = (date: Date | null | undefined) => {
        date ? setAssetReceiveDate(date) : setAssetReceiveDate(null);
    };

    const _onChangeAssetReceived = (
        event?: React.FormEvent<HTMLInputElement | HTMLElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        if (!checked) {
            setAssetReceived(false);
            setAssetReceiveDate(null);
        } else {
            setAssetReceived(checked);
            setAssetReceiveDate(new Date());
        }
    };

    const _onChangeAssetEmployee = (
        event: React.FormEvent<IComboBox>,
        option?: IComboBoxOption,
        index?: number,
        value?: string,
    ): void => {
        if (option) {
            //setAssetEmployeeId(Number.parseInt(option.key.toString()));
            setAssetEmployeeId(option.key.toString());
            setValidation({ ...validation, isValidEmployee: true });
        }
    };

    const isValidForm = validation.isValidTitle && validation.isValidEmployee;

    return (
        <EditDialog
            disabledSaveBtn={!isValidForm}
            hidden={false}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <ComboBox
                    required
                    label="Сотрудник"
                    options={EmployeesOptions}
                    selectedKey={assetEmployeeId}
                    onChange={_onChangeAssetEmployee}
                    errorMessage={validation?.isValidEmployee ? undefined : requiredMessage}
                />
                <TextField
                    required
                    label="Название"
                    value={assetTitle}
                    onChange={_onChangeTitle}
                    errorMessage={validation?.isValidTitle ? undefined : requiredMessage}
                />
                <TextField label="Описание" multiline value={assetDescription} onChange={_onChangeDescription} />
                <TextField label="Серийный номер" value={assetSerialNumber} onChange={_onChangeSerialNumber} />
                <Checkbox label="Возвращено" onChange={_onChangeAssetReceived} checked={assetReceived} />
                <DatePicker
                    isRequired
                    disabled={!assetReceived}
                    label="Дата возврата"
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date!.toLocaleDateString()}
                    value={assetReceiveDate || new Date()}
                    onSelectDate={_onChangeReceiveDate}
                    strings={DAY_PICKER_STRINGS}
                />
            </Stack>
        </EditDialog>
    );
};

export default AssetEditComponent;
