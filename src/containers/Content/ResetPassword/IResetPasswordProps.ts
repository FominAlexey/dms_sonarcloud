import { ResetPassword } from 'src/DAL/Account';
import { ActionAsyncThunk } from 'src/shared/Common';
import { changeUserPasswordAsyncThunk } from 'src/store/slice/accountSlice';
import { AppState } from 'src/store/slice';

export interface IResetPasswordProps {
    invertedTheme: boolean;
    changePasswordResult: boolean;
    isLoading: boolean;
    changePassword: (resetPasswordArg: ResetPassword) => ActionAsyncThunk<boolean, ResetPassword>;
}

export const mapStateToProps = (store: AppState) => {
    return {
        isLoading: store.account.loading,
        invertedTheme: store.theme.inverted,
        changePasswordResult: store.account.changePasswordResult,
    };
};

export const mapDispatchToProps = {
    changePassword: (resetPasswordArg: ResetPassword) => changeUserPasswordAsyncThunk(resetPasswordArg),
};
