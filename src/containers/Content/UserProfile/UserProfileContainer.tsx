import React, { FC, useEffect } from 'react';

import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import UserProfileEditComponent from 'src/components/Account/UserProfileEditComponent';
import UserProfileComponent from 'src/components/Account/UserProfileComponent';

import { connect } from 'react-redux';
import { IUserProfileProps, mapStateToProps, mapDispatchToProps } from './IUserProfileProps';

const UserProfileContainer: FC<IUserProfileProps> = (props: IUserProfileProps) => {
    useEffect(() => {
        props.getEmployee(props.userId);
    }, [props.getEmployee, props.userId, props.needToUpdateEmployee, props.isEditing]);

    return (
        <ContentContainer title="Профиль" showContent={props.currentEmployee !== null}>
            {props.currentEmployee && (
                <UserProfileComponent employee={props.currentEmployee} editingEmployee={props.editingEmployee} />
            )}

            {props.isEditing && props.currentEmployee && (
                <UserProfileEditComponent
                    employee={props.currentEmployee}
                    saveEmployee={props.putEmployee}
                    clearEmployee={props.clearEmployee}
                    posting={props.posting}
                />
            )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer);
