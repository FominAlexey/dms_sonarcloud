import React, { useEffect, useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

import queryString from 'query-string';
import { ISearchProps } from './shared/Common';
import { isEmployee, isManager, isAdmin } from './shared/LocalStorageUtils';
import { EMPLOYEE, MANAGER, ADMINISTRATOR } from './shared/Constants';

const ContentRoute = ({ component, role, ...rest }: any) => {
    const [searchProps, setSearchProps] = useState<ISearchProps>({
        fromDate: undefined,
        toDate: undefined,
        isDetail: undefined,
    });

    useEffect(() => {
        // Get query params from location
        const queryParams = queryString.parse(rest.location.search);

        let _fromDate: Date | undefined = undefined;
        let _toDate: Date | undefined = undefined;
        let _isDetail: boolean | undefined = undefined;

        // Parse dates
        if (queryParams.fromDate && !isNaN(Date.parse(queryParams.fromDate.toString()))) {
            _fromDate = new Date(queryParams.fromDate.toString());
        }

        if (queryParams.toDate && !isNaN(Date.parse(queryParams.toDate.toString()))) {
            _toDate = new Date(queryParams.toDate.toString());
        }

        if (queryParams.isDetail) {
            _isDetail = queryParams.isDetail === 'true' ? true : false;
        }

        setSearchProps({ fromDate: _fromDate, toDate: _toDate, isDetail: _isDetail });
    }, [rest.location.search]);

    const routeComponent = (props: any) => {
        if (
            (role === EMPLOYEE && isEmployee()) ||
            (role === MANAGER && isManager()) ||
            (role === ADMINISTRATOR && isAdmin()) ||
            role === undefined
        ) {
            return React.createElement(component, { ...props, searchProps });
        } else {
            return <Redirect to={{ pathname: '/Calendar' }} />;
        }
    };

    return <Route {...rest} render={routeComponent} />;
};

export default ContentRoute;
