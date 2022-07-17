import React, { FC, FormEvent, useState } from 'react';
import { Dialog, DialogType, DialogFooter, Stack, DefaultButton, PrimaryButton, TextField } from '@fluentui/react';
import { verticalGapStackTokens } from 'src/shared/Styles';
import { ActionAsyncThunk } from 'src/shared/Common';
import { EmailReg } from 'src/shared/RegExpressions';

interface Props {
    resetPassword: (email: string) => ActionAsyncThunk<boolean, string>;
}

const ForgotPasswordComponent: FC<Props> = (props: Props) => {
    const [email, setEmail] = useState<string | undefined>('');
    const [isShowForgotPassword, setIsShowForgotPassword] = useState<boolean>(false);

    const [validation, setValidation] = useState<boolean>(email ? EmailReg.test(email) : false);

    const _onChangeEmail = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setEmail(newValue);

        if (newValue) {
            setValidation(EmailReg.test(newValue));
        } else {
            setValidation(false);
        }
    };

    const clearState = () => {
        setEmail('');
        setValidation(false);
        setIsShowForgotPassword(false);
    };

    const _onResetPassword = () => {
        if (email) props.resetPassword(email);

        clearState();
    };

    const _onClose = () => {
        clearState();
    };

    return (
        <Stack className="login-main-stack" tokens={verticalGapStackTokens}>
            <PrimaryButton text="Забыли пароль?" onClick={() => setIsShowForgotPassword(true)} />

            {isShowForgotPassword && (
                <Dialog
                    hidden={false}
                    dialogContentProps={{
                        type: DialogType.normal,
                        title: 'Введите email для сброса пароля',
                    }}
                    modalProps={{
                        allowTouchBodyScroll: true,
                    }}
                >
                    <TextField
                        required
                        label="Email"
                        value={email}
                        onChange={_onChangeEmail}
                        errorMessage={validation ? undefined : 'Введите корректный email'}
                    />

                    <DialogFooter>
                        <DefaultButton text="Отмена" onClick={() => _onClose()} />
                        <PrimaryButton text="Продолжить" onClick={() => _onResetPassword()} disabled={!validation} />
                    </DialogFooter>
                </Dialog>
            )}
        </Stack>
    );
};

export default ForgotPasswordComponent;
