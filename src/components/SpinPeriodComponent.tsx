import React, { FC } from 'react';
import { ActionButton, IconButton } from '@fluentui/react';
import { useHistory } from 'react-router-dom';
import { getISOString } from 'src/shared/DateUtils';
import queryString from 'query-string';

interface Props {
    fromDate: Date | undefined;
    periodLength: number;
}

const SpinPeriodComponent: FC<Props> = (props: Props) => {
    const history = useHistory();

    const _onChangeStartDate = (date: Date | null | undefined) => {
        if (date) {
            const queryParams = queryString.parse(history.location.search);
            queryParams.fromDate = getISOString(date);
            history.push(history.location.pathname + '?' + queryString.stringify(queryParams));
        }
    };

    return (
        <div className="h-end">
            <IconButton
                title="Назад"
                iconProps={{ iconName: 'ChevronLeft' }}
                onClick={() => {
                    _onChangeStartDate(
                        props.fromDate
                            ? new Date(props.fromDate?.setDate(props.fromDate?.getDate() - props.periodLength))
                            : undefined,
                    );
                }}
            />
            <ActionButton
                text="Текущий период"
                iconProps={{ iconName: 'Calendar' }}
                onClick={() => {
                    _onChangeStartDate(new Date());
                }}
            />
            <IconButton
                title="Вперед"
                iconProps={{ iconName: 'ChevronRight' }}
                onClick={() => {
                    _onChangeStartDate(
                        props.fromDate
                            ? new Date(props.fromDate?.setDate(props.fromDate?.getDate() + props.periodLength))
                            : undefined,
                    );
                }}
            />
        </div>
    );
};

export default SpinPeriodComponent;
