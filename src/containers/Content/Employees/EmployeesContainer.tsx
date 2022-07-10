import React, { FC, useEffect } from 'react';
import { PrimaryButton, Label } from '@fluentui/react';
import EmployeesListComponent from 'src/components/Employees/EmployeesListComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import EmployeeEditComponent from 'src/components/Employees/EmployeeEditComponent';
import DeleteDialog from 'src/components/DeleteDialog';

import { connect } from 'react-redux';
import { IEmployeesProps, mapStateToProps, mapDispatchToProps } from './IEmployeesProps';

const EmployeesContainer: FC<IEmployeesProps> = (props: IEmployeesProps) => {
    useEffect(() => {
        if (props.needToUpdateEmployees) props.getEmployees(true);
    }, [props.getEmployees, props.needToUpdateEmployees]);

    const employeeId = props.currentEmployee ? props.currentEmployee.id : '';

    return (
        <ContentContainer title="Сотрудники" showContent={props.employees !== null}>
            <PrimaryButton
                text="Добавить сотрудника"
                onClick={() => {
                    props.addingEmployee();
                }}
                className="mt-20"
            />

            <EmployeesListComponent
                data={props.employees || []}
                editingEmployee={props.editingEmployee}
                isLoading={props.employeesLoading}
                deletingEmployee={props.deletingEmployee}
            />

            {!props.employeesLoading && props.employees?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {(props.isAdding || props.isEditing) && props.currentEmployee && (
                <EmployeeEditComponent
                    employee={props.currentEmployee}
                    saveEmployee={props.isAdding ? props.postEmployee : props.putEmployee}
                    clearEmployee={props.clearEmployee}
                    closeManagers={props.employees?.filter(e => e.leaveDate === null) || []}
                    posting={props.posting}
                />
            )}

            {props.isDeleting && props.currentEmployee && (
                <DeleteDialog
                    hidden={!props.isDeleting}
                    deleteMethod={() => props.deleteEmployee(employeeId)}
                    closeMethod={() => props.clearEmployee()}
                />
            )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesContainer);
