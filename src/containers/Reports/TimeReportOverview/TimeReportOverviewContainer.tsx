import React, { FC, useEffect } from 'react';

import { Label, PrimaryButton } from '@fluentui/react';

import TimeReportOverviewComponent from 'src/components/Reports/TimeReportOverviewComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import SelectPeriodComponent from 'src/components/Reports/SelectPeriodComponent';

import { connect } from 'react-redux';
import { ITimeReportOverviewProps, mapStateToProps, mapDispatchToProps } from './ITimeReportOverviewProps';

const TimeReportOverviewContainer: FC<ITimeReportOverviewProps> = (props: ITimeReportOverviewProps) => {
    useEffect(() => {
        props.getEmployees();
    }, [props.getEmployees]);

    useEffect(() => {
        if (props.searchProps.fromDate && props.searchProps.toDate) {
            props.getTimeTrackings({
                projectId: null,
                employeeId: null,
                workTaskId: null,
                fromDate: props.searchProps.fromDate,
                toDate: props.searchProps.toDate,
            });
        }
    }, [props.getTimeTrackings, props.searchProps.fromDate, props.searchProps.toDate]);

    return (
        <ContentContainer
            title="Трудозатраты по сотрудникам"
            showContent={props.employees !== null && props.timeTrackings !== null}
        >
            <SelectPeriodComponent fromDate={props.searchProps.fromDate} toDate={props.searchProps.toDate} />

            <div className="mt-20">
                <PrimaryButton text="Сформировать отчёт" onClick={() => props.getFileReportTimeReportOverview()} />
            </div>
            {(props.employees?.length === 0 || props.timeTrackings?.length === 0) &&
                !(props.employeesLoading || props.timeTrackingsLoading) && (
                    <Label className="text-center">Нет данных для отображения</Label>
                )}

            {props.employees?.length !== 0 &&
                props.timeTrackings?.length !== 0 &&
                props.searchProps.fromDate &&
                props.searchProps.toDate && (
                    <TimeReportOverviewComponent
                        employees={props.employees || []}
                        timeTrackings={props.timeTrackings || []}
                        isLoading={props.employeesLoading || props.timeTrackingsLoading}
                        fromDate={props.searchProps.fromDate}
                        toDate={props.searchProps.toDate}
                    />
                )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeReportOverviewContainer);
