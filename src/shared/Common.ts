import { PayloadAction, SerializedError } from '@reduxjs/toolkit';

export interface IListItem {
    key: string;
    title: string | JSX.Element | undefined;
    moreBtn?: JSX.Element;
}

export interface ISearchProps {
    fromDate: Date | undefined;
    toDate: Date | undefined;
    isDetail: boolean | undefined;
}

export interface ErrorObject {
    error?: string;
    message: string;
}

export type NetworkError = {
    Title: string;
    Message: string;
    Error: any;
};

export type ActionAsyncThunk<T = any, A = any> = Promise<
    | PayloadAction<T, string, { arg: A; requestId: string }, never>
    | PayloadAction<
          unknown,
          string,
          { arg: A; requestId: string; aborted: boolean; condition: boolean },
          SerializedError
      >
>;
