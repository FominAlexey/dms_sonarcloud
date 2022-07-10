import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton } from '@fluentui/react';
import { Expense, ExpenseEdit } from 'src/DAL/Expenses';
import { CREATED, APPROVED, REJECTED } from 'src/shared/Constants';
import { PatchExpenseInfoType, DocumentInfoType } from 'src/store/slice/expensesSlice';
import { ActionAsyncThunk } from 'src/shared/Common';

import 'src/styles/expenseConfirmationsListStyles.css';

interface Props {
    data: Expense[];
    isLoading: boolean;
    patchExpense: (patchExpenseArg: PatchExpenseInfoType) => ActionAsyncThunk<boolean, PatchExpenseInfoType>;
    deletingExpense: (id: string) => ActionAsyncThunk<ExpenseEdit, string>;
    saveFile: (documentInfoArg: DocumentInfoType) => ActionAsyncThunk<boolean, DocumentInfoType>;
}

interface IExpenseConfirmationItem {
    key: string;
    employee: string;
    category: string;
    document: JSX.Element | undefined;
    description: string;
    amount: string;
    transactionDate: string;
    paymentMethod: string;
    confirmBtns: JSX.Element;
}

const ExpenseConfirmationsListComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IExpenseConfirmationItem[]>([]);

    useEffect(() => {
        setItems(getExpenseConfirmationItems(props.data, props.saveFile, props.patchExpense, props.deletingExpense));
    }, [props.data, props.saveFile, props.patchExpense, props.deletingExpense]);

    const columns: IColumn[] = [
        {
            key: 'expenseConfirmation_employee',
            name: 'Сотрудник',
            fieldName: 'employee',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expenseConfirmation_category',
            name: 'Категория',
            fieldName: 'category',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expenseConfirmation_document',
            name: 'Документ',
            fieldName: 'document',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'expenseConfirmation_description',
            name: 'Описание',
            fieldName: 'description',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expenseConfirmation_amount',
            name: 'Сумма',
            fieldName: 'amount',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'expenseConfirmation_transactionDate',
            name: 'Дата',
            fieldName: 'transactionDate',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'expenseConfirmation_paymentMethod',
            name: 'Способ',
            fieldName: 'paymentMethod',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'expenseConfirmation_confirmBtns',
            name: '',
            fieldName: 'confirmBtns',
            minWidth: 100,
            maxWidth: 100,
        },
    ];

    return (
        <ShimmeredDetailsList
            columns={columns}
            items={items}
            selectionMode={0}
            enableShimmer={props.isLoading}
            shimmerLines={5}
            isHeaderVisible={items.length !== 0}
        />
    );
};

const getExpenseConfirmationItems = (
    _expenses: Expense[],
    saveFile: (documentInfoArg: DocumentInfoType) => void,
    patchExpense: (patchExpenseArg: PatchExpenseInfoType) => void,
    deletingExpense: (id: string) => void,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IExpenseConfirmationItem[] => {
    const _items = _expenses
        .map(item => {
            return {
                key: item.id,
                employee: item.employeeName,
                category: item.expenseCategory,
                document:
                    item.documentId && item.documentName ? (
                        <span
                            title="Сохранить документ"
                            onClick={() => {
                                saveFile({ id: item.documentId!, fileName: item.documentName! });
                            }}
                            className="document-name"
                        >
                            {item.documentName}
                        </span>
                    ) : undefined,
                description: item.description,
                amount: `${item.amount.toFixed(2)} ${item.currency}`,
                transactionDate: item.transactionDate.toLocaleDateString(),
                paymentMethod: item.paymentMethod,
                confirmBtns: (
                    <div className="h-end">
                        {item.approvalStatusId === CREATED && (
                            <div>
                                <IconButton
                                    title="Подтвердить"
                                    iconProps={{ iconName: 'Accept' }}
                                    onClick={() => patchExpense({ id: item.id, status: APPROVED })}
                                />
                                <IconButton
                                    title="Отклонить"
                                    iconProps={{ iconName: 'Cancel', className: 'red' }}
                                    onClick={() => patchExpense({ id: item.id, status: REJECTED })}
                                />
                                <IconButton
                                    title="Удалить"
                                    iconProps={{ iconName: 'Delete', className: 'red' }}
                                    onClick={() => deletingExpense(item.id)}
                                />
                            </div>
                        )}
                    </div>
                ),
            };
        })
        .sort((a, b) => collator.compare(a.employee, b.employee));
    return _items;
};

export default ExpenseConfirmationsListComponent;
