import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton, Icon } from '@fluentui/react';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    data: EventLogCategory[];
    isLoading: boolean;
    editingEventLogCategory: (id: string) => ActionAsyncThunk<EventLogCategory, string>;
    deletingEventLogCategory: (id: string) => ActionAsyncThunk<EventLogCategory, string>;
}

interface IEventLogCategoryItem {
    key: string;
    title: string | undefined;
    color: JSX.Element;
    limit: number;
    editBtns: JSX.Element;
}

const EventLogCategoriesListComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IEventLogCategoryItem[]>([]);

    useEffect(() => {
        setItems(getEventLogCategoryItems(props.data, props.editingEventLogCategory, props.deletingEventLogCategory));
    }, [props.data, props.editingEventLogCategory, props.deletingEventLogCategory]);

    const columns: IColumn[] = [
        {
            key: 'eventLogCategory_title',
            name: 'Название',
            fieldName: 'title',
            minWidth: 100,
            maxWidth: 300,
        },
        {
            key: 'eventLogCategory_color',
            name: 'Цвет',
            fieldName: 'color',
            minWidth: 100,
            maxWidth: 300,
        },
        {
            key: 'eventLogCategory_limit',
            name: 'Годовой лимит (дни)',
            fieldName: 'limit',
            minWidth: 100,
            maxWidth: 300,
        },
        {
            key: 'eventLogCategory_editButtons',
            name: '',
            fieldName: 'editBtns',
            minWidth: 50,
            maxWidth: 50,
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

const getEventLogCategoryItems = (
    _eventLogCategories: EventLogCategory[],
    editingEventLogCategory: (id: string) => void,
    deletingEventLogCategory: (id: string) => void,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
) => {
    const _items = _eventLogCategories
        .map(item => {
            return {
                key: item.id,
                title: item.title ? item.title : '',
                limit: item.limit,
                color: (
                    <div className="mr-30 h-start">
                        <Icon iconName="CircleFill" style={{ color: item.color }} className="mr-5" />
                        <span>{item.color}</span>
                    </div>
                ),
                editBtns: (
                    <div className="h-end">
                        <IconButton
                            title="Изменить"
                            iconProps={{ iconName: 'Edit' }}
                            onClick={() => editingEventLogCategory(item.id)}
                        />
                        <IconButton
                            title="Удалить"
                            iconProps={{ iconName: 'Delete', className: 'red' }}
                            onClick={() => {
                                deletingEventLogCategory(item.id);
                            }}
                        />
                    </div>
                ),
            };
        })
        .sort((a, b) => collator.compare(a.title, b.title));

    return _items;
};

export default EventLogCategoriesListComponent;
