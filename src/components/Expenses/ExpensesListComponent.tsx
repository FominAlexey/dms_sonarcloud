import React, { FC, useState, useEffect } from 'react';
import { Expense, ExpenseEdit } from 'src/DAL/Expenses';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn } from '@fluentui/react';
import { IEditableExpenseItem, getEditableExpenseItems } from 'src/shared/ExpensesUtils';
import { ActionAsyncThunk } from 'src/shared/Common';
import { DocumentInfoType } from 'src/store/slice/expensesSlice';

interface Props {
    data: Expense[];
    isLoading: boolean;
    editingExpense: (id: string) => ActionAsyncThunk<ExpenseEdit, string>;
    deletingExpense: (id: string) => ActionAsyncThunk<ExpenseEdit, string>;
    saveFile: (documentInfoArg: DocumentInfoType) => ActionAsyncThunk<boolean, DocumentInfoType>;
}

const ExpensesListComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IEditableExpenseItem[]>([]);

    useEffect(() => {
        setItems(getEditableExpenseItems(props.data, props.saveFile, props.editingExpense, props.deletingExpense));
    }, [props.data, props.editingExpense, props.deletingExpense, props.saveFile]);

    const colunms: IColumn[] = [
        {
            key: 'expense_transactionDate',
            name: 'Дата',
            fieldName: 'transactionDate',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'expense_amount',
            name: 'Сумма',
            fieldName: 'amount',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'expense_category',
            name: 'Категория',
            fieldName: 'category',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expense_description',
            name: 'Описание',
            fieldName: 'description',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expense_document',
            name: 'Документ',
            fieldName: 'document',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expense_status',
            name: 'Статус',
            fieldName: 'status',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'expense_paymentDate',
            name: 'Дата оплаты',
            fieldName: 'paymentDate',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'expense_editButtons',
            name: '',
            fieldName: 'editBtns',
            minWidth: 50,
            maxWidth: 50,
        },
    ];

    return (
        <ShimmeredDetailsList
            columns={colunms}
            items={items}
            selectionMode={0}
            enableShimmer={props.isLoading}
            isHeaderVisible={items.length !== 0}
        />
    );
};

export default ExpensesListComponent;
