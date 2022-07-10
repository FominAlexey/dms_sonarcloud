import React, { FC, useState } from 'react';
import { Stack, TextField, ColorPicker, IColor } from '@fluentui/react';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { requiredMessage } from 'src/shared/Constants';
import { RgbReg } from 'src/shared/RegExpressions';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    eventLogCategory: EventLogCategory;
    posting: boolean;
    saveEventLogCategory: (eventLogCategory: EventLogCategory) => ActionAsyncThunk<boolean, EventLogCategory>;
    clearEventLogCategory: () => void;
}

interface validationState {
    isValidTitle: boolean;
    isValidColor: boolean;
}

const EventLogCategoryEditComponent: FC<Props> = (props: Props) => {
    // Set initial values
    const [eventLogCategoryTitle, setEventLogCategoryTitle] = useState<string | undefined>(
        props.eventLogCategory.title,
    );
    const [eventLogCategoryColor, setEventLogCategoryColor] = useState<string | undefined>(
        props.eventLogCategory.color,
    );
    const [eventLogCategoryLimit, setEventLogCategoryLimit] = useState<number>(props.eventLogCategory.limit);

    const [validation, setValidation] = useState<validationState>({
        isValidTitle: props.eventLogCategory.title ? props.eventLogCategory.title.trim().length !== 0 : false,
        isValidColor: props.eventLogCategory.color ? RgbReg.test(props.eventLogCategory.color) : false,
    });

    const _onCloseDialog = () => {
        props.clearEventLogCategory();
    };

    const _onSave = () => {
        const newEventLogCategory: EventLogCategory = {
            id: props.eventLogCategory.id,
            title: eventLogCategoryTitle!.trim(),
            color: eventLogCategoryColor!.trim().toUpperCase(),
            limit: eventLogCategoryLimit,
        };
        props.saveEventLogCategory(newEventLogCategory);
    };

    const _onChangeTitle = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setEventLogCategoryTitle(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidTitle: newValue.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidTitle: false });
        }
    };

    const _onchangeLimit = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) {
            setEventLogCategoryLimit(Number.parseInt(newValue));
        } else {
            setEventLogCategoryLimit(0);
        }
    };

    const _onKeyPressLimit = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key < '0' || event.key > '9') {
            event.preventDefault();
        }
    };

    const _onChangeColorPicker = (event: React.SyntheticEvent<HTMLElement>, color: IColor) => {
        setEventLogCategoryColor(color.str);

        if (!validation.isValidColor) setValidation({ ...validation, isValidColor: true });
    };

    const isValidForm = validation.isValidTitle && validation.isValidColor;

    return (
        <EditDialog
            hidden={false}
            disabledSaveBtn={!isValidForm}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <TextField
                    required
                    label="Наименование"
                    value={eventLogCategoryTitle}
                    onChange={_onChangeTitle}
                    errorMessage={validation.isValidTitle ? undefined : requiredMessage}
                />

                <TextField
                    required
                    disabled
                    label="Цвет"
                    value={eventLogCategoryColor}
                    errorMessage={validation.isValidColor ? undefined : requiredMessage}
                />
                <ColorPicker
                    color={eventLogCategoryColor || '#ff0000'}
                    alphaType={'none'}
                    showPreview={true}
                    onChange={_onChangeColorPicker}
                />

                <TextField
                    required
                    label="Годовой лимит (дни)"
                    value={eventLogCategoryLimit.toString()}
                    onChange={_onchangeLimit}
                    onKeyPress={_onKeyPressLimit}
                    description="0 - лимит не задан"
                />
            </Stack>
        </EditDialog>
    );
};

export default EventLogCategoryEditComponent;
