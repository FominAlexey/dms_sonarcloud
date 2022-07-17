import React, { FC, FormEvent, useEffect, useState } from 'react';
import {
    Stack,
    TextField,
    Checkbox,
    DatePicker,
    DayOfWeek,
    ComboBox,
    IComboBoxOption,
    IComboBox,
} from '@fluentui/react';
import { EventLogEdit } from 'src/DAL/Calendar';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { toUTC, getDateFromLocaleString, DAY_PICKER_STRINGS } from 'src/shared/DateUtils';
import { requiredMessage, CREATED } from 'src/shared/Constants';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    userId: string;
    eventLog: EventLogEdit;
    saveEventLog: (eventLog: EventLogEdit) => ActionAsyncThunk<boolean, EventLogEdit>;
    clearEventLog: () => void;
    eventLogCategories: EventLogCategory[] | null;
    posting: boolean;
}

interface ValidationState {
    isValidEventCategoryId: boolean;
    isValidReason: boolean;
    isValidDates: boolean;
}

const EventLogEditComponent: FC<Props> = (props: Props) => {
    // Initial values
    const [eventLogCategoryId, setEventLogCategoryId] = useState<string>(props.eventLog.eventCategoryId);
    const [eventLogReason, setEventLogReason] = useState<string | undefined>(props.eventLog.reason);
    const [eventLogStartDate, setEventLogStartDate] = useState<Date>(props.eventLog.startDate);
    const [eventLogEndDate, setEventLogEndDate] = useState<Date | null>(props.eventLog.endDate || new Date());
    const [eventLogHasEndDate, setEventLogHasEndDate] = useState<boolean>(props.eventLog.endDate ? true : false);

    const [EventCategoriesOptions, setEventCategoriesOptions] = useState<IComboBoxOption[]>();

    const [validation, setValidation] = useState<ValidationState>({
        isValidEventCategoryId: props.eventLog.eventCategoryId !== '',
        isValidReason: props.eventLog.reason ? props.eventLog.reason.trim().length !== 0 : false,
        isValidDates: props.eventLog.endDate
            ? props.eventLog.startDate < props.eventLog.endDate
            : props.eventLog?.startDate !== null,
    });

    const errorDatesMessage = 'Указан неверный период';

    // Set EventLogCategories list options
    useEffect(() => {
        const options: IComboBoxOption[] = props.eventLogCategories!.map(item => {
            return {
                key: item.id,
                text: item.title,
            } as IComboBoxOption;
        });
        setEventCategoriesOptions(options);
    }, [props.eventLogCategories]);

    const _onCloseDialog = () => {
        props.clearEventLog();
    };

    const _onSave = () => {
        const newEventLog: EventLogEdit = {
            id: props.eventLog.id,
            employeeId: props.userId,
            eventCategoryId: eventLogCategoryId,
            reason: eventLogReason!.trim(),
            startDate: toUTC(eventLogStartDate),
            endDate: eventLogHasEndDate && eventLogEndDate ? toUTC(eventLogEndDate) : null,
            approvalStatusId: CREATED,
            approvalDate: null,
            currentUser: true,
        };
        props.saveEventLog(newEventLog);
    };

    const _onChangeCategory = (event: FormEvent<IComboBox>,
        option?: IComboBoxOption,
    ): void => {
        if (option) {
            setEventLogCategoryId(option.key.toString());
            setValidation({ ...validation, isValidEventCategoryId: true });
        }
    };

    const _onChangeReason = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setEventLogReason(newValue);
        if (newValue) {
            setValidation({ ...validation, isValidReason: newValue.trim().length !== 0 });
        } else {
            setValidation({ ...validation, isValidReason: false });
        }
    };

    const _onChangeStartDate = (date: Date | null | undefined) => {
        date ? setEventLogStartDate(date) : setEventLogStartDate(new Date());
        if (eventLogHasEndDate) setValidation({ ...validation, isValidDates: toUTC(date!) < toUTC(eventLogEndDate!) });
    };

    const _onChangeEndDate = (date: Date | null | undefined) => {
        date ? setEventLogEndDate(date) : setEventLogEndDate(null);
        setValidation({ ...validation, isValidDates: toUTC(eventLogStartDate) < toUTC(date!) });
    };

    const _onChangeHasEndDate = (
        ev?: FormEvent<HTMLInputElement | HTMLElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        setEventLogEndDate(new Date());
        if (!checked) {
            setEventLogHasEndDate(false);
            setValidation({ ...validation, isValidDates: true });
        } else {
            setEventLogHasEndDate(checked);
            setValidation({ ...validation, isValidDates: toUTC(eventLogStartDate) < toUTC(new Date()) });
        }
    };

    const isValidForm = validation.isValidEventCategoryId && validation.isValidReason && validation.isValidDates;

    return (
        <EditDialog
            hidden={false}
            disabledSaveBtn={!isValidForm}
            saveMethod={() => _onSave()}
            closeMethod={() => _onCloseDialog()}
            posting={props.posting}
        >
            <Stack tokens={verticalGapStackTokens}>
                <ComboBox
                    required
                    label="Тип события"
                    options={EventCategoriesOptions}
                    selectedKey={eventLogCategoryId}
                    onChange={_onChangeCategory}
                    errorMessage={validation.isValidEventCategoryId ? undefined : requiredMessage}
                />
                <TextField
                    required
                    multiline
                    label="Причина"
                    value={eventLogReason}
                    onChange={_onChangeReason}
                    errorMessage={validation.isValidReason ? undefined : requiredMessage}
                />
                <Checkbox label="Несколько дней" onChange={_onChangeHasEndDate} checked={eventLogHasEndDate} />
                <DatePicker
                    label="Дата начала"
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date!.toLocaleDateString()}
                    value={eventLogStartDate}
                    onSelectDate={_onChangeStartDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    strings={DAY_PICKER_STRINGS}
                />
                <DatePicker
                    label="Дата окончания"
                    disabled={!eventLogHasEndDate}
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date!.toLocaleDateString()}
                    value={eventLogEndDate || new Date()}
                    onSelectDate={_onChangeEndDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    strings={DAY_PICKER_STRINGS}
                    textField={!validation.isValidDates ? { errorMessage: errorDatesMessage } : undefined}
                />
            </Stack>
        </EditDialog>
    );
};

export default EventLogEditComponent;
