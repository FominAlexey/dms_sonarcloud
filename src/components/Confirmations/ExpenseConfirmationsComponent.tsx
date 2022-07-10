import React, { FC } from 'react';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import ExpenseConfirmationsListComponent from './ExpenseConfirmationsListComponent';
import { Label } from '@fluentui/react';
import DeleteDialog from 'src/components/DeleteDialog';
import { ActionAsyncThunk } from 'src/shared/Common';
import { ExpenseEdit, Expense } from 'src/DAL/Expenses';
import { PatchExpenseInfoType, DocumentInfoType } from 'src/store/slice/expensesSlice';

interface BaseProps {
    expenseId: string;
}

export interface ExpenseConfirmationsProps extends BaseProps {
    expenses: Expense[] | null;
    expensesLoading: boolean;
    isDeletingExpense: boolean;
    currentExpense: ExpenseEdit | null;

    patchExpense: (patchExpenseArg: PatchExpenseInfoType) => ActionAsyncThunk<boolean, PatchExpenseInfoType>;
    clearExpense: () => void;
    deletingExpense: (id: string) => ActionAsyncThunk<ExpenseEdit, string>;
    deleteExpense: (id: string) => ActionAsyncThunk<boolean, string>;
    saveFile: (documentInfoArg: DocumentInfoType) => ActionAsyncThunk<boolean, DocumentInfoType>;
}

const ExpenseConfirmationsComponent: FC<ExpenseConfirmationsProps> = (props: ExpenseConfirmationsProps) => {
    return (
        <ContentContainer title="Подтверждения расходов" showContent={true}>
            <ExpenseConfirmationsListComponent
                data={props.expenses || []}
                patchExpense={props.patchExpense}
                isLoading={props.expensesLoading}
                deletingExpense={props.deletingExpense}
                saveFile={props.saveFile}
            />

            {!props.expensesLoading && props.expenses?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {props.isDeletingExpense && props.currentExpense && (
                <DeleteDialog
                    hidden={!props.isDeletingExpense}
                    deleteMethod={() => props.deleteExpense(props.expenseId)}
                    closeMethod={() => props.clearExpense()}
                />
            )}
        </ContentContainer>
    );
};

export default ExpenseConfirmationsComponent;
