import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton } from '@fluentui/react';
import { Employee } from 'src/DAL/Employees';
import { TimeTracking } from 'src/DAL/TimeTracking';
import { MONTH_NAMES, getMonthsByPeriod } from 'src/shared/DateUtils';
import { IListItem } from 'src/shared/Common';
import moment from 'moment';

interface Props {
    employees: Employee[];
    timeTrackings: TimeTracking[];
    isLoading: boolean;
    fromDate: Date;
    toDate: Date;
}

const TimeReportOverviewComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IListItem[]>([]);
    const [columns, setColumns] = useState<IColumn[] | []>([]);
    const [months, setMonths] = useState<Date[]>([]);

    // Get months
    useEffect(() => {
        const _months = getMonthsByPeriod(props.fromDate, props.toDate);
        setMonths(_months);
    }, [props.fromDate, props.toDate]);

    useEffect(() => {
        setItems(getTimeReportItems(props.employees, props.timeTrackings, months));
    }, [props.employees, props.timeTrackings, months]);

    useEffect(() => {
        // Create columns
        let _columns: IColumn[] = [];

        // Attach employee column
        _columns.push({
            key: 'timeReportOverview_employee',
            name: 'Сотрудник',
            fieldName: 'title',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        });

        // Attach months columns
        _columns = _columns.concat(
            months.map(item => {
                return {
                    key: item.toString(),
                    name: MONTH_NAMES[item.getMonth()],
                    fieldName: item.toString(),
                    minWidth: 50,
                    maxWidth: 100,
                };
            }),
        );

        // Attach more btn column
        _columns.push({
            key: 'timeReportOverview_moreBtn',
            name: '',
            fieldName: 'moreBtn',
            minWidth: 50,
            maxWidth: 100,
        });

        setColumns(_columns);
    }, [months]);

    return <ShimmeredDetailsList columns={columns} items={items} selectionMode={0} enableShimmer={props.isLoading} />;
};

// Getting time by project (for month optional)
const getEmployeeTimeSummary = (_timeTrackings: TimeTracking[], _months: Date[]) => {
    let logs = [];
    logs = _months.map(item => {
        const monthlyTimeTrackings = _timeTrackings.filter(t => moment(t.startDate).isSame(item, 'month'));
        return {
            key: item,
            fieldName: item.toString(),
            content: monthlyTimeTrackings.reduce((prev, current) => prev + current.timeSpent, 0),
        };
    });
    return logs;
};

const getTimeReportItems = (
    _employees: Employee[],
    _timeTrackings: TimeTracking[],
    _months: Date[],
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IListItem[] => {
    // Create employees items
    const _items = _employees
        .map(item => {
            return {
                key: item.id,
                title: item.fullName,
                moreBtn: (
                    <IconButton
                        iconProps={{ iconName: 'ChevronRightMed' }}
                        title="Подробнее"
                        href={`/Reports/TimeReport/${item.id}`}
                    />
                ),
            };
        })
        .sort((a, b) => collator.compare(a.title, b.title));

    // Attach timeTrackings items
    for (let i = 0; i < _items.length; i++) {
        const _employeeTimeTrackings = getEmployeeTimeSummary(
            _timeTrackings.filter(t => t.employeeId === _items[i].key),
            _months,
        );
        const _employeeTimeTrackingsItems = Object.assign(
            {},
            ..._employeeTimeTrackings.map(key => ({ [key.fieldName]: key.content })),
        );
        _items[i] = { ..._items[i], ..._employeeTimeTrackingsItems };
    }

    // Attach summary row
    let summaryItem = {
        key: '',
        title: 'Итого',
        moreBtn: <span></span>,
    };

    const _summaryTimeTrackings = getEmployeeTimeSummary(_timeTrackings, _months);
    const _summaryTimeTrackingsItems = Object.assign(
        {},
        ..._summaryTimeTrackings.map(key => ({ [key.fieldName]: key.content })),
    );
    summaryItem = { ...summaryItem, ..._summaryTimeTrackingsItems };

    _items.push(summaryItem);

    return _items;
};

export default TimeReportOverviewComponent;
