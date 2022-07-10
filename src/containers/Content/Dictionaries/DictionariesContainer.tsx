import React, { FC, useEffect } from 'react';

import { connect } from 'react-redux';
import { IDictionariesProps, mapStateToProps, mapDispatchToProps } from './IDictionariesProps';
import { zeroGuid } from 'src/shared/Constants';

import EventLogCategoriesComponent from 'src/components/Dictionaries/EventLogCategoriesComponent';
import ExpenseCategoriesComponent from 'src/components/Dictionaries/ExpenseCategoriesComponent';
import TaskCategoriesComponent from 'src/components/Dictionaries/TaskCategoriesComponent';

const DictionariesContainer: FC<IDictionariesProps> = (props: IDictionariesProps) => {
    useEffect(() => {
        if (props.needToUpdateEventLogCategories) props.getEventLogCategories();
    }, [props.getEventLogCategories, props.needToUpdateEventLogCategories]);

    useEffect(() => {
        if (props.needToUpdateExpenseCategories) props.getExpenseCategories();
    }, [props.getExpenseCategories, props.needToUpdateExpenseCategories]);

    useEffect(() => {
        if (props.needToUpdateTaskCategories) props.getTaskCategories();
    }, [props.getTaskCategories, props.needToUpdateTaskCategories]);

    const eventLogCategoryId = props.currentEventLogCategory ? props.currentEventLogCategory.id : zeroGuid;
    const expenseCategoryId = props.currentExpenseCategory ? props.currentExpenseCategory.id : zeroGuid;
    const taskCategoryId = props.currentTaskCategory ? props.currentTaskCategory.id : zeroGuid;

    return (
        <>
            {/* EventLogCategories */}
            <EventLogCategoriesComponent
                showContent={
                    props.expenseCategories !== null &&
                    props.eventLogCategories !== null &&
                    props.taskCategories !== null
                }
                eventLogCategoryId={eventLogCategoryId}
                eventLogCategories={props.eventLogCategories}
                currentEventLogCategory={props.currentEventLogCategory}
                eventLogCategoriesPosting={props.eventLogCategoriesPosting}
                eventLogCategoriesLoading={props.eventLogCategoriesLoading}
                isEventLogCategoryAdding={props.isEventLogCategoryAdding}
                isEventLogCategoryEditing={props.isEventLogCategoryEditing}
                isEventLogCategoryDeleting={props.isEventLogCategoryDeleting}
                addingEventLogCategory={props.addingEventLogCategory}
                clearEventLogCategory={props.clearEventLogCategory}
                editingEventLogCategory={props.editingEventLogCategory}
                deletingEventLogCategory={props.deletingEventLogCategory}
                deleteEventLogCategory={props.deleteEventLogCategory}
                saveEventLogCategory={
                    props.isEventLogCategoryAdding ? props.postEventLogCategory : props.putEventLogCategory
                }
            />

            {/* ExpenseCategories */}
            <ExpenseCategoriesComponent
                showContent={
                    props.expenseCategories !== null &&
                    props.eventLogCategories !== null &&
                    props.taskCategories !== null
                }
                expenseCategoryId={expenseCategoryId}
                expenseCategories={props.expenseCategories}
                currentExpenseCategory={props.currentExpenseCategory}
                expenseCategoriesPosting={props.expenseCategoriesPosting}
                expenseCategoriesLoading={props.expenseCategoriesLoading}
                isExpenseCategoryAdding={props.isExpenseCategoryAdding}
                isExpenseCategoryEditing={props.isExpenseCategoryEditing}
                isExpenseCategoryDeleting={props.isExpenseCategoryDeleting}
                addingExpenseCategory={props.addingExpenseCategory}
                clearExpenseCategory={props.clearExpenseCategory}
                editingExpenseCategory={props.editingExpenseCategory}
                deletingExpenseCategory={props.deletingExpenseCategory}
                deleteExpenseCategory={props.deleteExpenseCategory}
                saveExpenseCategory={
                    props.isExpenseCategoryAdding ? props.postExpenseCategory : props.putExpenseCategory
                }
            />

            {/* Task Categories */}
            <TaskCategoriesComponent
                showContent={
                    props.expenseCategories !== null &&
                    props.eventLogCategories !== null &&
                    props.taskCategories !== null
                }
                taskCategoryId={taskCategoryId}
                taskCategories={props.taskCategories}
                currentTaskCategory={props.currentTaskCategory}
                taskCategoriesPosting={props.taskCategoriesPosting}
                taskCategoriesLoading={props.taskCategoriesLoading}
                isTaskCategoryAdding={props.isTaskCategoryAdding}
                isTaskCategoryEditing={props.isTaskCategoryEditing}
                isTaskCategoryDeleting={props.isTaskCategoryDeleting}
                addingTaskCategory={props.addingTaskCategory}
                clearTaskCategory={props.clearTaskCategory}
                editingTaskCategory={props.editingTaskCategory}
                deletingTaskCategory={props.deletingTaskCategory}
                deleteTaskCategory={props.deleteTaskCategory}
                saveTaskCategory={props.isTaskCategoryAdding ? props.postTaskCategory : props.putTaskCategory}
            />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(DictionariesContainer);
