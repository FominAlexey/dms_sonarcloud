import React, { FC, useEffect } from 'react';

import { Label, PrimaryButton, DefaultButton } from '@fluentui/react';

import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import TimeTrackingsListComponent from 'src/components/TimeTrackings/TimeTrackingsListComponent';
import TimeTrackingEditComponent from 'src/components/TimeTrackings/TimeTrackingEditComponent';
import SpinPeriodComponent from 'src/components/SpinPeriodComponent';

import { WEEK_LENGTH, getStartOfWeek, getEndOfWeek } from 'src/shared/DateUtils';

import { ITimeTrackingProps, mapStateToProps, mapDispatchToProps } from './ITimeTrackingProps';
import { connect } from 'react-redux';

const TimeTrackingContainer: FC<ITimeTrackingProps> = (props: ITimeTrackingProps) => {
    // Get projects, workTasks and timeTrackings
    useEffect(() => {
        const currentDate = props.searchProps.fromDate ? new Date(props.searchProps.fromDate) : new Date();

        props.getProjects(props.userId);
        props.getWorkTasks(props.userId);
        props.getTimeTrackings({
            projectId: null,
            employeeId: props.userId,
            workTaskId: null,
            fromDate: getStartOfWeek(currentDate),
            toDate: getEndOfWeek(currentDate),
        });
    }, [props.searchProps, props.userId, props.needToUpdateTimeTrackings]);

    // Get taskCategories
    useEffect(() => {
        props.getTaskCategories();
    }, [props.getTaskCategories, props.userId]);

    return (
        <ContentContainer
            title="Трудозатраты"
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

            <TimeTrackingsListComponent
                currentDate={getStartOfWeek(props.searchProps.fromDate || new Date())}
                // Remove workTasks without timeTrackings && Sort workTasks by projectId
                workTasks={
                    props.workTasks
                        ?.filter(w => props.timeTrackings?.find(t => t?.workTaskId === w.id))
                        .sort((a, b) => (a.projectId > b.projectId ? 1 : -1)) || []
                }
                timeTrackings={props.timeTrackings || []}
                editingTimeTracking={props.editingTimeTracking}
                isLoading={props.timeTrackingsLoading || props.workTasksLoading || props.projectsLoading}
                projects={props.projects || []}
                deleteTimeTracking={props.deleteTimeTracking}
                addingTimeTracking={props.addingTimeTracking}
            />

            <div className="mt-20">
                <PrimaryButton
                    text="Добавить время"
                    onClick={() =>
                        props.addingTimeTracking(
                            null,
                            null,
                            getStartOfWeek(
                                props.searchProps.fromDate ? new Date(props.searchProps.fromDate) : new Date(),
                            ),
                        )
                    }
                />
                <PrimaryButton
                    className="ml-20"
                    text="Копировать прошлую неделю"
                    onClick={() =>
                        props.copyTimeTracking(
                            getStartOfWeek(
                                props.searchProps.fromDate ? new Date(props.searchProps.fromDate) : new Date(),
                            ),
                        )
                    }
                />
            </div>

            {(props.isTimeTrackingAdding || props.isTimeTrackingEditing) && props.currentTimeTracking && (
                <TimeTrackingEditComponent
                    timeTracking={props.currentTimeTracking}
                    saveTimeTracking={props.isTimeTrackingAdding ? props.postTimeTracking : props.putTimeTracking}
                    isDisabled={props.isTimeTrackingEditing || props.isTimeTrackingDisabled}
                    clearTimeTracking={props.clearTimeTracking}
                    taskCategories={props.taskCategories}
                    projects={props.projects || []}
                    posting={props.timeTrackingsPosting}
                />
            )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeTrackingContainer);
