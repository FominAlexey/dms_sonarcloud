import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton } from '@fluentui/react';
import { Project, ProjectEdit } from 'src/DAL/Projects';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    data: Project[];
    isLoading: boolean;
    editingProject: (id: string) => ActionAsyncThunk<ProjectEdit, string>;
    deletingProject: (id: string) => ActionAsyncThunk<ProjectEdit, string>;
}

interface IProjectItem {
    key: string;
    title: string;
    client: string;
    manager: string;
    teamMembers: number;
    editBtns: JSX.Element;
}

const ProjectsListComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IProjectItem[]>([]);

    useEffect(() => {
        setItems(getProjectItems(props.data, props.editingProject, props.deletingProject));
    }, [props.data, props.editingProject, props.deletingProject]);

    const columns: IColumn[] = [
        {
            key: 'project_title',
            name: 'Название',
            fieldName: 'title',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'project_client',
            name: 'Клиент',
            fieldName: 'client',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'project_manager',
            name: 'Менеджер',
            fieldName: 'manager',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'project_teamMembers',
            name: 'Сотрудники',
            fieldName: 'teamMembers',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'project_editButtons',
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
            isHeaderVisible={items.length !== 0}
        />
    );
};

const getProjectItems = (
    _projects: Project[],
    editingProject: (id: string) => void,
    deletingProject: (id: string) => void,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IProjectItem[] => {
    const _items = _projects
        .map(item => {
            return {
                key: item.id,
                title: item.title,
                client: item.client,
                manager: item.manager,
                teamMembers: item.teamMembersCount,
                editBtns: (
                    <div className="h-end">
                        <IconButton
                            title="Изменить"
                            iconProps={{ iconName: 'Edit' }}
                            onClick={() => {
                                editingProject(item.id);
                            }}
                        />
                        <IconButton
                            title="Удалить"
                            iconProps={{ iconName: 'Delete', className: 'red' }}
                            onClick={() => {
                                deletingProject(item.id);
                            }}
                        />
                    </div>
                ),
            };
        })
        .sort((a, b) => collator.compare(a.title, b.title));
    return _items;
};

export default ProjectsListComponent;
