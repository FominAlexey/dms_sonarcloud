import React, { FC } from 'react';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import { PrimaryButton, Label } from '@fluentui/react';
import EventLogCategoriesListComponent from './EventLogCategoriesListComponent';
import EventLogCategoryEditComponent from './EventLogCategoryEditComponent';
import DeleteDialog from 'src/components/DeleteDialog';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { ActionAsyncThunk } from 'src/shared/Common';

interface BaseProps {
    showContent: boolean;
    eventLogCategoryId: string;
    saveEventLogCategory: (eventLogCategory: EventLogCategory) => ActionAsyncThunk<boolean, EventLogCategory>;
}

export interface EventLogCategoriesProps extends BaseProps {
    eventLogCategories: EventLogCategory[] | null;
    currentEventLogCategory: EventLogCategory | null;

    eventLogCategoriesPosting: boolean;
    eventLogCategoriesLoading: boolean;
    isEventLogCategoryAdding: boolean;
    isEventLogCategoryEditing: boolean;
    isEventLogCategoryDeleting: boolean;

    addingEventLogCategory: () => void;
    clearEventLogCategory: () => void;

    editingEventLogCategory: (id: string) => ActionAsyncThunk<EventLogCategory, string>;
    deletingEventLogCategory: (id: string) => ActionAsyncThunk<EventLogCategory, string>;
    deleteEventLogCategory: (id: string) => ActionAsyncThunk<boolean, string>;
}

const EventLogCategoriesComponent: FC<EventLogCategoriesProps> = (props: EventLogCategoriesProps) => {
    return (
        <ContentContainer title="Изменения в рабочем календаре" showContent={props.showContent}>
            <PrimaryButton text="Добавить" onClick={() => props.addingEventLogCategory()} className="mt-20" />

            <EventLogCategoriesListComponent
                data={props.eventLogCategories || []}
                editingEventLogCategory={props.editingEventLogCategory}
                isLoading={props.eventLogCategoriesLoading}
                deletingEventLogCategory={props.deletingEventLogCategory}
            />

            {!props.eventLogCategoriesLoading && props.eventLogCategories?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {(props.isEventLogCategoryAdding || props.isEventLogCategoryEditing) && props.currentEventLogCategory && (
                <EventLogCategoryEditComponent
                    eventLogCategory={props.currentEventLogCategory}
                    saveEventLogCategory={props.saveEventLogCategory}
                    clearEventLogCategory={props.clearEventLogCategory}
                    posting={props.eventLogCategoriesPosting}
                />
            )}

            {props.isEventLogCategoryDeleting && props.currentEventLogCategory && (
                <DeleteDialog
                    hidden={!props.isEventLogCategoryDeleting}
                    deleteMethod={() => props.deleteEventLogCategory(props.eventLogCategoryId)}
                    closeMethod={() => props.clearEventLogCategory()}
                />
            )}
        </ContentContainer>
    );
};

export default EventLogCategoriesComponent;
