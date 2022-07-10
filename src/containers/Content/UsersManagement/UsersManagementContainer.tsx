import React, { FC, useEffect } from 'react';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import UsersManagementComponent from 'src/components/UsersManagement/UsersManagementComponent';
import UsersManagementEditComponent from 'src/components/UsersManagement/UsersManagementEditComponent';

import { connect } from 'react-redux';

import { Label } from '@fluentui/react';
import { IUsersManagementProps, mapStateToProps, mapDispatchToProps } from './IUsersManagementProps';

const UsersManagementContainer: FC<IUsersManagementProps> = (props: IUsersManagementProps) => {
    useEffect(() => {
        if (props.needToUpdateEmployees) props.getEmployees();
    }, [props.getEmployees, props.needToUpdateEmployees]);

    return (
        <ContentContainer title="Управление пользователями" showContent={props.employees !== null}>
            <UsersManagementComponent
                data={props.employees || []}
                isLoading={props.employeesLoading}
                editingEmployee={props.editingEmployee}
            />

            {!props.employeesLoading && props.employees?.length === 0 && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {props.isEmployeesEditing && props.currentEmployee && (
                <UsersManagementEditComponent
                    employee={props.currentEmployee}
                    patchEmployee={props.patchEmployee}
                    clearEmployee={props.clearEmployee}
                    setUserPassword={props.setUserPassword}
                    posting={props.posting}
                />
            )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersManagementContainer);
