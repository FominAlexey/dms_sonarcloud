import { AppState } from 'src/store/slice';
import { ErrorObject } from 'src/shared/Common';
import { clearErrorAssets } from 'src/store/slice/assetsSlice';
import { clearErrorCalendar } from 'src/store/slice/calendarSlice';
import { clearErrorEmployees } from 'src/store/slice/employeesSlice';
import { clearErrorExpenses } from 'src/store/slice/expensesSlice';
import { clearErrorFeedback } from 'src/store/slice/feedbackSlice';
import { clearErrorProductionCalendar } from 'src/store/slice/productionCalendarSlice';
import { clearErrorProjects } from 'src/store/slice/projectsSlice';
import { clearErrorTimeTrackings } from 'src/store/slice/timeTrackingsSlice';
import { clearErrorWorkTasks } from 'src/store/slice/workTasksSlice';
import { clearErrorExpenseCategories } from 'src/store/slice/expenseCategoriesSlice';
import { clearErrorEventLogCategories } from 'src/store/slice/eventLogCategoriesSlice';
import { clearErrorTaskCategories } from 'src/store/slice/tasksCategoriesSlice';

export interface IContentProps {
    title?: string;
    showContent?: boolean;
    children: React.ReactNode;

    errAssets: ErrorObject | null;
    errCalendar: ErrorObject | null;
    errEmployees: ErrorObject | null;
    errEventLogCategories: ErrorObject | null;
    errExpenseCategories: ErrorObject | null;
    errExpenses: ErrorObject | null;
    errFeedback: ErrorObject | null;
    errProductionCalendar: ErrorObject | null;
    errProjects: ErrorObject | null;
    errTimeTrackings: ErrorObject | null;
    errWorkTasks: ErrorObject | null;
    errTaskCategories: ErrorObject | null;

    clearErrAssets: () => void;
    clearErrCalendar: () => void;
    clearErrEmployees: () => void;
    clearErrExpenseCategories: () => void;
    clearErrorEventLogCategory: () => void;
    clearErrExpenses: () => void;
    clearErrFeedback: () => void;
    clearErrProductionCalendar: () => void;
    clearErrProjects: () => void;
    clearErrTimeTrackings: () => void;
    clearErrWorkTasks: () => void;
    clearErrTaskCategories: () => void;
}

export const mapStateToProps = (store: AppState) => {
    return {
        errAssets: store.assets.error,
        errCalendar: store.eventLogs.error,
        errEmployees: store.employees.error,
        errEventLogCategories: store.eventLogCategories.error,
        errExpenseCategories: store.expenseCategories.error,
        errExpenses: store.expenses.error,
        errFeedback: store.feedback.error,
        errProductionCalendar: store.productionCalendar.error,
        errProjects: store.projects.error,
        errTimeTrackings: store.timeTrackings.error,
        errWorkTasks: store.workTasks.error,
        errTaskCategories: store.taskCategories.error,
    };
};

export const mapDispatchToProps = {
    clearErrAssets: () => clearErrorAssets(),
    clearErrCalendar: () => clearErrorCalendar(),
    clearErrEmployees: () => clearErrorEmployees(),
    clearErrExpenseCategories: () => clearErrorExpenseCategories(),
    clearErrorEventLogCategory: () => clearErrorEventLogCategories(),
    clearErrExpenses: () => clearErrorExpenses(),
    clearErrFeedback: () => clearErrorFeedback(),
    clearErrProductionCalendar: () => clearErrorProductionCalendar(),
    clearErrProjects: () => clearErrorProjects(),
    clearErrTimeTrackings: () => clearErrorTimeTrackings(),
    clearErrWorkTasks: () => clearErrorWorkTasks(),
    clearErrTaskCategories: () => clearErrorTaskCategories(),
};
