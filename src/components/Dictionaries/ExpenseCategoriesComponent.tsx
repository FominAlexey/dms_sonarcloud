import React, { FC } from 'react';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import { PrimaryButton, Label } from '@fluentui/react';
import ExpenseCategoryEditComponent from './ExpenseCategoryEditComponent';
import ExpensesCategoriesListComponent from './ExpenseCategoriesListComponent';
import DeleteDialog from 'src/components/DeleteDialog';
import { ExpenseCategory } from 'src/DAL/Dictionaries';
import { ActionAsyncThunk } from 'src/shared/Common';

interface BaseProps {
    showContent: boolean;
    expenseCategoryId: string;
    saveExpenseCategory: (expenseCategory: ExpenseCategory) => ActionAsyncThunk<boolean, ExpenseCategory>;
}

export interface ExpenseCategoriesProps extends BaseProps {
    expenseCategories: ExpenseCategory[] | null;
    currentExpenseCategory: ExpenseCategory | null;

    expenseCategoriesPosting: boolean;
    expenseCategoriesLoading: boolean;
    isExpenseCategoryAdding: boolean;
    isExpenseCategoryEditing: boolean;
    isExpenseCategoryDeleting: boolean;

    addingExpenseCategory: () => void;
    clearExpenseCategory: () => void;

    editingExpenseCategory: (id: string) => ActionAsyncThunk<ExpenseCategory, string>;
    deletingExpenseCategory: (id: string) => ActionAsyncThunk<ExpenseCategory, string>;
    deleteExpenseCategory: (id: string) => ActionAsyncThunk<boolean, string>;
}

const ExpenseCategoriesComponent: FC<ExpenseCategoriesProps> = (props: ExpenseCategoriesProps) => {
    return (
        <ContentContainer title="Категории расходов" showContent={props.showContent}>
            <PrimaryButton text="Добавить" onClick={() => props.addingExpenseCategory()} className="mt-20" />

            <ExpensesCategoriesListComponent
                data={props.expenseCategories || []}
                editingExpenseCategory={props.editingExpenseCategory}
                isLoading={props.expenseCategoriesLoading}
                deletingExpenseCategory={props.deletingExpenseCategory}
            />

            {!props.expenseCategoriesLoading && props.expenseCategories?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {(props.isExpenseCategoryAdding || props.isExpenseCategoryEditing) && props.currentExpenseCategory && (
                <ExpenseCategoryEditComponent
                    expenseCategory={props.currentExpenseCategory}
                    saveExpenseCategory={props.saveExpenseCategory}
                    //saveExpenseCategory={props.isExpenseCategoryAdding ? props.postExpenseCategory : props.putExpenseCategory}
                    clearExpenseCategory={props.clearExpenseCategory}
                    posting={props.expenseCategoriesPosting}
                />
            )}

            {props.isExpenseCategoryDeleting && props.currentExpenseCategory && (
                <DeleteDialog
                    hidden={!props.isExpenseCategoryDeleting}
                    deleteMethod={() => props.deleteExpenseCategory(props.expenseCategoryId)}
                    closeMethod={() => props.clearExpenseCategory()}
                />
            )}
        </ContentContainer>
    );
};

export default ExpenseCategoriesComponent;
