import React, { FC, useEffect } from 'react';
import { Spinner } from '@fluentui/react/lib/Spinner';
import LoginFormComponent from 'src/components/Account/LoginFormComponent';

import { connect } from 'react-redux';
import { Label, loadTheme, getTheme } from '@fluentui/react';

import { hasCredentials } from 'src/shared/LocalStorageUtils';

import { lightTheme, darkTheme } from 'src/themes';
import { ILoginProps, mapStateToProps, mapDispatchToProps } from './ILoginProps';

import './loginStyles.css';
import ForgotPasswordComponent from 'src/components/Account/ForgotPasswordComponent';

const LoginContainer: FC<ILoginProps> = (props: ILoginProps) => {
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

    const resetPasswordResultMessage = props.resetPasswordResult
        ? 'Письмо успешно отправлено на почту для восстановления пароля.'
        : 'Не удалось отправить письмо на почту для восстановления пароля.';

    return (
        <div className="ms-Grid" dir="ltr">
            <div className="ms-Grid-row center" style={{ flexDirection: 'column' }}>
                <LoginFormComponent
                    hasCredentials={hasCredentials()}
                    login={props.login}
                    invertedTheme={props.invertedTheme}
                />
                <ForgotPasswordComponent resetPassword={props.resetPassword} />
            </div>

            {props.isLoading && (
                <div className="ms-Grid-row center">
                    <Label>Loading</Label>
                    <Spinner labelPosition="left" />
                </div>
            )}

            {!props.loginResult && (
                <div className="ms-Grid-row center">
                    <Label>Неверный логин и/или пароль</Label>
                </div>
            )}

            {props.resetPasswordResult !== null && (
                <div className="ms-Grid-row center">
                    <Label> {resetPasswordResultMessage} </Label>
                </div>
            )}
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
