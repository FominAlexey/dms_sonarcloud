import React, { FC, FormEvent, useEffect, useState } from 'react';
import {
    Stack,
    TextField,
    Checkbox,
    IComboBoxOption,
    DatePicker,
    DayOfWeek,
    ComboBox,
    IComboBox,
} from '@fluentui/react';
import { AssetEdit } from 'src/DAL/Assets';
import { Employee } from 'src/DAL/Employees';
import { toUTC, DAY_PICKER_STRINGS } from 'src/shared/DateUtils';
import { requiredMessage, zeroGuid } from 'src/shared/Constants';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';

interface Props {
    asset: AssetEdit;
    employees: Employee[];
    posting: boolean;
    saveAsset: (asset: AssetEdit) => void;
    clearAsset: () => void;
}

interface ValidationState {
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

    const [validation, setValidation] = useState<ValidationState>({
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

    const _onChangeTitle = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setAssetTitle(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidTitle: newValue?.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidTitle: false });
        }
    };

    const _onChangeDescription = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,        
        newValue?: string,
    ) => {
        setAssetDescription(newValue);
    };

    const _onChangeSerialNumber = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setAssetSerialNumber(newValue);
    };

    const _onChangeReceiveDate = (date: Date | null | undefined) => {
        date ? setAssetReceiveDate(date) : setAssetReceiveDate(null);
    };

    const _onChangeAssetReceived = (
        ev?: FormEvent<HTMLInputElement | HTMLElement> | undefined,
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

    const _onChangeAssetEmployee = (event: FormEvent<IComboBox>, option?: IComboBoxOption): void => {
        if (option) {
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
                    label="??????????????????"
                    options={EmployeesOptions}
                    selectedKey={assetEmployeeId}
                    onChange={_onChangeAssetEmployee}
                    errorMessage={validation?.isValidEmployee ? undefined : requiredMessage}
                />
                <TextField
                    required
                    label="????????????????"
                    value={assetTitle}
                    onChange={_onChangeTitle}
                    errorMessage={validation?.isValidTitle ? undefined : requiredMessage}
                />
                <TextField label="????????????????" multiline value={assetDescription} onChange={_onChangeDescription} />
                <TextField label="???????????????? ??????????" value={assetSerialNumber} onChange={_onChangeSerialNumber} />
                <Checkbox label="????????????????????" onChange={_onChangeAssetReceived} checked={assetReceived} />
                <DatePicker
                    isRequired
                    disabled={!assetReceived}
                    label="???????? ????????????????"
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
