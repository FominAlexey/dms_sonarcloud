import { Expense } from 'src/DAL/Expenses';

import {
    clearExpense,
    getExpensesAsyncThunk,
    patchExpenseAsyncThunk,
    deleteExpenseAsyncThunk,
    deletingExpenseAsyncThunk,
    saveDocumentAsyncThunk,
    ExpensesInfoType,
    PatchExpenseInfoType,
    DocumentInfoType,
} from 'src/store/slice/expensesSlice';

import {
    getEventLogsAsyncThunk,
    patchEventLogAsyncThunk,
    clearEventLog,
    deleteEventLogAsyncThunk,
    deletingEvenLogAsyncThunk,
    EventLogsInfoType,
    PatchEventLogInfoType,
} from 'src/store/slice/calendarSlice';
import { AppState } from 'src/store/slice';
import { ActionAsyncThunk } from 'src/shared/Common';
import { EventLogConfirmationsProps } from 'src/components/Confirmations/EventLogConfirmationsComponent';
import { EventLog } from 'src/DAL/Calendar';
import { ExpenseConfirmationsProps } from 'src/components/Confirmations/ExpenseConfirmationsComponent';

export interface IConfirmationsProps extends ExpenseConfirmationsProps, EventLogConfirmationsProps {
    getExpenses: (expensesArg: ExpensesInfoType) => ActionAsyncThunk<Expense[], ExpensesInfoType>;
    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => ActionAsyncThunk<EventLog[], EventLogsInfoType>;

    needToUpdateEventLogs: boolean;
    needToUpdateExpenses: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        expenses: store.expenses.expenses,
        expensesLoading: store.expenses.loading,
        isDeletingExpense: store.expenses.isDeleting,
        currentExpense: store.expenses.current,

        eventLogs: store.eventLogs.eventLogs,
        eventLogsLoading: store.eventLogs.loading,
        isDeletingEventLog: store.eventLogs.isDeleting,
        currentEventLog: store.eventLogs.current,

        needToUpdateEventLogs: store.eventLogs.needToUpdate,
        needToUpdateExpenses: store.expenses.needToUpdate,
    };
};

export const mapDispatchToProps = {
    getExpenses: (expensesArg: ExpensesInfoType) => getExpensesAsyncThunk(expensesArg),
    patchExpense: (patchExpenseArg: PatchExpenseInfoType) => patchExpenseAsyncThunk(patchExpenseArg),
    clearExpense: () => clearExpense(),
    deleteExpense: (id: string) => deleteExpenseAsyncThunk(id),
    deletingExpense: (id: string) => deletingExpenseAsyncThunk(id),
    saveFile: (documentInfoArg: DocumentInfoType) => saveDocumentAsyncThunk(documentInfoArg),

    getEventLogs: (eventLogsInfoArg: EventLogsInfoType) => getEventLogsAsyncThunk(eventLogsInfoArg),
    patchEventLog: (patchEventLogInfoArg: PatchEventLogInfoType) => patchEventLogAsyncThunk(patchEventLogInfoArg),
    clearEventLog: () => clearEventLog(),
    deleteEventLog: (id: string) => deleteEventLogAsyncThunk(id),
    deletingEventLog: (id: string) => deletingEvenLogAsyncThunk(id),
};
