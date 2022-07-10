import { getDaysCount, getWorkingDays, getExperiense } from './DateUtils';
import { EventLog } from 'src/DAL/Calendar';
import { IProductionCalendar } from 'src/DAL/ProductionCalendar';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import moment from 'moment';

export interface IUserLimitsItem {
    key: string;
    fullName: string;
    eventLogCategory: string | undefined;
    usedInCurrentYear: number;
    rest: number | undefined;
}

export interface IUserEventLogItem {
    key: string;
    fullName: string;
    eventLogCategory: string;
    startDate: string;
    endDate: string | undefined;
    daysCount: number;
    status: string;
}

// Return count of days in eventLogs list
export const getDaysCountForEventLogsList = (
    _eventLogs: EventLog[],
    limit: boolean,
    productionCalendar: IProductionCalendar[],
    fromLimit?: Date,
    toLimit?: Date,
) => {
    let count = 0;
    for (let i = 0; i < _eventLogs.length; i++) {
        const _startDate =
            fromLimit && moment(_eventLogs[i].startDate).isBefore(fromLimit) ? fromLimit : _eventLogs[i].startDate;
        const _endDate = toLimit && moment(_eventLogs[i].endDate).isAfter(toLimit) ? toLimit : _eventLogs[i].endDate;
        count += limit ? getWorkingDays(_startDate, _endDate, productionCalendar) : getDaysCount(_startDate, _endDate);
    }
    return count;
};

// Return count of used and rest days in each category
export const getEventLogsInfo = (
    _eventLogs: EventLog[],
    _eventLogsCategories: EventLogCategory[],
    _employedDate: Date,
    _employeeFullName: string,
    productionCalendar: IProductionCalendar[],
): IUserLimitsItem[] => {
    const workYearsCount = getExperiense(_employedDate).years;
    const startOfCurrentWorkYear = new Date(
        _employedDate.getFullYear() + workYearsCount,
        _employedDate.getMonth(),
        _employedDate.getDate(),
    );
    const endOfCurrentWorkYear = new Date(
        _employedDate.getFullYear() + workYearsCount + 1,
        _employedDate.getMonth(),
        _employedDate.getDate() - 1,
    );
    const logs = _eventLogsCategories.map(item => {
        let restDays = 0;
        const _eventLogsByCategory = _eventLogs.filter(el => el.eventCategoryId === item.id);

        // Get rests for categories with limit
        if (item.limit !== 0) {
            // Get rests in previouse work years
            if (workYearsCount > 0) {
                for (let i = 0; i < workYearsCount; i++) {
                    const _startOfYear = new Date(
                        _employedDate.getFullYear() + i,
                        _employedDate.getMonth(),
                        _employedDate.getDate(),
                    );
                    const _endOfYear = new Date(
                        _employedDate.getFullYear() + 1 + i,
                        _employedDate.getMonth(),
                        _employedDate.getDate() - 1,
                    );

                    const _yearEventLogs = _eventLogsByCategory.filter(
                        el =>
                            (el.startDate >= _startOfYear && el.startDate < _endOfYear) ||
                            (el.startDate < _startOfYear &&
                                el.endDate !== null &&
                                el.endDate >= _startOfYear &&
                                el.endDate < _endOfYear),
                    );
                    restDays +=
                        item.limit -
                        getDaysCountForEventLogsList(
                            _yearEventLogs,
                            item.limit !== 0,
                            productionCalendar,
                            _startOfYear,
                            _endOfYear,
                        );
                }
            }
            // Add days avaliable in current work year
            const _currentYearEventLogs = _eventLogsByCategory.filter(
                el =>
                    el.startDate >= startOfCurrentWorkYear ||
                    (el.startDate < startOfCurrentWorkYear &&
                        el.endDate !== null &&
                        el.endDate >= startOfCurrentWorkYear),
            );
            restDays +=
                (item.limit / 12.0) * Math.round(getExperiense(_employedDate).months) -
                getDaysCountForEventLogsList(
                    _currentYearEventLogs,
                    item.limit !== 0,
                    productionCalendar,
                    startOfCurrentWorkYear,
                    endOfCurrentWorkYear,
                );
        }

        // Get days used in current work year
        const currentYearEventLogs = _eventLogsByCategory.filter(
            el =>
                el.startDate > startOfCurrentWorkYear ||
                (el.startDate < startOfCurrentWorkYear && el.endDate !== null && el.endDate > startOfCurrentWorkYear),
        );
        const usedInCurrentYear = getDaysCountForEventLogsList(
            currentYearEventLogs,
            item.limit !== 0,
            productionCalendar,
            startOfCurrentWorkYear,
            endOfCurrentWorkYear,
        );

        return {
            key: `${item.id}_${_employeeFullName}`,
            fullName: _employeeFullName,
            eventLogCategory: item.title,
            usedInCurrentYear: usedInCurrentYear,
            rest: item.limit === 0 ? undefined : Number.parseFloat(restDays.toFixed(2)),
        };
    });

    return logs;
};

export const getUserEventLogs = (
    _eventLogs: EventLog[],
    _eventLogsCategories: EventLogCategory[],
    productionCalendar: IProductionCalendar[],
): IUserEventLogItem[] => {
    const _items = _eventLogs.map(item => {
        const category = _eventLogsCategories.find(elc => elc.id === item.eventCategoryId);
        return {
            key: item.id,
            fullName: item.employeeName,
            eventLogCategory: item.eventCategoryName,
            startDate: item.startDate.toLocaleDateString(),
            endDate: item.endDate?.toLocaleDateString(),
            daysCount:
                category?.limit !== 0
                    ? getWorkingDays(item.startDate, item.endDate, productionCalendar)
                    : getDaysCount(item.startDate, item.endDate),
            status: item.approvalStatusTitle,
        };
    });
    return _items;
};
