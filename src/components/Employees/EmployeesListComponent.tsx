import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton } from '@fluentui/react';
import { Employee, EmployeeEdit } from 'src/DAL/Employees';
import { getExperienseString } from 'src/shared/DateUtils';
import { ActionAsyncThunk } from 'src/shared/Common';

import 'src/styles/employeeListStyles.css';

interface Props {
    data: Employee[];
    isLoading: boolean;
    editingEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;
    deletingEmployee: (id: string) => ActionAsyncThunk<EmployeeEdit, string>;
}

interface IEmployeeItem {
    key: string;
    fullName: string;
    email: string;
    phone: string;
    employedDate: string;
    leaveDate: string | undefined;
    editBtns: JSX.Element;
}

const EmployeesListComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IEmployeeItem[]>([]);

    useEffect(() => {
        setItems(getEmployeeItems(props.data, props.editingEmployee, props.deletingEmployee));
    }, [props.data, props.editingEmployee, props.deletingEmployee]);

    const columns: IColumn[] = [
        {
            key: 'employee_fullName',
            name: 'ФИО',
            fieldName: 'fullName',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        },
        {
            key: 'employee_email',
            name: 'Email',
            fieldName: 'email',
            minWidth: 100,
            maxWidth: 200,
        },
        {
            key: 'employee_phone',
            name: 'Телефон',
            fieldName: 'phone',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'employee_utilization',
            name: 'Утилизация',
            fieldName: 'utilization',
            minWidth: 80,
            maxWidth: 80,
        },
        {
            key: 'employee_employedDate',
            name: 'Устроен',
            fieldName: 'employedDate',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'employee_leaveDate',
            name: 'Уволен',
            fieldName: 'leaveDate',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'employee_experiense',
            name: 'Стаж',
            fieldName: 'experiense',
            minWidth: 100,
            maxWidth: 100,
        },
        {
            key: 'employee_editButtons',
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

const getUtilizationColor = (utilization: number): string => {
    const utilStyle =
        utilization < 0.6
            ? 'employee-utilization-red'
            : 0.6 <= utilization && utilization < 0.8
            ? 'employee-utilization-yellow'
            : 'employee-utilization-green';
    return utilStyle;
};

const getEmployeeItems = (
    _employees: Employee[],
    editingEmployee: (id: string) => void,
    deletingEmployee: (id: string) => void,
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IEmployeeItem[] => {
    const _items = _employees
        .map(item => {
            return {
                key: item.id,
                fullName: item.fullName,
                email: item.email,
                phone: item.phone,
                utilization: <div className={getUtilizationColor(item.utilization)}>{item.utilization}</div>,
                employedDate: item.employedDate.toLocaleDateString(),
                leaveDate: item.leaveDate?.toLocaleDateString() ? item.leaveDate?.toLocaleDateString() : '',
                experiense: getExperienseString(item.employedDate),
                editBtns: (
                    <div className="h-end">
                        <IconButton
                            title="Изменить"
                            iconProps={{ iconName: 'Edit' }}
                            onClick={() => {
                                editingEmployee(item.id);
                            }}
                        />
                        <IconButton
                            title="Удалить"
                            iconProps={{ iconName: 'Delete', className: 'red' }}
                            onClick={() => {
                                deletingEmployee(item.id);
                            }}
                        />
                    </div>
                ),
            };
        })
        .sort((a, b) => collator.compare(a.fullName, b.fullName))
        .sort((a, b) => (a.leaveDate < b.leaveDate ? -1 : 1));

    return _items;
};

export default EmployeesListComponent;
