import React, { FC, useEffect, useState } from 'react';
import { Expense } from 'src/DAL/Expenses';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, Label } from '@fluentui/react';
import { IExpenseItem, getExpenseItems } from 'src/shared/ExpensesUtils';
import { DocumentInfoType } from 'src/store/slice/expensesSlice';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    expenses: Expense[];
    isLoading: boolean;
    saveFile: (documentInfoArg: DocumentInfoType) => ActionAsyncThunk<boolean, DocumentInfoType>;
}

const ExpensesReportComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IExpenseItem[]>([]);

    useEffect(() => {
        setItems(getExpenseItems(props.expenses, props.saveFile));
    }, [props.expenses, props.saveFile]);

    const colunms: IColumn[] = [
        {
            key: 'expensesReport_transactionDate',
            name: 'Дата',
            fieldName: 'transactionDate',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'expensesReport_description',
            name: 'Описание',
            fieldName: 'description',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expensesReport_amount',
            name: 'Сумма',
            fieldName: 'amount',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'expensesReport_category',
            name: 'Категория',
            fieldName: 'category',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expensesReport_document',
            name: 'Документ',
            fieldName: 'document',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
    ];

    // Get summary by currency
    const rubSum = props.expenses
        .filter(exp => exp.currency === 'RUB')
        .reduce((prev, current) => prev + current.amount, 0);
    const usdSum = props.expenses
        .filter(exp => exp.currency === 'USD')
        .reduce((prev, current) => prev + current.amount, 0);
    const eurSum = props.expenses
        .filter(exp => exp.currency === 'EUR')
        .reduce((prev, current) => prev + current.amount, 0);

    return props.expenses.length !== 0 ? (
        <div>
            <ShimmeredDetailsList columns={colunms} items={items} selectionMode={0} enableShimmer={props.isLoading} />
            <Label>Итого:</Label>
            <div>
                {rubSum !== 0 && <div>{rubSum.toFixed(2)} RUB</div>}
                {usdSum !== 0 && <div>{usdSum.toFixed(2)} USD</div>}
                {eurSum !== 0 && <div>{eurSum.toFixed(2)} EUR</div>}
            </div>
        </div>
    ) : (
        <Label>Итого: нет расходов</Label>
    );
};

export default ExpensesReportComponent;
