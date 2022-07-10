import React from 'react';
import { TimeTracking, WorkTask } from 'src/DAL/TimeTracking';
import { getStartOfWeek, WEEK_LENGTH, DAY_SHORT_NAMES, MONTH_SHORT_NAMES } from './DateUtils';
import { IColumn } from '@fluentui/react';
import { Project } from 'src/DAL/Projects';
import { IListItem } from './Common';

// Get timeTrackings by workTask
export const getWorkTaskLogs = (taskLogs: TimeTracking[]) => {
    const days = [];
    let j = 0;

    for (let i = 0; i < taskLogs.length; i++) {
        days[j] = {
            content: `${taskLogs[i].timeSpent};${taskLogs[i].id}`,
            fieldName: `${taskLogs[i].startDate.toLocaleDateString()}`,
        };
        j++;
    }

    return days;
};

// Get timeSpent sum by startDate
export const getSummaryWorkTaskLogs = (date: Date, _timeTrackings: TimeTracking[]) => {
    const days = [];
    let j = 0;
    const startOfWeek = getStartOfWeek(date);

    for (let i = 0; i < WEEK_LENGTH; i++) {
        const startDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);

        // Get timeTrackings by startDate
        const taskLogs = _timeTrackings.filter(
            t => t.startDate.toLocaleDateString() === startDate.toLocaleDateString(),
        );

        // Get timeSpent sum
        if (taskLogs.length !== 0) {
            days[j] = {
                content: `${taskLogs.reduce((a, b) => a + b.timeSpent, 0)}`,
                fieldName: `${startDate.toLocaleDateString()}`,
            };
            j++;
        }
    }

    return days;
};

// Returns list of days with columns props
export const getDaysColumns = (start: Date, count: number, maxWidth: number): IColumn[] => {
    let _columns: IColumn[] = [
        {
            key: 'titleColumn',
            name: 'Задача',
            fieldName: 'title',
            minWidth: 20,
            maxWidth: 200,
        },
    ];

    const day = new Date(start);

    const days: IColumn[] = [];
    for (let i = 0; i < count; i++) {
        days[i] = {
            key: `${day.getDate()}_${day.getMonth()}`,
            fieldName: `${day.toLocaleDateString()}`,
            name: `${DAY_SHORT_NAMES[day.getDay()]}`,
            ariaLabel: `${day.getDate()} ${MONTH_SHORT_NAMES[day.getMonth()]}`,
            minWidth: 10,
            maxWidth: maxWidth,
        };
        day.setDate(day.getDate() + 1);
    }
    _columns = _columns.concat(days);
    return _columns;
};

export interface IListTimeTrackingItems extends IListItem {
    projectId: string;
    taskCategoryId: string;
}

export const getTimeTrackingItems = (
    _workTasks: WorkTask[],
    _timeTrackings: TimeTracking[],
    _currentDate: Date,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IListTimeTrackingItems[] => {
    // Create items
    const _items: IListTimeTrackingItems[] = _workTasks
        .map(item => ({
            key: item.id,
            title: item.projectName + ',' + item.taskCategoryName,
            projectId: item.projectId,
            taskCategoryId: item.taskCategoryId,
        }))
        .sort((a, b) => collator.compare(a.title, b.title));

    // Attach time logs
    for (let i = 0; i < _items.length; i++) {
        const _workTaskTimeTrackings = _timeTrackings.filter(t => t.workTaskId === _items[i].key);
        const workTaskLogs = Object.assign(
            {},
            ...getWorkTaskLogs(_workTaskTimeTrackings).map(key => ({ [key.fieldName]: key.content })),
        );
        _items[i] = { ..._items[i], ...workTaskLogs };
    }

    // Attach summary item
    const summaryWorkTaskLogs = Object.assign(
        {},
        ...getSummaryWorkTaskLogs(_currentDate, _timeTrackings).map(key => ({ [key.fieldName]: key.content })),
    );
    const summaryItems = { ...{ key: 0, title: 'Итого:' }, ...summaryWorkTaskLogs };
    _items.push(summaryItems);

    return _items;
};

export const getTimeReportItems = (
    _workTasks: WorkTask[],
    _projects: Project[],
    _timeTrackings: TimeTracking[],
    _currentDate: Date,
): IListItem[] => {
    // Create items
    const _items = _workTasks.map(item => ({
        key: item.id,
        title: (
            <div>
                <div className="fw-bold">{_projects.find(p => p.id === item.projectId)?.title}</div>
                <div>{item.taskCategoryName}</div>
            </div>
        ),
    }));
    // Attach time logs
    for (let i = 0; i < _items.length; i++) {
        const workTaskLogs = Object.assign(
            {},
            ...getWorkTaskLogs(_timeTrackings.filter(t => t.workTaskId === _items[i].key)).map(key => ({
                [key.fieldName]: key.content.split(';')[0],
            })),
        );
        _items[i] = { ..._items[i], ...workTaskLogs };
    }
    // Attach summary item
    const summaryWorkTaskLogs = Object.assign(
        {},
        ...getSummaryWorkTaskLogs(_currentDate, _timeTrackings).map(key => ({ [key.fieldName]: key.content })),
    );
    const summaryItems = { ...{ key: 0, title: 'Итого:' }, ...summaryWorkTaskLogs };
    _items.push(summaryItems);

    return _items;
};
