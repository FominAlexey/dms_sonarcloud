import React, { useEffect, FC } from 'react';

import { connect } from 'react-redux';

import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import UserLimitsComponent from 'src/components/Account/UserLimitsComponent';

import { APPROVED } from 'src/shared/Constants';
import { IUserLimitsProps, mapStateToProps, mapDispacthToProps } from './IUserLimitsProps';

const UserSummaryInfoContainer: FC<IUserLimitsProps> = (props: IUserLimitsProps) => {
    useEffect(() => {
        props.getEmployee(props.userId);
    }, [props.getEmployee, props.userId]);

    useEffect(() => {
        props.getEventLogs({
            employeeId: props.userId,
            status: APPROVED,
            fromDate: null,
            toDate: null,
            currentUser: true,
        });
    }, [props.getEventLogs, props.userId]);

    // Get eventLogsCategories
    useEffect(() => {
        props.getEventLogCategories();
        props.getProductionCalendar();
    }, [props.getEventLogCategories, props.getProductionCalendar]);

    return (
        <ContentContainer
            title="Мои лимиты нерабочего времени"
            showContent={
                props.employee !== null && props.eventLogCategories !== null && props.productionCalendar !== null
            }
        >
            <UserLimitsComponent
                eventLogs={props.eventLogs || []}
                eventLogsCategories={props.eventLogCategories || []}
                isLoading={props.eventLogsLoading || props.eventLogCategoriesLoading || props.productionCalendarLoading}
                employee={props.employee!}
                productionCalendar={props.productionCalendar || []}
            />
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispacthToProps)(UserSummaryInfoContainer);
