import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton } from '@fluentui/react';
import { Employee, EmployeeEdit } from 'src/DAL/Employees';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    data: Employee[];
    isLoading: boolean;
    editingEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;
}

interface IUserItem {
    key: string;
    fullName: string;
    roles: string;
    editBtns: JSX.Element;
}

const UsersManagementComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IUserItem[]>([]);

    useEffect(() => {
        setItems(getUserItems(props.data, props.editingEmployee));
    }, [props.data, props.editingEmployee]);

    const columns: IColumn[] = [
        {
            key: 'user_fullName',
            name: 'Сотрудник',
            fieldName: 'fullName',
            minWidth: 200,
            maxWidth: 300,
            isMultiline: true,
        },
        {
            key: 'user_roles',
            name: 'Роли',
            fieldName: 'roles',
            minWidth: 200,
            maxWidth: 300,
        },
        {
            key: 'user_editButtons',
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

const getUserItems = (
    _employees: Employee[],
    editingEmployee: (id: string) => void,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IUserItem[] => {
    const _items = _employees
        .map(item => {
            return {
                key: item.id,
                fullName: item.fullName,
                roles: item.roles.toString(),
                editBtns: (
                    <div className="h-end">
                        <IconButton
                            title="Изменить"
                            iconProps={{ iconName: 'Edit' }}
                            onClick={() => {
                                editingEmployee(item.id);
                            }}
                        />
                    </div>
                ),
            };
        })
        .sort((a, b) => collator.compare(a.fullName, b.fullName));

    return _items;
};

export default UsersManagementComponent;
