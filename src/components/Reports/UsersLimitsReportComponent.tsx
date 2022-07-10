import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { Employee } from 'src/DAL/Employees';
import { EventLog } from 'src/DAL/Calendar';
import { IProductionCalendar } from 'src/DAL/ProductionCalendar';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { getEventLogsInfo, IUserLimitsItem } from 'src/shared/EventLogsUtils';
import { IColumn } from '@fluentui/react';

interface Props {
    employees: Employee[];
    eventLogs: EventLog[];
    eventLogsCategories: EventLogCategory[];
    isLoading: boolean;
    productionCalendar: IProductionCalendar[];
}

const UsersLimitsReportComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState([{}]);
    const [columns, setColumns] = useState<IColumn[] | []>([]);
    const collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' });

    useEffect(() => {
        const _items = props.employees
            .map(item => {
                return {
                    keyColumn: item.id,
                    fullNameColumn: item.fullName,
                    employedDateColumn: item.employedDate,
                };
            })
            .sort((a, b) => collator.compare(a.fullNameColumn, b.fullNameColumn));

        // Attach eventLogsLimits items
        for (let i = 0; i < _items.length; i++) {
            const _employeeEventLogs = props.eventLogs.filter(el => el.employeeId === _items[i].keyColumn);
            const _employeeItems: IUserLimitsItem[] = getEventLogsInfo(
                _employeeEventLogs,
                props.eventLogsCategories,
                _items[i].employedDateColumn,
                _items[i].fullNameColumn,
                props.productionCalendar,
            );
            const _eventLogGroups = getEventLogsInfoGroups(_employeeItems, props.eventLogsCategories);
            const _eventLogsItems = Object.assign(
                {},
                ..._eventLogGroups.map(key => ({ [key.fieldName]: key.content })),
            );
            _items[i] = { ..._items[i], ..._eventLogsItems };
        }

        setItems(_items);
    }, [props.employees, props.eventLogs, props.eventLogsCategories, props.productionCalendar]);

    useEffect(() => {
        // Create columns
        let _columns: IColumn[] = [];

        _columns.push({
            key: 'fullName',
            name: 'Сотрудник',
            fieldName: 'fullNameColumn',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        });

        // Attach eventLog categories columns
        _columns = _columns.concat(
            props.eventLogsCategories.map(item => {
                const description = item.limit === 0 ? '' : '(Исп./Ост.)';
                return {
                    key: item.id.toString(),
                    name: `${item.title} ${description}`,
                    fieldName: `${item.title}Column`,
                    minWidth: 100,
                    maxWidth: 200,
                };
            }),
        );

        setColumns(_columns);
    }, [props.eventLogsCategories, props.productionCalendar]);

    return <ShimmeredDetailsList items={items} columns={columns} selectionMode={0} enableShimmer={props.isLoading} />;
};

const getEventLogsInfoGroups = (_eventLogsInfo: IUserLimitsItem[], _eventLogCategories: EventLogCategory[]) => {
    const logs = _eventLogCategories.map(item => {
        const _eventLogsInfoByCategory = _eventLogsInfo.find(eli => eli.eventLogCategory === item.title);
        return {
            fieldName: `${item.title}Column`,
            content: (
                <div>
                    <span>{_eventLogsInfoByCategory?.usedInCurrentYear}</span>
                    {_eventLogsInfoByCategory?.rest !== undefined && <span> / {_eventLogsInfoByCategory?.rest}</span>}
                </div>
            ),
        };
    });
    return logs;
};

export default UsersLimitsReportComponent;
