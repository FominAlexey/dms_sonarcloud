import React, { FC, useEffect } from 'react';

import { Label } from '@fluentui/react';

import TimeReportComponent from 'src/components/Reports/TimeReportComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import SpinPeriodComponent from 'src/components/SpinPeriodComponent';

import { WEEK_LENGTH, getStartOfWeek, getEndOfWeek } from 'src/shared/DateUtils';

import { connect } from 'react-redux';

import { ITimeReportProps, mapStateToProps, mapDispatchToProps } from './ITimeReportProps';

const TimeReportContainer: FC<ITimeReportProps> = (props: ITimeReportProps) => {
    // Get employee
    useEffect(() => {
        const employeeId = props.match.params.employeeId;
        props.getEmployee(employeeId);
    }, [props.match, props.getEmployee]);

    // Get timeTrackings if currentDate changed
    useEffect(() => {
        const employeeId = props.match.params.employeeId;
        const currentDate = props.searchProps.fromDate ? new Date(props.searchProps.fromDate) : new Date();
        props.getTimeTrackings({
            projectId: null,
            employeeId,
            workTaskId: null,
            fromDate: getStartOfWeek(currentDate),
            toDate: getEndOfWeek(currentDate),
        });
    }, [props.searchProps, props.getTimeTrackings, props.match]);

    useEffect(() => {
        const employeeId = props.match.params.employeeId;
        props.getProjects(employeeId);
    }, [props.match, props.getProjects]);

    useEffect(() => {
        const employeeId = props.match.params.employeeId;
        props.getWorkTasks(employeeId);
    }, [props.match, props.getWorkTasks]);

    return (
        <ContentContainer
            title={`Трудозатраты по сотруднику "${props.employee?.fullName || ''}"`}
            showContent={props.projects !== null && props.timeTrackings !== null && props.workTasks !== null}
        >
            <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-row h-end">
                    <div className="ms-Grid-col ms-sm9">
                        <Label>
                            {`с ${getStartOfWeek(
                                props.searchProps.fromDate || new Date(),
                            ).toLocaleDateString()} по ${getEndOfWeek(
                                props.searchProps.fromDate || new Date(),
                            ).toLocaleDateString()}`}
                        </Label>
                        <Label>
                            Всего за неделю: {props.timeTrackings?.reduce((acc, current) => acc + current.timeSpent, 0)}{' '}
                            ч
                        </Label>
                    </div>
                    <div className="ms-Grid-col ms-sm3 h-end">
                        <SpinPeriodComponent
                            fromDate={getStartOfWeek(props.searchProps.fromDate || new Date())}
                            periodLength={WEEK_LENGTH}
                        />
                    </div>
                </div>
            </div>

            <TimeReportComponent
                currentDate={getStartOfWeek(props.searchProps.fromDate || new Date())}
                // Remove workTasks without timeTrackings && Sort workTasks by projectId
                workTasks={
                    props.workTasks
                        ?.filter(w => props.timeTrackings?.find(t => t?.workTaskId === w.id))
                        .sort((a, b) => (a.projectId > b.projectId ? 1 : -1)) || []
                }
                timeTrackings={props.timeTrackings || []}
                isLoading={props.timeTrackingsLoading || props.worktasksLoading || props.projectsLoading}
                projects={props.projects || []}
            />
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeReportContainer);
