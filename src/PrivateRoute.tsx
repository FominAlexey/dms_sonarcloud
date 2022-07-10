import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { hasCredentials } from './shared/LocalStorageUtils';

const PrivateRoute = ({ component, ...rest }: any) => {
    const routeComponent = (props: any) =>
        hasCredentials() ? React.createElement(component, { ...props }) : <Redirect to={{ pathname: '/Login' }} />;

    return <Route {...rest} render={routeComponent} />;
};

export default PrivateRoute;
