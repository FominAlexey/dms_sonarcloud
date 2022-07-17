import React, { FormEvent, useState } from 'react';
import { Stack, ComboBox, IComboBoxOption, DatePicker, DayOfWeek, PrimaryButton, IComboBox } from '@fluentui/react';

import { useHistory } from 'react-router-dom';

import { verticalGapStackTokens } from 'src/shared/Styles';
import {
    getStartOfMonth,
    getEndOfMonth,
    getDateFromLocaleString,
    getISOString,
    DAY_PICKER_STRINGS,
} from 'src/shared/DateUtils';

interface ValidationState {
    isValidReportType: boolean;
    isValidStartDate: boolean;
    isValidEndDate: boolean;
}

const reportTypesOptions: IComboBoxOption[] = [
    {
        key: 0,
        text: 'Трудозатраты по проектам',
    },
    {
        key: 1,
        text: 'Трудозатраты по сотрудникам',
    },
    {
        key: 2,
        text: 'Компенсация расходов',
    },
    {
        key: 3,
        text: 'Учет нерабочего времени',
    },
    {
        key: 4,
        text: 'Лимиты нерабочего времени',
    },
];

const SelectReportDialogComponent = () => {
    const history = useHistory();

    const [reportType, setReportType] = useState<string | number | undefined>();
    const [startDate, setStartDate] = useState<Date>(getStartOfMonth(new Date()));
    const [endDate, setEndDate] = useState<Date>(getEndOfMonth(new Date()));
    const [validation, setValidation] = useState<ValidationState>({
        isValidReportType: false,
        isValidStartDate: true,
        isValidEndDate: true,
    });

    const _onChangeReportType = (
        event: FormEvent<IComboBox>,
        option?: IComboBoxOption | undefined,
        index?: number | undefined,
        value?: string | undefined,
    ): void => {
        setReportType(option?.key);
        setValidation({ ...validation, isValidReportType: option !== null });
    };

    const _onChangeStartDate = (date: Date | null | undefined) => {
        if (date) {
            setStartDate(date);
            setValidation({ ...validation, isValidEndDate: date < endDate });
        }
    };

    const _onChangeEndDate = (date: Date | null | undefined) => {
        if (date) {
            setEndDate(date);
            setValidation({ ...validation, isValidEndDate: startDate < date });
        } else {
            setValidation({ ...validation, isValidEndDate: false });
        }
    };

    const _onSubmit = () => {
        switch (reportType) {
            case 0:
                history.push(
                    '/Reports/ProjectsReportOverview?fromDate=' +
                        getISOString(startDate) +
                        '&toDate=' +
                        getISOString(endDate),
                );
                break;
            case 1:
                history.push(
                    '/Reports/TimeReportOverview?fromDate=' +
                        getISOString(startDate) +
                        '&toDate=' +
                        getISOString(endDate),
                );
                break;
            case 2:
                history.push(
                    '/Reports/ExpensesReportOverview?fromDate=' +
                        getISOString(startDate) +
                        '&toDate=' +
                        getISOString(endDate),
                );
                break;
            case 3:
                history.push(
                    '/Reports/EventLogsReportOverview?fromDate=' +
                        getISOString(startDate) +
                        '&toDate=' +
                        getISOString(endDate),
                );
                break;
            case 4:
                history.push('/Reports/UsersLimitsReport');
                break;
        }
    };

    const isValidform = validation.isValidReportType && validation.isValidStartDate && validation.isValidEndDate;

    return (
        <Stack horizontalAlign="center" tokens={verticalGapStackTokens}>
            <ComboBox
                label="Тип отчета"
                selectedKey={reportType}
                options={reportTypesOptions}
                onChange={_onChangeReportType}
            />
            {reportType !== 4 && (
                <DatePicker
                    label="С"
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date!.toLocaleDateString()}
                    value={startDate || new Date()}
                    onSelectDate={_onChangeStartDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    strings={DAY_PICKER_STRINGS}
                />
            )}
            {reportType !== 4 && (
                <DatePicker
                    label="По"
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date!.toLocaleDateString()}
                    value={endDate || new Date()}
                    onSelectDate={_onChangeEndDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    strings={DAY_PICKER_STRINGS}
                />
            )}
            <PrimaryButton text="Сформировать" disabled={!isValidform} onClick={_onSubmit} />
        </Stack>
    );
};

export default SelectReportDialogComponent;
