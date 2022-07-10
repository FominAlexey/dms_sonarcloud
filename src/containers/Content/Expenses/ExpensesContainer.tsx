import React, { FC, useEffect } from 'react';

import { PrimaryButton, Label, Spinner } from '@fluentui/react';

import ExpensesListComponent from 'src/components/Expenses/ExpensesListComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import ExpenseEditComponent from 'src/components/Expenses/ExpenseEditComponent';
import DeleteDialog from 'src/components/DeleteDialog';
import SelectPeriodComponent from 'src/components/Reports/SelectPeriodComponent';

import { getEndOfMonth, getStartOfMonth } from 'src/shared/DateUtils';

import { connect } from 'react-redux';

import { IExpensesProps, mapStateToProps, mapDispatchToProps } from './IExpensesProps';
import { zeroGuid } from 'src/shared/Constants';

const ExpensesContainer: FC<IExpensesProps> = (props: IExpensesProps) => {
    useEffect(() => {
        const fromDate = props.searchProps.fromDate || getStartOfMonth(new Date());
        const toDate = props.searchProps.toDate || getEndOfMonth(new Date());
        props.getExpenses({ employeeId: props.userId, status: null, fromDate, toDate });
    }, [props.getExpenses, props.userId, props.searchProps, props.needToUpdateExpenses]);

    useEffect(() => {
        if (props.isEditing || props.isAdding) {
            props.getExpenseCategories();
        }
    }, [props.getExpenseCategories, props.isEditing, props.isAdding]);

    const expenseId = props.currentExpense ? props.currentExpense.id : zeroGuid;

    return (
        <ContentContainer title="Расходы" showContent={props.expenses !== null}>
            <SelectPeriodComponent
                fromDate={props.searchProps.fromDate || getStartOfMonth(new Date())}
                toDate={props.searchProps.toDate || getEndOfMonth(new Date())}
            />

            <div className="mt-20 h-space-between">
                <PrimaryButton text="Добавить статью расходов" onClick={() => props.addingExpense()} />
                {props.isLoadingDocument && <Spinner label="Скачивание..." labelPosition="right" />}
            </div>

            <ExpensesListComponent
                data={props.expenses || []}
                editingExpense={props.editingExpense}
                isLoading={props.expensesLoading}
                deletingExpense={props.deletingExpense}
                saveFile={props.saveFile}
            />

            {!props.expensesLoading && props.expenses?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {(props.isAdding || props.isEditing) && props.currentExpense && (
                <ExpenseEditComponent
                    userId={props.userId}
                    expense={props.currentExpense}
                    saveExpense={props.isAdding ? props.postExpense : props.putExpense}
                    clearExpense={props.clearExpense}
                    expenseCategories={props.expenseCategories || []}
                    posting={props.posting}
                />
            )}

            {props.isDeleting && props.currentExpense && (
                <DeleteDialog
                    hidden={!props.isDeleting}
                    deleteMethod={() => props.deleteExpense(expenseId)}
                    closeMethod={() => props.clearExpense()}
                />
            )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesContainer);
