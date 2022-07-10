import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn } from '@fluentui/react';
import { IUserEventLogItem, getUserEventLogs } from 'src/shared/EventLogsUtils';
import { EventLog } from 'src/DAL/Calendar';
import { IProductionCalendar } from 'src/DAL/ProductionCalendar';
import { EventLogCategory } from 'src/DAL/Dictionaries';

interface Props {
    eventLogs: EventLog[];
    eventLogCategories: EventLogCategory[];
    isLoading: boolean;
    productionCalendar: IProductionCalendar[];
}

const UserEventLogsComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IUserEventLogItem[]>([]);

    useEffect(() => {
        setItems(getUserEventLogs(props.eventLogs, props.eventLogCategories, props.productionCalendar));
    }, [props.eventLogs, props.eventLogCategories, props.productionCalendar]);

    // Create columns
    const columns: IColumn[] = [
        {
            key: 'userEventLog_eventCategory',
            name: 'Категория',
            fieldName: 'eventLogCategory',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'userEventLog_daysCount',
            name: 'Дни',
            fieldName: 'daysCount',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'userEventLog_startDate',
            name: 'С',
            fieldName: 'startDate',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'userEventLog_endDate',
            name: 'По',
            fieldName: 'endDate',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'userEventLog_status',
            name: 'Статус',
            fieldName: 'status',
            minWidth: 100,
            maxWidth: 100,
        },
    ];

    return <ShimmeredDetailsList items={items} columns={columns} selectionMode={0} enableShimmer={props.isLoading} />;
};

export default UserEventLogsComponent;
