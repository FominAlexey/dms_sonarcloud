import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton } from '@fluentui/react';
import { EventLog, EventLogEdit } from 'src/DAL/Calendar';
import { CREATED, APPROVED, REJECTED } from 'src/shared/Constants';
import { ActionAsyncThunk } from 'src/shared/Common';
import { PatchEventLogInfoType } from 'src/store/slice/calendarSlice';

interface Props {
    data: EventLog[];
    isLoading: boolean;
    patchEventLog: (patchEventLogInfoArg: PatchEventLogInfoType) => ActionAsyncThunk<boolean, PatchEventLogInfoType>;
    deletingEventLog: (id: string) => ActionAsyncThunk<EventLogEdit, string>;
}

interface IEventLogConfirmationItem {
    key: string;
    employee: string;
    category: string;
    reason: string;
    startDate: string;
    endDate: string | undefined;
    requestedDate: string;
    confirmBtns: JSX.Element;
}

const EventLogConfirmationsListComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IEventLogConfirmationItem[]>([]);

    useEffect(() => {
        setItems(getEventLogConfirmationItems(props.data, props.patchEventLog, props.deletingEventLog));
    }, [props.data, props.patchEventLog, props.deletingEventLog]);

    const columns: IColumn[] = [
        {
            key: 'eventLogConfirmation_employee',
            name: 'Сотрудник',
            fieldName: 'employee',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'eventLogConfirmation_category',
            name: 'Категория',
            fieldName: 'category',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'eventLogConfirmation_reason',
            name: 'Причина',
            fieldName: 'reason',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'eventLogConfirmation_startDate',
            name: 'С',
            fieldName: 'startDate',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'eventLogConfirmation_endDate',
            name: 'По',
            fieldName: 'endDate',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'eventLogConfirmation_requestedDate',
            name: 'Запрошено',
            fieldName: 'requestedDate',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'eventLogConfirmation_confirmBtns',
            name: '',
            fieldName: 'confirmBtns',
            minWidth: 100,
            maxWidth: 100,
        },
    ];

    return (
        <ShimmeredDetailsList
            columns={columns}
            items={items}
            selectionMode={0}
            enableShimmer={props.isLoading}
            shimmerLines={5}
            isHeaderVisible={items.length !== 0}
        />
    );
};

const getEventLogConfirmationItems = (
    _eventLogs: EventLog[],
    patchEventLog: (patchEventLogInfoArg: PatchEventLogInfoType) => void,
    deletingEventLog: (id: string) => void,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IEventLogConfirmationItem[] => {
    const _items: IEventLogConfirmationItem[] = _eventLogs
        .map(item => {
            return {
                key: item.id,
                employee: item.employeeName,
                category: item.eventCategoryName,
                reason: item.reason,
                startDate: item.startDate.toLocaleDateString(),
                endDate: item.endDate?.toLocaleDateString(),
                requestedDate: item.requestedDate.toLocaleDateString(),
                confirmBtns: (
                    <div className="h-end">
                        {item.approvalStatusId === CREATED && (
                            <div>
                                <IconButton
                                    title="Подтвердить"
                                    iconProps={{ iconName: 'Accept' }}
                                    onClick={() => patchEventLog({ id: item.id, status: APPROVED })}
                                />
                                <IconButton
                                    title="Отклонить"
                                    iconProps={{ iconName: 'Cancel', className: 'red' }}
                                    onClick={() => patchEventLog({ id: item.id, status: REJECTED })}
                                />
                                <IconButton
                                    title="Удалить"
                                    iconProps={{ iconName: 'Delete', className: 'red' }}
                                    onClick={() => deletingEventLog(item.id)}
                                />
                            </div>
                        )}
                    </div>
                ),
            };
        })
        .sort((a, b) => collator.compare(a.employee, b.employee));

    return _items;
};

export default EventLogConfirmationsListComponent;
