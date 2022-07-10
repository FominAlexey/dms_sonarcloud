import { addingFeedback, sendFeedbackAsyncThunk, clearFeedback } from 'src/store/slice/feedbackSlice';
import { AppState } from 'src/store/slice';
import { ActionAsyncThunk } from 'src/shared/Common';

export interface IFeedBackProps {
    isAdding: boolean;
    posting: boolean;
    addingFeedback: () => void;
    sendFeedback: (message: string) => ActionAsyncThunk<boolean, string>;
    clearFeedback: () => void;
}

export const mapStateToProps = (store: AppState) => {
    return {
        isAdding: store.feedback.isAdding,
        posting: store.feedback.posting,
    };
};

export const mapDispatchToProps = {
    addingFeedback: () => addingFeedback(),
    sendFeedback: (message: string) => sendFeedbackAsyncThunk(message),
    clearFeedback: () => clearFeedback(),
};
