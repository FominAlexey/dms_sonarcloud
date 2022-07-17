import React, { FC, FormEvent, useEffect, useState } from 'react';
import {
    Stack,
    TextField,
    ComboBox,
    IComboBoxOption,
    DatePicker,
    DayOfWeek,
    Checkbox,
    IComboBox,
} from '@fluentui/react';
import { TimeTrackingEdit } from 'src/DAL/TimeTracking';
import { toUTC, getDateFromLocaleString, DAY_PICKER_STRINGS } from 'src/shared/DateUtils';
import { requiredMessage, zeroGuid } from 'src/shared/Constants';
import { verticalGapStackTokens } from 'src/shared/Styles';
import EditDialog from 'src/components/EditDialog';
import { Project } from 'src/DAL/Projects';
import { TaskCategory } from 'src/DAL/Dictionaries';
import { ActionAsyncThunk } from 'src/shared/Common';

interface Props {
    timeTracking: TimeTrackingEdit;
    projects: Project[];
    taskCategories: TaskCategory[];
    posting: boolean;
    isDisabled: boolean;

    saveTimeTracking: (timeTracking: TimeTrackingEdit) => ActionAsyncThunk<boolean, TimeTrackingEdit>;
    clearTimeTracking: () => void;
}

interface ValidationState {
    isValidProject: boolean;
    isValidTaskCategory: boolean;
    isValidTimeSpent: boolean;
    isValidTaskName: boolean;
}

const TimeTrackingEditComponent: FC<Props> = (props: Props) => {
    // Set initial values
    const [timeTrackingProjectId, setTimeTrackingProjectId] = useState<string>(props.timeTracking.projectId);
    const [timeTrackingTaskCategoryId, setTimeTrackingTaskCategoryId] = useState<string>(
        props.timeTracking.taskCategoryId,
    );
    const [timeTrackingStartDate, setTimeTrackingStartDate] = useState<Date>(props.timeTracking.startDate);
    const [timeTrackingTimeSpent, setTimeTrackingTimeSpent] = useState<number>(props.timeTracking.timeSpent);

    const [taskCategoriesOptions, setTaskCategoriesOptions] = useState<IComboBoxOption[]>([]);
    const [projectsOptions, setProjectsOptions] = useState<IComboBoxOption[]>([]);

    const [timeTrackingBillable, setIsBillable] = useState<boolean>(props.timeTracking.billable);

    const [validation, setValidation] = useState<ValidationState>({
        isValidProject: props.timeTracking.projectId !== zeroGuid,
        isValidTaskCategory: props.timeTracking.taskCategoryId !== zeroGuid,
        isValidTimeSpent: props.timeTracking.timeSpent !== 0,
        isValidTaskName: props.timeTracking.taskName != '',
    });

    const [timeTrackingTaskNumber, setTaskNumber] = useState<string>(props.timeTracking.taskNumber);
    const [timeTrackingTaskName, setTaskName] = useState<string>(props.timeTracking.taskName);
    const [timeTrackingTaskDescription, setTaskDescription] = useState<string>(props.timeTracking.taskDescription);
    const [timeTrackingTaskIsDone, setTaskIsDone] = useState<boolean>(props.timeTracking.taskIsDone);

    // Set projects list options
    useEffect(() => {
        const options: IComboBoxOption[] = props.projects.map(item => {
            return {
                key: item.id,
                text: item.title,
            } as IComboBoxOption;
        });
        setProjectsOptions(options);
    }, [props.projects]);

    // Set taskCategories list options
    useEffect(() => {
        const options: IComboBoxOption[] = props.taskCategories.map(item => {
            return {
                key: item.id,
                text: item.name,
            } as IComboBoxOption;
        });
        setTaskCategoriesOptions(options);
    }, [props.taskCategories]);

    const _onCloseDialog = () => {
        props.clearTimeTracking();
    };

    const _onSave = () => {
        const newTimeTracking: TimeTrackingEdit = {
            id: props.timeTracking.id,
            projectId: timeTrackingProjectId,
            taskCategoryId: timeTrackingTaskCategoryId,
            startDate: toUTC(timeTrackingStartDate),
            timeSpent: timeTrackingTimeSpent,
            billable: timeTrackingBillable,
            taskNumber: timeTrackingTaskNumber,
            taskName: timeTrackingTaskName,
            taskDescription: timeTrackingTaskDescription,
            taskIsDone: timeTrackingTaskIsDone,
        };
        props.saveTimeTracking(newTimeTracking);
    };

    const _onChangeProject = (event: FormEvent<IComboBox>, option?: IComboBoxOption | undefined, index?: number | undefined, value?: string | undefined
    ): void => {
        if (option) {
            setTimeTrackingProjectId(option.key.toString());
            setValidation({ ...validation, isValidProject: true });
        }
    };

    const _onChangeTaskCategory = (
        event: FormEvent<IComboBox>,
        option?: IComboBoxOption | undefined,
        index?: number | undefined,
        value?: string | undefined,
    ): void => {
        if (option) {
            setTimeTrackingTaskCategoryId(option.key.toString());
            setValidation({ ...validation, isValidTaskCategory: true });
        }
    };

    const _onChangeStartDate = (date: Date | null | undefined) => {
        date ? setTimeTrackingStartDate(date) : setTimeTrackingStartDate(new Date());
    };

    const _onChangeTimeSpent = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setTimeTrackingTimeSpent(Number.parseInt(newValue!) || 0);
        setValidation({ ...validation, isValidTimeSpent: newValue?.toString() !== '0' });
    };

    const _onKeyPressTimeSpent = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (event.key < '0' || event.key > '9' || timeTrackingTimeSpent > 24) {
            event.preventDefault();
        }
    };

    const _onChangeBillable = (
        ev?: FormEvent<HTMLInputElement | HTMLElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        if (!checked) {
            setIsBillable(false);
        } else {
            setIsBillable(true);
        }
    };

    const _onChangeTaskIsDone = (
        ev?: FormEvent<HTMLInputElement | HTMLElement> | undefined,
        checked?: boolean | undefined,
    ) => {
        if (!checked) {
            setTaskIsDone(false);
        } else {
            setTaskIsDone(true);
        }
    };

    const _onChangeTaskNumber = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) {
            setTaskNumber(newValue);
        } else {
            setTaskNumber('');
        }
    };

    const _onChangeTaskName = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) {
            setTaskName(newValue);
            setValidation({ ...validation, isValidTaskName: true });
        } else {
            setTaskName('');
            setValidation({ ...validation, isValidTaskName: false });
        }
    };

    const _onChangeTaskDescription = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (newValue) {
            setTaskDescription(newValue);
        } else {
            setTaskDescription('');
        }
    };

    const isValidForm =
        validation.isValidProject &&
        validation.isValidTaskCategory &&
        validation.isValidTimeSpent &&
        validation.isValidTaskName;

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
                    label="Проект"
                    placeholder={props.projects.length !== 0 ? 'Выберите задачу' : 'Нет активных задач'}
                    options={projectsOptions}
                    selectedKey={timeTrackingProjectId}
                    disabled={props.isDisabled}
                    onChange={_onChangeProject}
                    errorMessage={validation.isValidProject ? undefined : requiredMessage}
                />

                <ComboBox
                    required
                    label="Категория задачи"
                    placeholder="Выберите категорию задач"
                    options={taskCategoriesOptions}
                    selectedKey={timeTrackingTaskCategoryId}
                    disabled={props.isDisabled}
                    onChange={_onChangeTaskCategory}
                    errorMessage={validation.isValidTaskCategory ? undefined : requiredMessage}
                />

                <TextField
                    label="Номер задачи"
                    value={timeTrackingTaskNumber?.toString()}
                    onChange={_onChangeTaskNumber}
                />

                <TextField
                    required
                    label="Название задачи"
                    value={timeTrackingTaskName?.toString()}
                    onChange={_onChangeTaskName}
                    errorMessage={validation.isValidTaskName ? undefined : requiredMessage}
                />

                <TextField
                    label="Описание задачи"
                    multiline
                    rows={5}
                    resizable={false}
                    value={timeTrackingTaskDescription?.toString()}
                    onChange={_onChangeTaskDescription}
                />

                <Checkbox label={'Задача завершена'} checked={timeTrackingTaskIsDone} onChange={_onChangeTaskIsDone} />

                <DatePicker
                    label="Дата"
                    firstDayOfWeek={DayOfWeek.Monday}
                    value={timeTrackingStartDate}
                    formatDate={(date?) => date!.toLocaleDateString()}
                    onSelectDate={_onChangeStartDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    strings={DAY_PICKER_STRINGS}
                />
                <TextField
                    required
                    label="Количество часов"
                    value={timeTrackingTimeSpent?.toString()}
                    onChange={_onChangeTimeSpent}
                    onKeyPress={_onKeyPressTimeSpent}
                    errorMessage={validation.isValidTimeSpent ? undefined : requiredMessage}
                />

                <Checkbox label={'Оплачивается клиентом'} checked={timeTrackingBillable} onChange={_onChangeBillable} />
            </Stack>
        </EditDialog>
    );
};

export default TimeTrackingEditComponent;
