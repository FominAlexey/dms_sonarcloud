import React from 'react';
import AssetsContainer from './containers/Content/Assets/AssetsContainer';
import CalendarContainer from './containers/Content/Calendar/CalendarContainer';
import ConfirmationsContainer from './containers/Content/Confirmations/ConfirmationsContainer';
import DictionariesContainer from './containers/Content/Dictionaries/DictionariesContainer';
import EmployeesContainer from './containers/Content/Employees/EmployeesContainer';
import ExpensesContainer from './containers/Content/Expenses/ExpensesContainer';
import PageHeaderContainer from './containers/PageHeaderContainer';
import LoginContainer from './containers/Content/Login/LoginContainer';
import NavContainer from './containers/NavContainer';
import ProjectsContainer from './containers/Content/Projects/ProjectsContainer';
import ReportsContainer from './containers/Reports/ReportsContainer';
import TimeTrackingContainer from './containers/Content/TimeTracking/TimeTrackingContainer';
import ProjectReportContainer from './containers/Reports/ProjectReport/ProjectReportContainer';
import ProjectsReportOverviewContainer from './containers/Reports/ProjectsReportOverview/ProjectsReportOverviewContainer';
import ExpensesReportContainer from './containers/Reports/ExpensesReport/ExpensesReportContainer';
import ExpensesReportOverviewContainer from './containers/Reports/ExpensesReportOverview/ExpensesReportOverviewContainer';
import TimeReportContainer from './containers/Reports/TimeReport/TimeReportContainer';
import TimeReportOverviewContainer from './containers/Reports/TimeReportOverview/TimeReportOverviewContainer';
import EventLogsReportOverviewContainer from './containers/Reports/EventLogsReportOverview/EventLogsReportOverviewContainer';
import UsersManagementContainer from './containers/Content/UsersManagement/UsersManagementContainer';
import FeedbackContainer from './containers/Content/FeedBack/FeedbackContainer';
import UserEventLogsContainer from './containers/Content/UserEventLogs/UserEventLogsContainer';
import UserLimitsContainer from './containers/Content/UserLimits/UserLimitsContainer';
import ProductionCalendarContainer from './containers/Content/ProductionCalendarContainer';

import { initializeIcons } from '@uifabric/icons';
import { Route, BrowserRouter, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
//import { configureStore } from './store/Store';
import PrivateRoute from './PrivateRoute';
import UsersLimitsReportContainer from './containers/Reports/UsersLimitsReport/UsersLimitsReportContainer';
import UserProfileConatiner from './containers/Content/UserProfile/UserProfileContainer';
import ContentRoute from './ContentRoute';
import { EMPLOYEE, MANAGER, ADMINISTRATOR } from './shared/Constants';
import { store } from './store/Store';
import versionDMS from 'src/version.json';

import './styles/shared.css';
import ResetPasswordContainer from './containers/Content/ResetPassword/ResetPasswordContainer';

//const store = configureStore();

initializeIcons();

// Main page structure
const Main = () => (
    <div className="ms-Grid" dir="ltr">
        <div className="ms-Grid-row">
            <PageHeaderContainer />
        </div>
        <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm2">
                <NavContainer />
                <label style={{ color: 'gray' }}>Версия: {versionDMS.version}</label>
            </div>
            <div className="ms-Grid-col ms-sm10">
                <div className="container-feedback">
                    <FeedbackContainer />
                </div>
                <PageContent />
            </div>
        </div>
    </div>
);

const NotFound = () => {
    return <div>Page not found</div>;
};

// Set content container depend on current path
const PageContent = () => (
    <div>
        <Switch>
            {/* Employees routes */}
            <ContentRoute exact path="/" component={CalendarContainer} />
            <ContentRoute path="/Calendar" role={EMPLOYEE} component={CalendarContainer} />
            <ContentRoute path="/TimeTracking" role={EMPLOYEE} component={TimeTrackingContainer} />
            <ContentRoute path="/Expenses" role={EMPLOYEE} component={ExpensesContainer} />
            <ContentRoute path="/MyEventLogs" role={EMPLOYEE} component={UserEventLogsContainer} />
            <ContentRoute path="/MyLimits" role={EMPLOYEE} component={UserLimitsContainer} />
            <ContentRoute path="/MyProfile" role={EMPLOYEE} component={UserProfileConatiner} />
            {/* Managers routes */}
            <ContentRoute path="/Confirmations" role={MANAGER} component={ConfirmationsContainer} />
            <ContentRoute path="/Employees" role={MANAGER} component={EmployeesContainer} />
            <ContentRoute path="/Projects" role={MANAGER} component={ProjectsContainer} />
            <ContentRoute path="/Assets" role={MANAGER} component={AssetsContainer} />
            <ContentRoute exact path="/Reports" role={MANAGER} component={ReportsContainer} />
            <ContentRoute path="/Reports/ProjectReport/:projectId" role={MANAGER} component={ProjectReportContainer} />
            <ContentRoute
                path="/Reports/ExpensesReport/:employeeId"
                role={MANAGER}
                component={ExpensesReportContainer}
            />
            <ContentRoute path="/Reports/TimeReport/:employeeId" role={MANAGER} component={TimeReportContainer} />
            <ContentRoute path="/Reports/TimeReportOverview" role={MANAGER} component={TimeReportOverviewContainer} />
            <ContentRoute
                path="/Reports/ProjectsReportOverview"
                role={MANAGER}
                component={ProjectsReportOverviewContainer}
            />
            <ContentRoute
                path="/Reports/ExpensesReportOverview"
                role={MANAGER}
                component={ExpensesReportOverviewContainer}
            />
            <ContentRoute
                path="/Reports/EventLogsReportOverview"
                role={MANAGER}
                component={EventLogsReportOverviewContainer}
            />
            <ContentRoute path="/Reports/UsersLimitsReport" role={MANAGER} component={UsersLimitsReportContainer} />
            {/* Administrator routes */}
            <ContentRoute path="/UsersManagement" role={ADMINISTRATOR} component={UsersManagementContainer} />
            <ContentRoute path="/Dictionaries" role={ADMINISTRATOR} component={DictionariesContainer} />
            <ContentRoute path="/ProductionCalendar" role={ADMINISTRATOR} component={ProductionCalendarContainer} />

            <Route component={NotFound} />
        </Switch>
    </div>
);

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route path="/Login" component={LoginContainer} />
                    <Route path="/ResetPassword" component={ResetPasswordContainer} />
                    <PrivateRoute component={Main} />
                </Switch>
            </BrowserRouter>
        </Provider>
    );
};

export default App;
