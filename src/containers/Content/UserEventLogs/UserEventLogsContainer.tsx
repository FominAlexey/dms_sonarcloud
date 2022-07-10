import React, { useEffect, FC } from 'react';

import { connect } from 'react-redux';

import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import UserEventLogsComponent from 'src/components/Account/UserEventLogsComponent';
import SelectPeriodComponent from 'src/components/Reports/SelectPeriodComponent';

import { IUserEventLogsProps, mapStateToProps, mapDispacthToProps } from './IUserEventLogsProps';

const UserEventLogsContainer: FC<IUserEventLogsProps> = (props: IUserEventLogsProps) => {
    useEffect(() => {
        if (props.searchProps.fromDate && props.searchProps.toDate) {
            props.getEventLogs({
                employeeId: props.userId,
                status: null,
                fromDate: props.searchProps.fromDate,
                toDate: props.searchProps.toDate,
                currentUser: true,
            });
            props.getEventLogCategories();
            props.getProductionCalendar();
        }
    }, [
        props.getEventLogs,
        props.getEventLogCategories,
        props.userId,
        props.searchProps.fromDate,
        props.searchProps.toDate,
        props.getProductionCalendar,
    ]);

    return (
        <ContentContainer
            title="Нерабочее время"
            showContent={
                props.eventLogs !== null && props.eventLogCategories !== null && props.productionCalendar !== null
            }
        >
            <SelectPeriodComponent fromDate={props.searchProps.fromDate} toDate={props.searchProps.toDate} />
            <UserEventLogsComponent
                eventLogs={props.eventLogs}
                eventLogCategories={props.eventLogCategories || []}
                isLoading={props.eventLogsLoading || props.productionCalendarLoading}
                productionCalendar={props.productionCalendar || []}
            />
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispacthToProps)(UserEventLogsContainer);
