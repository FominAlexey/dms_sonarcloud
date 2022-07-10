import { EventLogCategory, ExpenseCategory, TaskCategoryEdit, TaskCategory } from 'src/DAL/Dictionaries';

import { AppState } from 'src/store/slice';
import {
    addingEventLogCategory,
    clearEventLogCategory,
    getEventLogCategoriesAsyncThunk,
    editingEventLogCategoryAsyncThunk,
    postEventLogCategoryAsyncThunk,
    putEventLogCategoryAsyncThunk,
    deletingEventLogCategoryAsyncThunk,
    deleteEventLogCategoryAsyncThunk,
} from 'src/store/slice/eventLogCategoriesSlice';

import {
    addingExpenseCategory,
    clearExpenseCategory,
    getExpenseCategoriesAsyncThunk,
    editingExpenseCategoryAsyncThunk,
    postExpenseCategoryAsyncThunk,
    putExpenseCategoryAsyncThunk,
    deletingExpenseCategoryAsyncThunk,
    deleteExpenseCategoryAsyncThunk,
} from 'src/store/slice/expenseCategoriesSlice';
import { ActionAsyncThunk } from 'src/shared/Common';

import {
    addingTaskCategory,
    clearTaskCategory,
    getTaskCategoriesAsyncThunk,
    editingTaskCategoryAsyncThunk,
    postTaskCategoryAsyncThunk,
    putTaskCategoryAsyncThunk,
    deletingTaskCategoryAsyncThunk,
    deleteTaskCategoryAsyncThunk,
} from 'src/store/slice/tasksCategoriesSlice';
import { TaskCategoriesProps } from 'src/components/Dictionaries/TaskCategoriesComponent';
import { ExpenseCategoriesProps } from 'src/components/Dictionaries/ExpenseCategoriesComponent';
import { EventLogCategoriesProps } from 'src/components/Dictionaries/EventLogCategoriesComponent';

export interface IDictionariesProps extends EventLogCategoriesProps, ExpenseCategoriesProps, TaskCategoriesProps {
    getEventLogCategories: () => ActionAsyncThunk<EventLogCategory[], void>;
    postEventLogCategory: (eventLogCategory: EventLogCategory) => ActionAsyncThunk<boolean, EventLogCategory>;
    putEventLogCategory: (eventLogCategory: EventLogCategory) => ActionAsyncThunk<boolean, EventLogCategory>;

    getExpenseCategories: () => ActionAsyncThunk<ExpenseCategory[], void>;
    postExpenseCategory: (expenseCategory: ExpenseCategory) => ActionAsyncThunk<boolean, ExpenseCategory>;
    putExpenseCategory: (expenseCategory: ExpenseCategory) => ActionAsyncThunk<boolean, ExpenseCategory>;

    getTaskCategories: () => ActionAsyncThunk<TaskCategory[], void>;
    postTaskCategory: (taskCategory: TaskCategoryEdit) => ActionAsyncThunk<boolean, TaskCategoryEdit>;
    putTaskCategory: (taskCategory: TaskCategoryEdit) => ActionAsyncThunk<boolean, TaskCategoryEdit>;

    needToUpdateTaskCategories: boolean;
    needToUpdateEventLogCategories: boolean;
    needToUpdateExpenseCategories: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        eventLogCategories: store.eventLogCategories.eventLogCategories,
        eventLogCategoriesLoading: store.eventLogCategories.loading,
        currentEventLogCategory: store.eventLogCategories.current,
        isEventLogCategoryAdding: store.eventLogCategories.isAdding,
        isEventLogCategoryEditing: store.eventLogCategories.isEditing,
        isEventLogCategoryDeleting: store.eventLogCategories.isDeleting,
        eventLogCategoriesPosting: store.eventLogCategories.posting,

        expenseCategories: store.expenseCategories.expenseCategories,
        expenseCategoriesLoading: store.expenseCategories.loading,
        currentExpenseCategory: store.expenseCategories.current,
        isExpenseCategoryAdding: store.expenseCategories.isAdding,
        isExpenseCategoryEditing: store.expenseCategories.isEditing,
        isExpenseCategoryDeleting: store.expenseCategories.isDeleting,
        expenseCategoriesPosting: store.expenseCategories.posting,

        taskCategories: store.taskCategories.taskCategories,
        taskCategoriesLoading: store.taskCategories.loading,
        currentTaskCategory: store.taskCategories.current,
        isTaskCategoryAdding: store.taskCategories.isAdding,
        isTaskCategoryEditing: store.taskCategories.isEditing,
        isTaskCategoryDeleting: store.taskCategories.isDeleting,
        taskCategoriesPosting: store.taskCategories.posting,

        needToUpdateTaskCategories: store.taskCategories.needToUpdate,
        needToUpdateEventLogCategories: store.eventLogCategories.needToUpdate,
        needToUpdateExpenseCategories: store.expenseCategories.needToUpdate,
    };
};

export const mapDispatchToProps = {
    getEventLogCategories: () => getEventLogCategoriesAsyncThunk(),
    addingEventLogCategory: () => addingEventLogCategory(),
    editingEventLogCategory: (id: string) => editingEventLogCategoryAsyncThunk(id),
    postEventLogCategory: (eventLogCategory: EventLogCategory) => postEventLogCategoryAsyncThunk(eventLogCategory),
    putEventLogCategory: (eventLogCategory: EventLogCategory) => putEventLogCategoryAsyncThunk(eventLogCategory),
    clearEventLogCategory: () => clearEventLogCategory(),
    deletingEventLogCategory: (id: string) => deletingEventLogCategoryAsyncThunk(id),
    deleteEventLogCategory: (id: string) => deleteEventLogCategoryAsyncThunk(id),

    getExpenseCategories: () => getExpenseCategoriesAsyncThunk(),
    addingExpenseCategory: () => addingExpenseCategory(),
    editingExpenseCategory: (id: string) => editingExpenseCategoryAsyncThunk(id),
    postExpenseCategory: (expenseCategory: ExpenseCategory) => postExpenseCategoryAsyncThunk(expenseCategory),
    putExpenseCategory: (expenseCategory: ExpenseCategory) => putExpenseCategoryAsyncThunk(expenseCategory),
    clearExpenseCategory: () => clearExpenseCategory(),
    deletingExpenseCategory: (id: string) => deletingExpenseCategoryAsyncThunk(id),
    deleteExpenseCategory: (id: string) => deleteExpenseCategoryAsyncThunk(id),

    addingTaskCategory: () => addingTaskCategory(),
    clearTaskCategory: () => clearTaskCategory(),
    getTaskCategories: () => getTaskCategoriesAsyncThunk(),
    editingTaskCategory: (id: string) => editingTaskCategoryAsyncThunk(id),
    postTaskCategory: (taskCategory: TaskCategoryEdit) => postTaskCategoryAsyncThunk(taskCategory),
    putTaskCategory: (taskCategory: TaskCategoryEdit) => putTaskCategoryAsyncThunk(taskCategory),
    deletingTaskCategory: (id: string) => deletingTaskCategoryAsyncThunk(id),
    deleteTaskCategory: (id: string) => deleteTaskCategoryAsyncThunk(id),
};
