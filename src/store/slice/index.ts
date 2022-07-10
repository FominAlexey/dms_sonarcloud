import { combineReducers } from '@reduxjs/toolkit';

import account from './accountSlice';
import assets from './assetsSlice';
import eventLogs from './calendarSlice';
import employees from './employeesSlice';
import eventLogCategories from './eventLogCategoriesSlice';
import expenseCategories from './expenseCategoriesSlice';
import expenses from './expensesSlice';
import feedback from './feedbackSlice';
import productionCalendar from './productionCalendarSlice';
import projects from './projectsSlice';
import theme from './themeSlice';
import timeTrackings from './timeTrackingsSlice';
import workTasks from './workTasksSlice';
import taskCategories from './tasksCategoriesSlice';

export const rootReducer = combineReducers({
    account,
    assets,
    eventLogs,
    employees,
    eventLogCategories,
    expenseCategories,
    expenses,
    feedback,
    productionCalendar,
    projects,
    theme,
    timeTrackings,
    workTasks,
    taskCategories,
});

export type AppState = ReturnType<typeof rootReducer>;
