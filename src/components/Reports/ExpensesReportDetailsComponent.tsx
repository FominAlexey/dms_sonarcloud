import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, Label } from '@fluentui/react';
import { Expense } from 'src/DAL/Expenses';
import { IExpenseItem, getExpenseItems } from 'src/shared/ExpensesUtils';
import { DocumentInfoType } from 'src/store/slice/expensesSlice';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    expenses: Expense[];
    isLoading: boolean;
    saveFile: (documentInfoArg: DocumentInfoType) => ActionAsyncThunk<boolean, DocumentInfoType>;
}

const ExpensesReportDetailsComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IExpenseItem[]>([]);

    useEffect(() => {
        setItems(getExpenseItems(props.expenses, props.saveFile));
    }, [props.expenses, props.saveFile]);

    // Create columns
    const columns: IColumn[] = [
        {
            key: 'expensesReportDetails_employee',
            name: 'Сотрудник',
            fieldName: 'fullName',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expensesReportDetails_transactionDate',
            name: 'Дата',
            fieldName: 'transactionDate',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'expensesReportDetails_description',
            name: 'Описание',
            fieldName: 'description',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expensesReportDetails_amount',
            name: 'Сумма',
            fieldName: 'amount',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'expensesReportDetails_category',
            name: 'Категория',
            fieldName: 'category',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expensesReportDetails_document',
            name: 'Документ',
            fieldName: 'document',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
    ];

    return (
        <div>
            <ShimmeredDetailsList columns={columns} items={items} selectionMode={0} enableShimmer={props.isLoading} />
            <Label>Итого: {getSummaryExpenses(props.expenses)}</Label>
        </div>
    );
};

// Get summary expenses by currencies
const getSummaryExpenses = (_expenses: Expense[]) => {
    const rubSum = _expenses.filter(exp => exp.currency === 'RUB').reduce((prev, current) => prev + current.amount, 0);
    const usdSum = _expenses.filter(exp => exp.currency === 'USD').reduce((prev, current) => prev + current.amount, 0);
    const eurSum = _expenses.filter(exp => exp.currency === 'EUR').reduce((prev, current) => prev + current.amount, 0);

    return (
        <div>
            {rubSum !== 0 && <div>{rubSum.toFixed(2)} RUB</div>}
            {usdSum !== 0 && <div>{usdSum.toFixed(2)} USD</div>}
            {eurSum !== 0 && <div>{eurSum.toFixed(2)} EUR</div>}
        </div>
    );
};

export default ExpensesReportDetailsComponent;
