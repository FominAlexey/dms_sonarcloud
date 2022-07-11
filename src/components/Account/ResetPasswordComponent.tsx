import React, { FC, useState } from 'react';

import { Stack, Image, ImageFit, Label, TextField, PrimaryButton } from '@fluentui/react';
import { verticalGapStackTokens } from 'src/shared/Styles';

import logo_light from 'src/Devs_logo_light.svg';
import logo_dark from 'src/Devs_logo_dark.svg';

import { ResetPassword } from 'src/DAL/Account';
import { ActionAsyncThunk } from 'src/shared/Common';
import { PasswordReg } from 'src/shared/RegExpressions';

interface Props {
    invertedTheme: boolean;
    employeeId: string | null;
    token: string | null;
    changePassword: (resetPasswordArg: ResetPassword) => ActionAsyncThunk<boolean, ResetPassword>;
}

const ResetPasswordComponent: FC<Props> = (props: Props) => {
    const [password, setPassword] = useState<string | undefined>('');
    const [validation, setValidation] = useState<boolean>(password ? PasswordReg.test(password) : false);

    const _onChangePassword = (newValue?: string) => {
        setPassword(newValue);

        if (newValue) {
            setValidation(PasswordReg.test(newValue));
        } else {
            setValidation(false);
        }
    };

    const _onClickChangePassword = () => {
        const resetPassword: ResetPassword = {
            employeeId: props.employeeId,
            token: props.token,
            newPassword: password,
        };

        props.changePassword(resetPassword);
    };

    const errorPasswordMessage =
        'Пароль должен содержать не менее 8 символов и включать только буквы латинского алфавита, цифры или специальные символы !@#$%^&*';

    return (
        <Stack className="login-main-stack" tokens={verticalGapStackTokens}>
            <Image
                src={props.invertedTheme ? logo_light : logo_dark}
                height="35px"
                imageFit={ImageFit.contain}
                alt="Devs logo"
            />

            <Label className="login-header">Страница для изменения пароля</Label>

            <TextField
                label="Пароль"
                required
                type="password"
                value={password}
                onChange={_onChangePassword}
                errorMessage={validation ? undefined : errorPasswordMessage}
            />

            <PrimaryButton text="Изменить пароль" disabled={!validation} onClick={() => _onClickChangePassword()} />
        </Stack>
    );
};

export default ResetPasswordComponent;
