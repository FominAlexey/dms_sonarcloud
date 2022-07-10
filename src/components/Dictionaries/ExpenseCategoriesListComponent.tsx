import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton, Icon } from '@fluentui/react';
import { ExpenseCategory } from 'src/DAL/Dictionaries';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    data: ExpenseCategory[];
    isLoading: boolean;
    editingExpenseCategory: (id: string) => ActionAsyncThunk<ExpenseCategory, string>;
    deletingExpenseCategory: (id: string) => ActionAsyncThunk<ExpenseCategory, string>;
}

interface IExpenseCategoryItem {
    key: string;
    title: string | undefined;
    color: JSX.Element;
    editBtns: JSX.Element;
}

const ExpenseCategoriesListComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IExpenseCategoryItem[]>([]);

    useEffect(() => {
        setItems(getExpenseCategoryItems(props.data, props.editingExpenseCategory, props.deletingExpenseCategory));
    }, [props.data, props.editingExpenseCategory, props.deletingExpenseCategory]);

    const columns: IColumn[] = [
        {
            key: 'expenseCategory_title',
            name: 'Название',
            fieldName: 'title',
            minWidth: 100,
            maxWidth: 300,
        },
        {
            key: 'expenseCategory_color',
            name: 'Цвет',
            fieldName: 'color',
            minWidth: 100,
            maxWidth: 300,
        },
        {
            key: 'expenseCategory_editButtons',
            name: '',
            fieldName: 'editBtns',
            minWidth: 50,
            maxWidth: 50,
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

const getExpenseCategoryItems = (
    _expenseCategories: ExpenseCategory[],
    editingExpenseCategory: (id: string) => void,
    deletingExpenseCategory: (id: string) => void,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IExpenseCategoryItem[] => {
    const _items = _expenseCategories
        .map(item => {
            return {
                key: item.id,
                title: item.title ? item.title : '',
                color: (
                    <div className="mr-30 h-start">
                        <Icon iconName="CircleFill" style={{ color: item.color }} className="mr-5" />
                        <span>{item.color}</span>
                    </div>
                ),
                editBtns: (
                    <div className="h-end">
                        <IconButton
                            title="Изменить"
                            iconProps={{ iconName: 'Edit' }}
                            onClick={() => editingExpenseCategory(item.id)}
                        />
                        <IconButton
                            title="Удалить"
                            iconProps={{ iconName: 'Delete', className: 'red' }}
                            onClick={() => {
                                deletingExpenseCategory(item.id);
                            }}
                        />
                    </div>
                ),
            };
        })
        .sort((a, b) => collator.compare(a.title, b.title));
    return _items;
};

export default ExpenseCategoriesListComponent;
