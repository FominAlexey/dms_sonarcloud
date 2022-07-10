import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { EventLog } from 'src/DAL/Calendar';
import { IProductionCalendar } from 'src/DAL/ProductionCalendar';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { EmployeeEdit } from 'src/DAL/Employees';
import { getEventLogsInfo, IUserLimitsItem } from 'src/shared/EventLogsUtils';

interface Props {
    eventLogs: EventLog[];
    eventLogsCategories: EventLogCategory[];
    isLoading: boolean;
    employee: EmployeeEdit;
    productionCalendar: IProductionCalendar[];
}

const UserLimitsComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IUserLimitsItem[]>([]);

    useEffect(() => {
        setItems(
            getEventLogsInfo(
                props.eventLogs,
                props.eventLogsCategories,
                props.employee.employedDate,
                props.employee.fullName!,
                props.productionCalendar,
            ),
        );
    }, [props.employee, props.eventLogs, props.eventLogsCategories, props.productionCalendar]);

    const columns = [
        {
            key: 'userLimits_eventCategory',
            name: 'Категория',
            fieldName: 'eventLogCategory',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'userLimits_usedInCurrentYear',
            name: 'Использовано',
            fieldName: 'usedInCurrentYear',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'userLimits_rest',
            name: 'Доступно',
            fieldName: 'rest',
            minWidth: 100,
            maxWidth: 100,
        },
    ];

    return <ShimmeredDetailsList items={items} columns={columns} selectionMode={0} enableShimmer={props.isLoading} />;
};

export default UserLimitsComponent;
