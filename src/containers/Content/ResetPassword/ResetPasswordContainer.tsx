import React, { FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IResetPasswordProps, mapStateToProps, mapDispatchToProps } from './IResetPasswordProps';
import { connect } from 'react-redux';
import { darkTheme, lightTheme } from 'src/themes';
import { getTheme, loadTheme, Label, Spinner } from '@fluentui/react';
import ResetPasswordComponent from 'src/components/Account/ResetPasswordComponent';

const ResetPasswordContainer: FC<IResetPasswordProps> = (props: IResetPasswordProps) => {
    // Get params from url
    const params = new URLSearchParams(useLocation().search);
    const employeeId = params.get('employeeId');
    const token = params.get('token');

    // Set theme
    useEffect(() => {
        if (props.invertedTheme) {
            loadTheme(darkTheme);
        } else {
            loadTheme(lightTheme);
        }
        const backgroundColor = getTheme().palette.white;
        document.getElementById('body')?.setAttribute('style', `background-color: ${backgroundColor}`);
    }, [props.invertedTheme]);

    return (
        <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row center">
                <ResetPasswordComponent
                    employeeId={employeeId}
                    token={token}
                    invertedTheme={props.invertedTheme}
                    changePassword={props.changePassword}
                />
            </div>

            {props.isLoading && (
                <div className="ms-Grid-row center">
                    <Label>Loading</Label>
                    <Spinner labelPosition="left" />
                </div>
            )}

            {!props.changePasswordResult && (
                <div className="ms-Grid-row center">
                    <Label>Не удалось изменить пароль.</Label>
                </div>
            )}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPasswordContainer);
