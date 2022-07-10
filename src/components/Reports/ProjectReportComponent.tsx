import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn } from '@fluentui/react';
import { TimeTracking } from 'src/DAL/TimeTracking';
import { MONTH_NAMES, getMonthsByPeriod } from 'src/shared/DateUtils';
import { TeamMember } from 'src/DAL/Projects';
import { IListItem } from 'src/shared/Common';
import moment from 'moment';

interface Props {
    teamMembers: TeamMember[];
    timeTrackings: TimeTracking[];
    isLoading: boolean;
    fromDate: Date;
    toDate: Date;
}

const ProjectReportComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IListItem[]>([]);
    const [columns, setColumns] = useState<IColumn[] | []>([]);
    const [months, setMonths] = useState<Date[]>([]);

    // Get months
    useEffect(() => {
        const _months = getMonthsByPeriod(props.fromDate, props.toDate);
        setMonths(_months);
    }, [props.fromDate, props.toDate]);

    useEffect(() => {
        setItems(getProjectReportItems(props.teamMembers, props.timeTrackings, months));
    }, [props.teamMembers, props.timeTrackings, months]);

    useEffect(() => {
        // Create colums
        let _columns: IColumn[] = [];

        // Attach employees columns
        _columns.push({
            key: 'projectReport_employee',
            name: 'Сотрудник',
            fieldName: 'title',
            minWidth: 100,
            maxWidth: 200,
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
        setColumns(_columns);
    }, [months]);

    return <ShimmeredDetailsList columns={columns} items={items} selectionMode={0} enableShimmer={props.isLoading} />;
};

// Getting time by project
const getTimeTrackingsSummary = (_timeTrackings: TimeTracking[], _months: Date[]) => {
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

const getProjectReportItems = (
    _teamMembers: TeamMember[],
    _timeTrackings: TimeTracking[],
    _months: Date[],
): IListItem[] => {
    // Create teamMembers items
    const _items = _teamMembers.map(item => {
        return {
            key: item.employeeId,
            title: item.fullName,
        };
    });

    // Attach timeTrackings items
    for (let i = 0; i < _items.length; i++) {
        const _employeeTimeTrackings = getTimeTrackingsSummary(
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
    };

    const _summaryTimeTrackings = getTimeTrackingsSummary(_timeTrackings, _months);
    const _summaryTimeTrackingsItem = Object.assign(
        {},
        ..._summaryTimeTrackings.map(key => ({ [key.fieldName]: key.content })),
    );
    summaryItem = { ...summaryItem, ..._summaryTimeTrackingsItem };
    _items.push(summaryItem);

    return _items;
};

export default ProjectReportComponent;
