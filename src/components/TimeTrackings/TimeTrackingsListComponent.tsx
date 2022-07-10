import React, { FC, useState, useEffect } from 'react';

import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import {
    IColumn,
    TextField,
    Callout,
    IconButton,
    IDetailsListProps,
    DetailsRow,
    SelectionMode,
    IDetailsRowCheckStyles,
    DetailsRowCheck,
    IDetailsRowCheckProps,
} from '@fluentui/react';

import { WorkTask, TimeTracking, TimeTrackingEdit } from 'src/DAL/TimeTracking';
import { Project } from 'src/DAL/Projects';

import { IListItem, ActionAsyncThunk } from 'src/shared/Common';
import { WEEK_LENGTH, getStartOfWeek, getDateFromLocaleString } from 'src/shared/DateUtils';
import { getTimeTrackingItems, getDaysColumns, IListTimeTrackingItems } from 'src/shared/TimeTrackingsUtils';

interface Props {
    currentDate: Date;
    isLoading: boolean;
    timeTrackings: TimeTracking[];
    workTasks: WorkTask[];
    projects: Project[];
    editingTimeTracking: (id: string) => ActionAsyncThunk<TimeTrackingEdit, string>;
    deleteTimeTracking: (id: string) => ActionAsyncThunk<boolean, string>;
    addingTimeTracking: (projectId?: string | null, taskCategoryId?: string | null, startDate?: Date | null) => void;
}

const TimeTrackingsListComponent: FC<Props> = (props: Props) => {
    // Set initial values
    const [items, setItems] = useState<IListTimeTrackingItems[]>([]);
    const [columns, setColumns] = useState<IColumn[]>([]);
    const [showTools, setShowTools] = useState<boolean>(false);
    const [currentElement, setCurrentElement] = useState<React.RefObject<HTMLDivElement> | null>(null);
    const [currentId, setCurrentId] = useState<string>();

    // Create items
    useEffect(() => {
        if (props.workTasks.length !== 0 && props.timeTrackings.length !== 0) {
            setItems(getTimeTrackingItems(props.workTasks, props.timeTrackings, props.currentDate));
        } else {
            setItems([]);
        }
    }, [props.workTasks, props.timeTrackings, props.projects, props.currentDate]);

    // Create columns
    useEffect(() => {
        setColumns(getDaysColumns(getStartOfWeek(props.currentDate), WEEK_LENGTH, 40));
    }, [props.currentDate]);

    const _renderItemColumn = (item: IListTimeTrackingItems, index?: number, column?: IColumn) => {
        const fieldContent = item[column?.fieldName as keyof IListItem] as string;
        // Render title column items
        if (column?.key === 'titleColumn') {
            const content = fieldContent.split(',');
            return (
                <div>
                    <div className="fw-bold">{content[0]}</div>
                    <div>{content[1]}</div>
                </div>
            );
        } else {
            // Render content items
            if (fieldContent != null) {
                const values = fieldContent.split(';');
                // Render timeTracking items
                if (item.key !== '') {
                    const ref = React.createRef<HTMLDivElement>();
                    const _onCellClick = () => {
                        setShowTools(true);
                        setCurrentElement(ref);
                        setCurrentId(values[1]);
                    };
                    return (
                        <div ref={ref}>
                            <TextField
                                readOnly
                                defaultValue={values[0]}
                                onClick={values[1] ? () => _onCellClick() : undefined}
                                className="text-center cursor-pointer"
                            />
                        </div>
                    );
                } else {
                    // Render summary items
                    return <TextField readOnly defaultValue={values[0]} className="text-center cursor-default" />;
                }
            } else {
                // Render empty timeTracking items
                if (item.key !== '') {
                    return (
                        <TextField
                            readOnly
                            style={{ cursor: 'pointer' }}
                            onClick={() =>
                                props.addingTimeTracking(
                                    item.projectId,
                                    item.taskCategoryId,
                                    getDateFromLocaleString(column!.fieldName!),
                                )
                            }
                        />
                    );
                }
            }
            // Render empty summary items
            return <TextField readOnly className="cursor-default" />;
        }
    };

    const _renderHeaderColumn: IDetailsListProps['onRenderDetailsHeader'] = (detailsHeaderProps): JSX.Element => {
        return (
            <DetailsRow
                columns={detailsHeaderProps?.columns}
                item={{}}
                itemIndex={-1}
                groupNestingDepth={detailsHeaderProps?.groupNestingDepth}
                selectionMode={SelectionMode.single}
                selection={detailsHeaderProps?.selection}
                onRenderItemColumn={_renderDetailsHeaderItemColumn}
                onRenderCheck={_onRenderCheckForHeaderRow}
            />
        );
    };

    const _renderDetailsHeaderItemColumn = (item?: any, index?: number, column?: IColumn) => {
        if (column?.key === 'titleColumn') {
            // Render tasks header column
            return <div className="fs-14 fw-bold">{column?.name}</div>;
        } else {
            // Render date header column
            return (
                <div>
                    <div className="fw-bold text-center">{column?.name}</div>
                    <div className="text-center">{column?.ariaLabel}</div>
                </div>
            );
        }
    };

    // Hide cellCheck element in header row
    const detailsRowCheckStyles: Partial<IDetailsRowCheckStyles> = { check: { display: 'none' } };

    const _onRenderCheckForHeaderRow = (props: IDetailsRowCheckProps): JSX.Element => {
        return <DetailsRowCheck {...props} styles={detailsRowCheckStyles} selected={true} />;
    };

    const Tools = () => {
        return (
            <Callout target={currentElement} onDismiss={() => setShowTools(false)}>
                <IconButton
                    iconProps={{ iconName: 'Edit', title: 'Изменить' }}
                    onClick={() => props?.editingTimeTracking(currentId!)}
                />
                <IconButton
                    iconProps={{ iconName: 'Delete', title: 'Удалить', className: 'red' }}
                    onClick={() => props?.deleteTimeTracking(currentId!)}
                />
            </Callout>
        );
    };

    return (
        <div>
            <ShimmeredDetailsList
                columns={columns}
                items={items}
                selectionMode={0}
                onRenderItemColumn={_renderItemColumn}
                onRenderDetailsHeader={_renderHeaderColumn}
                layoutMode={0}
                enableShimmer={props.isLoading}
            />
            {showTools && <Tools />}
        </div>
    );
};

export default TimeTrackingsListComponent;
