import React, { FC, useState, useEffect } from 'react';
import { Stack, TextField, ComboBox, IComboBoxOption, IComboBox, DatePicker, DayOfWeek, Label } from '@fluentui/react';
import { ExpenseEdit, Currencies, PaymentMethods } from 'src/DAL/Expenses';
import { ExpenseCategory } from 'src/DAL/Dictionaries';
import { toUTC, getDateFromLocaleString, DAY_PICKER_STRINGS } from 'src/shared/DateUtils';
import { requiredMessage, zeroGuid, CREATED } from 'src/shared/Constants';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';
import { ExpenseInfoType } from 'src/store/slice/expensesSlice';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    userId: string;
    expense: ExpenseEdit;
    expenseCategories: ExpenseCategory[];
    posting: boolean;
    saveExpense: (expenseInfoArg: ExpenseInfoType) => ActionAsyncThunk<boolean, ExpenseInfoType>;
    clearExpense: () => void;
}

interface validationState {
    isValidExpenseCategoryId: boolean;
    isValidDocument: boolean;
    isValidDescription: boolean;
    isValidAmount: boolean;
}

const ExpenseEditComponent: FC<Props> = (props: Props) => {
    // Set initial values
    const [expenseCategoryId, setExpenseCategoryId] = useState<string>(props.expense.expenseCategoryId);
    const expenseDocumentId = props.expense.documentId || null;
    const [expenseDescription, setExpenseDescription] = useState<string | undefined>(props.expense.description);
    const [expenseAmount, setExpenseAmount] = useState<number>(props.expense.amount);
    const [expenseAmountString, setExpenseAmountString] = useState<string | undefined>(
        props.expense.amount !== 0 ? String(props.expense.amount) : undefined,
    );
    const [expenseTransactionDate, setExpenseTransactionDate] = useState<Date>(props.expense.transactionDate);
    const [expenseCurrencyId, setExpenseCurrencyId] = useState<string>(props.expense.currencyId);
    const [expensePaymentMethodId, setExpensePaymentMethodId] = useState<string>(props.expense.paymentMethodId);

    const [expenseFile, setExpenseFile] = useState<FormData | null>(null);

    const [ExpenseCategoryOptions, setExpenseCategoryOptions] = useState<IComboBoxOption[]>();

    const CurrencyOptions: IComboBoxOption[] = Currencies.map(item => {
        return {
            key: item.currencyId,
            text: item.title,
        };
    });

    const PaymentMethodOptions: IComboBoxOption[] = PaymentMethods.map(item => {
        return {
            key: item.paymentMethodId,
            text: item.title,
        };
    });

    const [validation, setValidation] = useState<validationState>({
        isValidExpenseCategoryId: props.expense.expenseCategoryId !== zeroGuid,
        isValidDocument: true,
        isValidDescription: props.expense.description ? props.expense.description.trim().length !== 0 : false,
        isValidAmount: props.expense.amount > 0,
    });

    // Set expense categoriel list options
    useEffect(() => {
        const options: IComboBoxOption[] = props.expenseCategories.map(item => {
            return {
                key: item.id,
                text: item.title,
            } as IComboBoxOption;
        });
        setExpenseCategoryOptions(options);
    }, [props.expenseCategories]);

    const _onCloseDialog = () => {
        props.clearExpense();
    };

    const _onSave = () => {
        const newExpense: ExpenseEdit = {
            id: props.expense.id,
            employeeId: props.userId,
            expenseCategoryId: expenseCategoryId,
            description: expenseDescription.trim(),
            documentId: expenseDocumentId,
            amount: expenseAmount,
            transactionDate: toUTC(expenseTransactionDate),
            approvalStatusId: CREATED,
            paymentDate: null,
            currencyId: expenseCurrencyId,
            paymentMethodId: expensePaymentMethodId,
            managerId: null,
        };
        props.saveExpense({ expense: newExpense, file: expenseFile });
    };

    const _onChangeCategory = (
        option?: IComboBoxOption,
    ): void => {
        if (option) {
            setExpenseCategoryId(option.key.toString());
            setValidation({ ...validation, isValidExpenseCategoryId: true });
        }
    };

    const _onChangeDescription = (
        newValue?: string,
    ) => {
        setExpenseDescription(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidDescription: newValue.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidDescription: false });
        }
    };

    const _onChangeAmount = (newValue?: string) => {
        setExpenseAmountString(newValue);
        if (newValue) {
            const newAmount = Number.parseFloat(newValue);
            setValidation({ ...validation, isValidAmount: !isNaN(newAmount) && newAmount > 0 });
            setExpenseAmount(Number.parseFloat(newValue) || 0);
        } else {
            setValidation({ ...validation, isValidAmount: false });
            setExpenseAmount(0);
        }
    };

    const _onChangeTransactionDate = (date: Date | null | undefined) => {
        date ? setExpenseTransactionDate(date) : new Date();
    };

    const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files !== null) {
            const data = new FormData();
            data.append('file', event.target.files[0]);
            setExpenseFile(data);
        }
    };

    const _onChangeCurrency = (
        option?: IComboBoxOption,
    ): void => {
        if (option) {
            setExpenseCurrencyId(option.key.toString());
        }
    };

    const _onChangePaymentMethod = (
        option?: IComboBoxOption,
    ): void => {
        if (option) {
            setExpensePaymentMethodId(option.key.toString());
        }
    };

    const _onKeyPressAmount = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // Check that key is number
        if ((event.key < '0' || event.key > '9') && event.key !== '.') {
            event.preventDefault();
        }
        // String can includes only one dot
        if (event.key === '.' && expenseAmountString?.includes('.')) {
            event.preventDefault();
        }
        // Check amount size
        if (expenseAmount >= 10000000) {
            event.preventDefault();
        }
    };

    const isValidForm =
        validation.isValidExpenseCategoryId &&
        validation.isValidDescription &&
        validation.isValidAmount &&
        validation.isValidDocument;

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
                    label="Категория"
                    options={ExpenseCategoryOptions}
                    onChange={_onChangeCategory}
                    selectedKey={expenseCategoryId}
                    errorMessage={validation?.isValidExpenseCategoryId ? undefined : requiredMessage}
                />
                <TextField
                    required
                    label="Описание"
                    multiline
                    value={expenseDescription}
                    onChange={_onChangeDescription}
                    errorMessage={validation?.isValidDescription ? undefined : requiredMessage}
                />
                <DatePicker
                    label="Дата совершения"
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date.toLocaleDateString()}
                    value={expenseTransactionDate}
                    onSelectDate={_onChangeTransactionDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    strings={DAY_PICKER_STRINGS}
                />
                <TextField
                    required
                    label="Сумма"
                    value={expenseAmountString}
                    onChange={_onChangeAmount}
                    onKeyPress={_onKeyPressAmount}
                    errorMessage={validation?.isValidAmount ? undefined : requiredMessage}
                />
                <ComboBox
                    label="Валюта"
                    options={CurrencyOptions}
                    selectedKey={expenseCurrencyId}
                    onChange={_onChangeCurrency}
                />
                <ComboBox
                    label="Способ оплаты"
                    options={PaymentMethodOptions}
                    selectedKey={expensePaymentMethodId}
                    onChange={_onChangePaymentMethod}
                />
                <Label>Документ</Label>
                <input type="file" onChange={onChangeFile} accept="image/*, application/pdf" />
            </Stack>
        </EditDialog>
    );
};

export default ExpenseEditComponent;
