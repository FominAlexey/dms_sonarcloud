import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton } from '@fluentui/react';
import { TimeTracking } from 'src/DAL/TimeTracking';
import { Project } from 'src/DAL/Projects';
import { MONTH_NAMES, getMonthsByPeriod, getISOString } from 'src/shared/DateUtils';
import { IListItem } from 'src/shared/Common';
import moment from 'moment';

interface Props {
    projects: Project[];
    timeTrackings: TimeTracking[];
    isLoading: boolean;
    fromDate: Date;
    toDate: Date;
}

const ProjectReportOverviewComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IListItem[]>([]);
    const [columns, setColumns] = useState<IColumn[] | []>([]);
    const [months, setMonths] = useState<Date[]>([]);

    // Get months
    useEffect(() => {
        const _months = getMonthsByPeriod(props.fromDate, props.toDate);
        setMonths(_months);
    }, [props.fromDate, props.toDate]);

    useEffect(() => {
        setItems(getProjectReportItems(props.projects, props.timeTrackings, months, props.fromDate, props.toDate));
    }, [props.projects, props.timeTrackings, months, props.fromDate, props.toDate]);

    useEffect(() => {
        // Create columns
        let _columns: IColumn[] = [];

        // Attach employee column
        _columns.push({
            key: 'projectReportOverview_project',
            name: 'Проект',
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
            key: 'projectReportOverview_moreBtn',
            name: '',
            fieldName: 'moreBtn',
            minWidth: 50,
            maxWidth: 100,
        });

        setColumns(_columns);
    }, [months]);

    return <ShimmeredDetailsList columns={columns} items={items} selectionMode={0} enableShimmer={props.isLoading} />;
};

// Getting time by project
const getProjectTimeSummary = (_timeTrackings: TimeTracking[], _months: Date[]) => {
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
    _projects: Project[],
    _timeTrackings: TimeTracking[],
    _months: Date[],
    _fromDate: Date,
    _toDate: Date,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IListItem[] => {
    // Create projects items
    const _items = _projects
        .map(item => {
            return {
                key: item.id,
                title: item.title,
                moreBtn: (
                    <IconButton
                        title="Подробнее"
                        iconProps={{ iconName: 'ChevronRightMed' }}
                        href={`/Reports/ProjectReport/${item.id}?fromDate=${getISOString(
                            _fromDate,
                        )}&toDate=${getISOString(_toDate)}`}
                    />
                ),
            };
        })
        .sort((a, b) => collator.compare(a.title, b.title));

    // Attach timeTracking items
    for (let i = 0; i < _items.length; i++) {
        const _projectTimeTrackings = getProjectTimeSummary(
            _timeTrackings.filter(t => t.projectId === _items[i].key),
            _months,
        );
        const _projectTimeTrackingsItems = Object.assign(
            {},
            ..._projectTimeTrackings.map(key => ({ [key.fieldName]: key.content })),
        );
        _items[i] = { ..._items[i], ..._projectTimeTrackingsItems };
    }

    // Attach summary row
    let summaryItem = {
        key: '',
        title: 'Итого',
        moreBtn: <span></span>,
    };

    const _summaryProjectTimeTrackings = getProjectTimeSummary(_timeTrackings, _months);
    const _summaryProjectTimeTrackingsItems = Object.assign(
        {},
        ..._summaryProjectTimeTrackings.map(key => ({ [key.fieldName]: key.content })),
    );
    summaryItem = { ...summaryItem, ..._summaryProjectTimeTrackingsItems };

    _items.push(summaryItem);

    return _items;
};

export default ProjectReportOverviewComponent;
