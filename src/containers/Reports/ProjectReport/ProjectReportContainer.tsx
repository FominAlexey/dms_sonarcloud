import React, { FC, useEffect } from 'react';

import { Label } from '@fluentui/react';

import ProjectReportComponent from 'src/components/Reports/ProjectReportComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import SelectPeriodComponent from 'src/components/Reports/SelectPeriodComponent';

import { connect } from 'react-redux';
import { IProjectReportProps, mapStateToProps, mapDispatchToProps } from './IProjectReportProps';

const ProjectReportContainer: FC<IProjectReportProps> = (props: IProjectReportProps) => {
    useEffect(() => {
        const _projectId = props.match.params.projectId;
        props.getProject(_projectId);
        if (props.searchProps.fromDate && props.searchProps.toDate) {
            props.getTimeTrackings({
                projectId: _projectId,
                employeeId: null,
                workTaskId: null,
                fromDate: props.searchProps.fromDate,
                toDate: props.searchProps.toDate,
            });
        }
    }, [props.getProject, props.getTimeTrackings, props.match, props.searchProps.fromDate, props.searchProps.toDate]);

    return (
        <ContentContainer
            title={`Трудозатраты по проекту "${props.project?.title || ''}"`}
            showContent={props.project !== null && props.timeTrackings !== null}
        >
            <SelectPeriodComponent fromDate={props.searchProps.fromDate} toDate={props.searchProps.toDate} />

            {(props.project === null || props.timeTrackings?.length === 0) &&
                !(props.projectsLoading || props.timeTrackingsLoading) && (
                    <Label className="text-center">Нет данных для отображения</Label>
                )}

            {props.project !== null &&
                props.timeTrackings?.length !== 0 &&
                props.searchProps.fromDate &&
                props.searchProps.toDate && (
                    <ProjectReportComponent
                        teamMembers={props.project?.teamMembers || []}
                        timeTrackings={props.timeTrackings || []}
                        isLoading={props.projectsLoading || props.timeTrackingsLoading}
                        fromDate={props.searchProps.fromDate}
                        toDate={props.searchProps.toDate}
                    />
                )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectReportContainer);
