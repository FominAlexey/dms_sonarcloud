import React, { FC, FormEvent, useState } from 'react';
import { Stack, TextField } from '@fluentui/react';
import EditDialog from 'src/components/EditDialog';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    posting: boolean;
    sendFeedback: (message: string) => ActionAsyncThunk<boolean, string>;
    clearFeedback: () => void;
}

const FeedbackEditComponent: FC<Props> = (props: Props) => {
    // Set initial values
    const [feedbackMessage, setFeedbackMessage] = useState<string | undefined>(undefined);
    const [isValidMessage, setIsValidMessage] = useState(false);

    const _onFeedbackMessageChanged = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string | undefined,
    ) => {
        setFeedbackMessage(newValue);

        if (newValue) {
            setIsValidMessage(newValue?.trim().length !== 0);
        } else {
            setIsValidMessage(false);
        }
    };

    const _onSave = () => {
        props.sendFeedback(feedbackMessage!.trim());
    };

    const _onCloseDialog = () => {
        props.clearFeedback();
    };

    return (
        <EditDialog
            disabledSaveBtn={!isValidMessage}
            hidden={false}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack>
                <TextField label="Сообщение" multiline value={feedbackMessage} onChange={_onFeedbackMessageChanged} />
            </Stack>
        </EditDialog>
    );
};

export default FeedbackEditComponent;
