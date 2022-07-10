import React from 'react';
import { Expense } from 'src/DAL/Expenses';
import { IconButton } from '@fluentui/react';
import { CREATED } from 'src/shared/Constants';
import { DocumentInfoType } from 'src/store/slice/expensesSlice';

export interface IExpenseItem {
    key: string;
    fullName: string;
    transactionDate: string;
    paymentDate: string | undefined;
    amount: string;
    category: string;
    description: string;
    document: JSX.Element | undefined;
    status: string;
}

export interface IEditableExpenseItem extends IExpenseItem {
    editBtns: JSX.Element;
}

export const getExpenseItems = (
    _expenses: Expense[],
    saveFile: (documentInfoArg: DocumentInfoType) => void,
): IExpenseItem[] => {
    const _items = _expenses.map(item => {
        return {
            key: item.id,
            fullName: item.employeeName,
            transactionDate: item.transactionDate.toLocaleDateString(),
            paymentDate: item.paymentDate?.toLocaleDateString(),
            amount: `${item.amount.toFixed(2)} ${item.currency}`,
            category: item.expenseCategory,
            description: item.description,
            document:
                item.documentId && item.documentName ? (
                    <span
                        title="Сохранить документ"
                        onClick={() => {
                            saveFile({ id: item.documentId!, fileName: item.documentName! });
                        }}
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {item.documentName}
                    </span>
                ) : undefined,
            status: item.approvalStatus,
        };
    });

    return _items;
};

export const getEditableExpenseItems = (
    _expenses: Expense[],
    saveFile: (documentInfoArg: DocumentInfoType) => void,
    editingExpense: (id: string) => void,
    deletingExpense: (id: string) => void,
): IEditableExpenseItem[] => {
    const _items = getExpenseItems(_expenses, saveFile);
    const _editableItems: IEditableExpenseItem[] = [];

    for (let i = 0; i < _expenses.length; i++) {
        const editBtns = (
            <div className="h-end">
                {_expenses[i].approvalStatusId === CREATED && (
                    <div>
                        <IconButton
                            title="Изменить"
                            iconProps={{ iconName: 'Edit' }}
                            onClick={() => {
                                editingExpense(_expenses[i].id);
                            }}
                        />
                        <IconButton
                            title="Удалить"
                            iconProps={{ iconName: 'Delete', className: 'red' }}
                            onClick={() => {
                                deletingExpense(_expenses[i].id);
                            }}
                        />
                    </div>
                )}
            </div>
        );
        _editableItems.push({ ..._items[i], editBtns: editBtns });
    }

    return _editableItems;
};
