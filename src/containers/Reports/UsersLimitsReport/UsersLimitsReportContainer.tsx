import React, { useEffect, FC } from 'react';

import { Label } from '@fluentui/react';

import { connect } from 'react-redux';

import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import UsersLimitsReportComponent from 'src/components/Reports/UsersLimitsReportComponent';
import { APPROVED } from 'src/shared/Constants';
import { IUsersLimitsReportProps, mapStateToProps, mapDispacthToProps } from './IUsersLimitsReportProps';

const UsersLimitsReportContainer: FC<IUsersLimitsReportProps> = (props: IUsersLimitsReportProps) => {
    useEffect(() => {
        props.getEmployees();
    }, [props.getEmployees]);

    useEffect(() => {
        props.getEventLogs({ employeeId: null, status: APPROVED, fromDate: null, toDate: null, currentUser: true });
    }, [props.getEventLogs]);

    // Get eventLogsCategories
    useEffect(() => {
        props.getEventLogCategories();
        props.getProductionCalendar();
    }, [props.getEventLogCategories, props.getProductionCalendar]);

    return (
        <ContentContainer
            title="Лимиты нерабочего времени"
            showContent={
                props.employees !== null &&
                props.eventLogs !== null &&
                props.eventLogCategories !== null &&
                props.productionCalendar !== null
            }
        >
            {(props.eventLogs?.length === 0 ||
                props.eventLogCategories?.length === 0 ||
                props.employees?.length === 0) &&
                !(props.eventLogsLoading || props.eventLogCategoriesLoading) && (
                    <Label className="text-center">Нет данных для отображения</Label>
                )}

            {props.eventLogs?.length !== 0 &&
                props.eventLogCategories?.length !== 0 &&
                props.employees?.length !== 0 && (
                    <UsersLimitsReportComponent
                        eventLogs={props.eventLogs || []}
                        eventLogsCategories={props.eventLogCategories || []}
                        isLoading={
                            props.eventLogsLoading ||
                            props.eventLogCategoriesLoading ||
                            props.employeesLoading ||
                            props.productionCalendarLoading
                        }
                        employees={props.employees || []}
                        productionCalendar={props.productionCalendar || []}
                    />
                )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispacthToProps)(UsersLimitsReportContainer);
