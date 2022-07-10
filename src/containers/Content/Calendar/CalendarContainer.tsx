import React, { FC, useEffect, useState } from 'react';

import { PrimaryButton, Label } from '@fluentui/react';

import CalendarOverviewComponent from 'src/components/Calendar/CalendarOverviewComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import EventLogEditComponent from 'src/components/Calendar/EventLogEditComponent';
import CalendarLegendComponent from 'src/components/Calendar/CalendarLegendComponent';
import PeriodComponent from 'src/components/SpinPeriodComponent';

import { CALENDAR_LENGTH, changeDateByValue } from 'src/shared/DateUtils';
import { REJECTED } from 'src/shared/Constants';

import { connect } from 'react-redux';
import { isAdmin, isManager } from 'src/shared/LocalStorageUtils';
import { ICalendarProps, mapStateToProps, mapDispacthToProps } from './ICalendarProps';

const CalendarContainer: FC<ICalendarProps> = (props: ICalendarProps) => {
    const employeeId = isManager() || isAdmin() ? null : props.userId;

    const [displayEmployees, setDisplayEmployees] = useState(props.employees);

    // Get employeeEventLogs if currentDate changed
    useEffect(() => {
        const currentDate = props.searchProps.fromDate ? new Date(props.searchProps.fromDate) : new Date();
        const lastDate = changeDateByValue(props.searchProps.fromDate || new Date(), CALENDAR_LENGTH);
        props.getEventLogs({ employeeId, status: null, fromDate: currentDate, toDate: lastDate, currentUser: false });
    }, [props.searchProps, props.getEventLogs, employeeId, props.needToUpdateEventLogs]);

    // Get employees
    useEffect(() => {
        props.getEmployees();
    }, [props.getEmployees]);

    useEffect(() => {
        setDisplayEmployees(props.employees);
    }, [props.employees, employeeId]);

    // Get eventLogsCategories
    useEffect(() => {
        props.getEventLogCategories();
    }, [props.getEventLogCategories]);

    useEffect(() => {
        props.getProductionCalendar();
    }, [props.getProductionCalendar]);

    return (
        <ContentContainer
            title="Календарь"
            showContent={props.eventLogs !== null && props.employees !== null && props.eventLogCategories !== null}
        >
            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-row">
                    <Label>
                        c {(props.searchProps.fromDate || new Date()).toLocaleDateString()} по{' '}
                        {changeDateByValue(
                            props.searchProps.fromDate || new Date(),
                            CALENDAR_LENGTH,
                        ).toLocaleDateString()}
                    </Label>
                </div>
                <div className="ms-Grid-row mt-20">
                    <div className="ms-Grid-col ms-sm9">
                        <PrimaryButton text="Добавить изменение" onClick={() => props.addingEventLog()} />
                    </div>
                    <div className="ms-Grid-col ms-sm3 h-end">
                        <PeriodComponent
                            fromDate={props.searchProps.fromDate || new Date()}
                            periodLength={CALENDAR_LENGTH}
                        />
                    </div>
                </div>
            </div>

            <CalendarOverviewComponent
                userId={props.userId}
                currentDate={props.searchProps.fromDate || new Date()}
                employees={displayEmployees?.filter(employee => employee.isLeave == false) || []}
                eventLogs={props.eventLogs?.filter(ev => ev.approvalStatusId !== REJECTED) || []}
                eventLogCategories={props.eventLogCategories || []}
                editingEventLog={props.editingEventLog}
                isLoading={
                    props.eventLogsLoading ||
                    props.employeesLoading ||
                    props.eventLogCategoriesLoading ||
                    props.productionCalendarLoading
                }
                deleteEventLog={props.deleteEventLog}
                productionCalendar={props.productionCalendar || []}
                invertedTheme={props.invertedTheme}
            />

            <CalendarLegendComponent eventLogCategories={props.eventLogCategories || []} />

            {(props.isAdding || props.isEditing) && props.currentEventLog && (
                <EventLogEditComponent
                    eventLogCategories={props.eventLogCategories || []}
                    userId={props.userId}
                    eventLog={props.currentEventLog}
                    saveEventLog={props.isAdding ? props.postEventLog : props.putEventLog}
                    clearEventLog={props.clearEventLog}
                    posting={props.posting}
                />
            )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispacthToProps)(CalendarContainer);
