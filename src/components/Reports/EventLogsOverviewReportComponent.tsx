import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn } from '@fluentui/react';
import { EventLog } from 'src/DAL/Calendar';
import { IProductionCalendar } from 'src/DAL/ProductionCalendar';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { getDaysCountForEventLogsList } from 'src/shared/EventLogsUtils';
import { IListItem } from 'src/shared/Common';

interface Props {
    eventLogs: EventLog[];
    eventLogsCategories: EventLogCategory[];
    isLoading: boolean;
    productionCalendar: IProductionCalendar[];
    fromLimit?: Date;
    toLimit?: Date;
}

const EventLogsOverviewReportComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IListItem[]>([]);
    const [columns, setColumns] = useState<IColumn[] | []>([]);

    useEffect(() => {
        setItems(
            getEventLogsReportItems(
                props.eventLogs,
                props.eventLogsCategories,
                props.productionCalendar,
                props.fromLimit,
                props.toLimit,
            ),
        );
    }, [props.eventLogsCategories, props.eventLogs, props.productionCalendar]);

    useEffect(() => {
        // Create columns
        let _columns: IColumn[] = [];

        _columns.push({
            key: 'eventLogsOverviewReport_fullName',
            name: 'Сотрудник',
            fieldName: 'title',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        });

        // Attach eventLog categories columns
        _columns = _columns.concat(
            props.eventLogsCategories.map(item => {
                return {
                    key: item.id.toString(),
                    name: item.title!,
                    fieldName: item.title,
                    minWidth: 100,
                    maxWidth: 200,
                };
            }),
        );

        setColumns(_columns);
    }, [props.eventLogsCategories]);

    return <ShimmeredDetailsList items={items} columns={columns} selectionMode={0} enableShimmer={props.isLoading} />;
};

// Get eventLogs grouped by eventLogsCategories
const getEventLogsGroups = (
    _eventLogs: EventLog[],
    _eventLogsCategories: EventLogCategory[],
    productionCalendar: IProductionCalendar[],
    fromLimit?: Date,
    toLimit?: Date,
) => {
    let logs = [];

    logs = _eventLogsCategories.map(item => {
        return {
            key: item.id,
            fieldName: item.title!,
            content: getDaysCountForEventLogsList(
                _eventLogs.filter(el => el.eventCategoryId === item.id),
                item.limit !== 0,
                productionCalendar,
                fromLimit,
                toLimit,
            ),
        };
    });

    return logs;
};

// Get unique emloyees from eventLogs list
const getEmployees = (_eventLogs: EventLog[]) => {
    // Order by employeeName
    const eventLogsSort: EventLog[] = JSON.parse(JSON.stringify(_eventLogs));
    eventLogsSort.sort((a, b) => (a.employeeName > b.employeeName ? 1 : -1));

    // Get unique Ids
    const uniqueIds = Array.from(new Set(eventLogsSort.map(item => item.employeeId)));

    // Get employees list
    const result = [];
    for (let i = 0; i < uniqueIds.length; i++) {
        result.push({
            employeeId: uniqueIds[i],
            fullName: eventLogsSort.find(el => el.employeeId === uniqueIds[i])?.employeeName,
        });
    }
    return result;
};

const getEventLogsReportItems = (
    _eventLogs: EventLog[],
    _eventLogsCategories: EventLogCategory[],
    productionCalendar: IProductionCalendar[],
    fromLimit?: Date,
    toLimit?: Date,
): IListItem[] => {
    // Create employees items
    const _employees = getEmployees(_eventLogs);
    const _items = _employees.map(item => {
        return {
            key: item.employeeId,
            title: item.fullName,
        };
    });

    // Attach eventLogs items
    for (let i = 0; i < _items.length; i++) {
        const _eventLogGroups = getEventLogsGroups(
            _eventLogs.filter(el => el.employeeId === _items[i].key),
            _eventLogsCategories,
            productionCalendar,
            fromLimit,
            toLimit,
        );
        const _eventLogsItems = Object.assign({}, ..._eventLogGroups.map(key => ({ [key.fieldName]: key.content })));
        _items[i] = { ..._items[i], ..._eventLogsItems };
    }

    return _items;
};

export default EventLogsOverviewReportComponent;
