import React, { FC, useState, useEffect } from 'react';

import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn } from '@fluentui/react';

import { WorkTask, TimeTracking } from 'src/DAL/TimeTracking';
import { Project } from 'src/DAL/Projects';

import { IListItem } from 'src/shared/Common';
import { WEEK_LENGTH, getStartOfWeek } from 'src/shared/DateUtils';
import { getDaysColumns, getTimeReportItems } from 'src/shared/TimeTrackingsUtils';

interface Props {
    currentDate: Date;
    isLoading: boolean;
    timeTrackings: TimeTracking[];
    workTasks: WorkTask[];
    projects: Project[];
}

const TimeReportComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IListItem[]>([]);
    const [columns, setColumns] = useState<IColumn[]>([]);

    // Create items
    useEffect(() => {
        if (props.workTasks.length !== 0 && props.timeTrackings.length !== 0) {
            setItems(getTimeReportItems(props.workTasks, props.projects, props.timeTrackings, props.currentDate));
        } else {
            setItems([]);
        }
    }, [props.workTasks, props.timeTrackings, props.projects, props.currentDate]);

    // Create columns
    useEffect(() => {
        setColumns(getDaysColumns(getStartOfWeek(props.currentDate), WEEK_LENGTH, 40));
    }, [props.currentDate]);

    return (
        <ShimmeredDetailsList
            columns={columns}
            items={items}
            selectionMode={0}
            layoutMode={0}
            enableShimmer={props.isLoading}
        />
    );
};

export default TimeReportComponent;
