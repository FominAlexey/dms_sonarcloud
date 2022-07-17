import React, { useState, FC, FormEvent } from 'react';
import { TaskCategoryEdit } from 'src/DAL/Dictionaries';
import EditDialog from 'src/components/EditDialog';
import { Stack, TextField } from '@fluentui/react';
import { verticalGapStackTokens } from 'src/shared/Styles';
import { requiredMessage } from 'src/shared/Constants';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    taskCategory: TaskCategoryEdit;
    posting: boolean;
    clearTaskCategory: () => void;
    saveTaskCategory: (taskCategory: TaskCategoryEdit) => ActionAsyncThunk<boolean, TaskCategoryEdit>;
}

const TaskCategoryEditComponent: FC<Props> = (props: Props) => {
    // Set initial values
    const [taskCategoryName, setTaskCategoryName] = useState<string | undefined>(props.taskCategory.name);

    const [validation, setValidation] = useState<boolean>(
        props.taskCategory.name ? props.taskCategory.name.trim().length !== 0 : false,
    );

    const _onCloseDialog = () => {
        props.clearTaskCategory();
    };

    const _onCahngeName = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setTaskCategoryName(newValue);

        if (newValue) {
            setValidation(newValue.trim().length !== 0);
        } else {
            setValidation(false);
        }
    };

    const _onSave = () => {
        const newTaskCategory: TaskCategoryEdit = {
            id: props.taskCategory.id,
            name: taskCategoryName?.trim(),
        };

        props.saveTaskCategory(newTaskCategory);
    };

    return (
        <EditDialog
            hidden={false}
            disabledSaveBtn={!validation}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <TextField
                    label="Наименование"
                    required
                    value={taskCategoryName}
                    onChange={_onCahngeName}
                    errorMessage={validation ? undefined : requiredMessage}
                />
            </Stack>
        </EditDialog>
    );
};

export default TaskCategoryEditComponent;
