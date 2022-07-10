import { AppState } from 'src/store/slice'
import { loginAsyncThunk, resetUserPasswordAsyncThunk } from 'src/store/slice/accountSlice'
import { ActionAsyncThunk } from 'src/shared/Common'

export interface ILoginProps{
    login: (username: string, password: string) => ActionAsyncThunk;
    resetPassword: (email: string) => ActionAsyncThunk<boolean, string>;
    isLoading: boolean;
    loginResult: boolean;
    resetPasswordResult: boolean | null;
    invertedTheme: boolean;
}

export const mapStateToProps = (store: AppState) => {
    return {
        isLoading: store.account.loading,
        loginResult: store.account.loginResult,
        resetPasswordResult: store.account.resetPasswordResult,
        invertedTheme: store.theme.inverted
    }
}

export const mapDispatchToProps = {
    login: (username: string, password: string) => loginAsyncThunk({ username, password }),
    resetPassword: (email: string) => resetUserPasswordAsyncThunk(email)
}