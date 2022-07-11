import React, { FC, useState, useEffect } from 'react';
import { TaskCategory, TaskCategoryEdit } from 'src/DAL/Dictionaries';
import { ActionAsyncThunk } from 'src/shared/Common';
import { IColumn, IconButton } from '@fluentui/react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';

interface Props {
    data: TaskCategory[];
    isLoading: boolean;
    editingTaskCategory: (id: string) => ActionAsyncThunk<TaskCategoryEdit, string>;
    deletingTaskCategory: (id: string) => ActionAsyncThunk<TaskCategoryEdit, string>;
}

interface ITaskCategoryItem {
    key: string;
    name: string | undefined;
    editBtns: JSX.Element;
}

const TaskCategoriesListComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<ITaskCategoryItem[]>([]);

    useEffect(() => {
        setItems(getTaskCategoryItems(props.data, props.editingTaskCategory, props.deletingTaskCategory));
    }, [props.data, props.editingTaskCategory, props.deletingTaskCategory]);

    const columns: IColumn[] = [
        {
            key: 'taskCategory_name',
            name: 'Название',
            fieldName: 'name',
            minWidth: 100,
            maxWidth: 300,
        },
        {
            key: 'taskCategory_editButtons',
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

const getTaskCategoryItems = (
    _taskCategories: TaskCategory[],
    editingTaskCategory: (id: string) => void,
    deletingTaskCategory: (id: string) => void,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): ITaskCategoryItem[] => {
    const _items = _taskCategories
        .map(item => {
            return {
                key: item.id,
                name: item.name,
                editBtns: (
                    <div className="h-end">
                        <IconButton
                            title="Изменить"
                            iconProps={{ iconName: 'Edit' }}
                            onClick={() => editingTaskCategory(item.id)}
                        />
                        <IconButton
                            title="Удалить"
                            iconProps={{ iconName: 'Delete', className: 'red' }}
                            onClick={() => {
                                deletingTaskCategory(item.id);
                            }}
                        />
                    </div>
                ),
            };
        })
        .sort((a, b) => collator.compare(a.name, b.name));

    return _items;
};

export default TaskCategoriesListComponent;
