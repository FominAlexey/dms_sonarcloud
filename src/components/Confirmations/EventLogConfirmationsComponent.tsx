import React, { FC } from 'react';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import { Label } from '@fluentui/react';
import DeleteDialog from 'src/components/DeleteDialog';
import { PatchEventLogInfoType } from 'src/store/slice/calendarSlice';
import { EventLog, EventLogEdit } from 'src/DAL/Calendar';
import { ActionAsyncThunk } from 'src/shared/Common';
import EventLogConfirmationsListComponent from './EventLogConfirmationsListComponent';

interface BaseProps {
    eventLogId: string;
}

export interface EventLogConfirmationsProps extends BaseProps {
    eventLogs: EventLog[] | null;
    currentEventLog: EventLogEdit | null;

    eventLogsLoading: boolean;
    isDeletingEventLog: boolean;

    patchEventLog: (patchEventLogInfoArg: PatchEventLogInfoType) => ActionAsyncThunk<boolean, PatchEventLogInfoType>;
    clearEventLog: () => void;
    deletingEventLog: (id: string) => ActionAsyncThunk<EventLogEdit, string>;
    deleteEventLog: (id: string) => ActionAsyncThunk<boolean, string>;
}

const EventLogConfirmationsComponent: FC<EventLogConfirmationsProps> = (props: EventLogConfirmationsProps) => {
    return (
        <ContentContainer title="Подтверждения изменений в каледаре" showContent={true}>
            <EventLogConfirmationsListComponent
                data={props.eventLogs || []}
                patchEventLog={props.patchEventLog}
                isLoading={props.eventLogsLoading}
                deletingEventLog={props.deletingEventLog}
            />

            {!props.eventLogsLoading && props.eventLogs?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {props.isDeletingEventLog && props.currentEventLog && (
                <DeleteDialog
                    hidden={!props.isDeletingEventLog}
                    deleteMethod={() => props.deleteEventLog(props.eventLogId)}
                    closeMethod={() => props.clearEventLog()}
                />
            )}
        </ContentContainer>
    );
};

export default EventLogConfirmationsComponent;
