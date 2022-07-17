import React, { FC, useState, useEffect, FormEvent } from 'react';
import { PrimaryButton, Label, Stack, TextField, Image, ImageFit, KeyCodes } from '@fluentui/react';
import { useHistory } from 'react-router-dom';

import logo_light from 'src/Devs_logo_light.svg';
import logo_dark from 'src/Devs_logo_dark.svg';

import { requiredMessage } from 'src/shared/Constants';
import { verticalGapStackTokens } from 'src/shared/Styles';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    hasCredentials: boolean;
    login: (username: string, password: string) => ActionAsyncThunk;
    invertedTheme: boolean;
}

interface ValidationState {
    isValidUsername: boolean;
    isValidPassword: boolean;
}

const LoginFormComponent: FC<Props> = (props: Props) => {
    const history = useHistory();

    // Set initial values
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [password, setPassword] = useState<string | undefined>(undefined);
    const [showValidationError, setShowValidationError] = useState(false);

    const [validation, setValidation] = useState<ValidationState>({
        isValidUsername: false,
        isValidPassword: false,
    });

    // Check credentials
    useEffect(() => {
        if (props.hasCredentials) {
            history.push('/Calendar');
        }
    }, [props.hasCredentials, history]);

    const _onChangeUsername = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setUsername(newValue);
        setValidation({ ...validation, isValidUsername: newValue?.length !== 0 });
    };

    const _onChangePassword = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPassword(newValue);
        setValidation({ ...validation, isValidPassword: newValue?.length !== 0 });
    };

    const _onSubmit = () => {
        if (validation.isValidUsername && validation.isValidPassword) {
            props.login(username!.trim(), password!);
            setShowValidationError(false);
        } else {
            setShowValidationError(true);
        }
    };

    const _onKeyPress = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        // Submit on Enter key
        if (event.charCode === KeyCodes.enter) {
            _onSubmit();
        }
        // Block Space key
        if (event.charCode === KeyCodes.space) {
            event.preventDefault();
        }
    };

    return (
        <Stack className="login-main-stack" tokens={verticalGapStackTokens}>
            <Image
                src={props.invertedTheme ? logo_light : logo_dark}
                height="35px"
                imageFit={ImageFit.contain}
                alt="Devs logo"
            />
            <Label className="login-header">Добро пожаловать в Devs Management</Label>
            <TextField
                label="Email"
                required
                value={username}
                onChange={_onChangeUsername}
                onKeyPress={_onKeyPress}
                errorMessage={showValidationError && !validation.isValidUsername ? requiredMessage : undefined}
            />
            <TextField
                label="Пароль"
                required
                type="password"
                value={password}
                onChange={_onChangePassword}
                onKeyPress={_onKeyPress}
                errorMessage={showValidationError && !validation.isValidPassword ? requiredMessage : undefined}
            />
            <PrimaryButton text="Войти" onClick={() => _onSubmit()} />
        </Stack>
    );
};

export default LoginFormComponent;
