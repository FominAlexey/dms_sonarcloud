import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Toggle } from '@fluentui/react';
import queryString from 'query-string';

interface Props {
    isDetail: boolean | undefined;
}

const DetailToggleComponent: FC<Props> = ({ isDetail }: Props) => {
    const history = useHistory();

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const _onToggleChanged = (event: React.MouseEvent<HTMLElement, MouseEvent>, checked?: boolean | undefined) => {
        const queryParams = queryString.parse(history.location.search);
        queryParams.isDetail = checked ? 'true' : 'false';
        history.push(history.location.pathname + '?' + queryString.stringify(queryParams));
    };

    return <Toggle label="Подробный отчет" onChange={_onToggleChanged} checked={isDetail} />;
};

export default DetailToggleComponent;
