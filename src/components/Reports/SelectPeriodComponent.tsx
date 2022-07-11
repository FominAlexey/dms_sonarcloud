import React, { FC, useState } from 'react';
import { DatePicker, DayOfWeek, Label } from '@fluentui/react';
import { useHistory } from 'react-router-dom';
import { getDateFromLocaleString, getISOString, DAY_PICKER_STRINGS } from 'src/shared/DateUtils';
import queryString from 'query-string';

interface Props {
    fromDate: Date | undefined;
    toDate: Date | undefined;
}

const SelectPeriodComponent: FC<Props> = (props: Props) => {
    const history = useHistory();

    const [isValidPeriod, setIsValidPeriod] = useState<boolean>(true);

    const _onChangeStartDate = (date: Date | null | undefined) => {
        if (date) {
            if (props.toDate !== undefined && date > props.toDate) {
                setIsValidPeriod(false);
            } else {
                setIsValidPeriod(true);
            }

            const queryParams = queryString.parse(history.location.search);
            queryParams.fromDate = getISOString(date);
            history.push(history.location.pathname + '?' + queryString.stringify(queryParams));
        }
    };

    const _onChangeEndDate = (date: Date | null | undefined) => {
        if (date) {
            if (props.fromDate !== undefined && date < props.fromDate) {
                setIsValidPeriod(false);
            } else {
                setIsValidPeriod(true);
            }

            const queryParams = queryString.parse(history.location.search);
            queryParams.toDate = getISOString(date);
            history.push(history.location.pathname + '?' + queryString.stringify(queryParams));
        }
    };

    return (
        <div>
            <div className="h-start">
                <DatePicker
                    label="С"
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date.toLocaleDateString()}
                    value={props.fromDate}
                    onSelectDate={_onChangeStartDate}
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    placeholder={!props.fromDate ? 'Выберите дату' : undefined}
                    strings={DAY_PICKER_STRINGS}
                />
                <DatePicker
                    label="По"
                    firstDayOfWeek={DayOfWeek.Monday}
                    formatDate={(date?) => date.toLocaleDateString()}
                    value={props.toDate}
                    onSelectDate={_onChangeEndDate}
                    className="ml-20"
                    allowTextInput={true}
                    parseDateFromString={string => getDateFromLocaleString(string)}
                    placeholder={!props.fromDate ? 'Выберите дату' : undefined}
                    strings={DAY_PICKER_STRINGS}
                />
            </div>

            {!isValidPeriod && <Label style={{ color: '#A4262C' }}>Выбран некорректный период</Label>}
        </div>
    );
};

export default SelectPeriodComponent;
