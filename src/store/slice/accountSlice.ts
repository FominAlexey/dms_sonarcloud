import { getUserId, getUserName, setUserInfo, removeUserInfo } from 'src/shared/LocalStorageUtils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserInfo, UserInfo, resetUserPassword, ResetPassword, changeUserPassword } from 'src/DAL/Account';
import { AxiosResponse } from 'axios';

export interface AccountState {
    userId: string;
    userName: string;
    loading: boolean;
    loginResult: boolean;
    resetPasswordResult: boolean | null;
    changePasswordResult: boolean;
}

type LoginInfoType = {
    username: string;
    password: string;
};

export type PasswordInfoType = {
    id: string;
    password: string;
    self: boolean | null;
};

const InitialAccountState: AccountState = {
    userId: getUserId(),
    userName: getUserName(),
    loading: false,
    loginResult: true,
    resetPasswordResult: null,
    changePasswordResult: true,
};

export const loginAsyncThunk = createAsyncThunk('account/login', async (loginInfo: LoginInfoType) => {
    const response: AxiosResponse<UserInfo> = await getUserInfo(loginInfo.username, loginInfo.password);
    const userInfo: UserInfo = response.data;
    userInfo.password = loginInfo.password;
    setUserInfo(userInfo);
    return {
        userId: userInfo ? userInfo.id : '',
        userName: userInfo ? userInfo.fullName : '',
        roles: userInfo ? userInfo.roles : [],
    };
});

export const resetUserPasswordAsyncThunk = createAsyncThunk(
    'account/resetUserPassword',
    async (email: string): Promise<boolean> => {
        await resetUserPassword(email);
        return true;
    },
);

export const changeUserPasswordAsyncThunk = createAsyncThunk(
    'account/changeUserPassword',
    async (resetPassword: ResetPassword): Promise<boolean> => {
        await changeUserPassword(resetPassword);
        return true;
    },
);

const accountSlice = createSlice({
    name: 'account',
    initialState: InitialAccountState,
    reducers: {
        logout(state) {
            removeUserInfo();
            state.userId = '';
            state.userName = '';
        },
    },
    extraReducers: builder => {
        builder
            //#region ------------ Login ----------------------
            .addCase(loginAsyncThunk.pending, state => {
                state.loading = true;
                state.userId = '';
                state.userName = '';
                state.resetPasswordResult = null;
            })
            .addCase(loginAsyncThunk.fulfilled, (state, action) => {
                state.userId = action.payload ? action.payload.userId : '';
                state.userName = action.payload ? action.payload.userName : '';
                state.loading = false;
                state.loginResult = action.payload !== null;
            })
            .addCase(loginAsyncThunk.rejected, state => {
                state.loading = false;
                state.loginResult = false;
            })
            //#endregion ------------------------------------------

            //#region  ------------Reset Password-------------------
            .addCase(resetUserPasswordAsyncThunk.pending, state => {
                state.loading = true;
                state.userId = '';
                state.userName = '';
                state.resetPasswordResult = null;
            })
            .addCase(resetUserPasswordAsyncThunk.fulfilled, state => {
                state.loading = false;
                state.resetPasswordResult = true;
            })
            .addCase(resetUserPasswordAsyncThunk.rejected, state => {
                state.loading = false;
                state.resetPasswordResult = false;
            })
            //#endregion --------------------------------------------

            //#region  ------------Change Password-------------------
            .addCase(changeUserPasswordAsyncThunk.pending, state => {
                state.loading = true;
                state.userId = '';
                state.userName = '';
            })
            .addCase(changeUserPasswordAsyncThunk.fulfilled, state => {
                state.loading = false;
                window.location.href = '/Login';
            })
            .addCase(changeUserPasswordAsyncThunk.rejected, state => {
                state.loading = false;
                state.changePasswordResult = false;
            });
        //#endregion --------------------------------------------
    },
});

export const { logout } = accountSlice.actions;
export default accountSlice.reducer;
