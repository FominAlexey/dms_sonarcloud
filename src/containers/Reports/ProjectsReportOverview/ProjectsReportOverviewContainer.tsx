import React, { FC, useEffect } from 'react';

import { Label } from '@fluentui/react';

import ProjectReportOverviewComponent from 'src/components/Reports/ProjectReportOverviewComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import SelectPeriodComponent from 'src/components/Reports/SelectPeriodComponent';

import { connect } from 'react-redux';
import { IProjectsReportOverviewProps, mapStateToProps, mapDispatchToProps } from './IProjectsReportOverviewProps';

const ProjectsReportOverviewContainer: FC<IProjectsReportOverviewProps> = (props: IProjectsReportOverviewProps) => {
    useEffect(() => {
        props.getProjects();
    }, [props.getProjects]);

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
            title="Трудозатраты по проектам"
            showContent={props.projects !== null && props.timeTrackings !== null}
        >
            <SelectPeriodComponent fromDate={props.searchProps.fromDate} toDate={props.searchProps.toDate} />

            {(props.projects?.length === 0 || props.timeTrackings?.length === 0) &&
                !(props.projectsLoading || props.timeTrackingsLoading) && (
                    <Label className="text-center">Нет данных для отображения</Label>
                )}

            {props.projects?.length !== 0 &&
                props.timeTrackings?.length !== 0 &&
                props.searchProps.fromDate &&
                props.searchProps.toDate && (
                    <ProjectReportOverviewComponent
                        projects={props.projects || []}
                        timeTrackings={props.timeTrackings || []}
                        isLoading={props.projectsLoading || props.timeTrackingsLoading}
                        fromDate={props.searchProps.fromDate}
                        toDate={props.searchProps.toDate}
                    />
                )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectsReportOverviewContainer);
