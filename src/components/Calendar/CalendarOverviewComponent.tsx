import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, Callout, IconButton, Label } from '@fluentui/react';
import { getTheme } from '@fluentui/react/lib/Styling';
import { Employee } from 'src/DAL/Employees';
import { EventLogCategory } from 'src/DAL/Dictionaries';
import { EventLog, EventLogEdit } from 'src/DAL/Calendar';
import { IProductionCalendar } from 'src/DAL/ProductionCalendar';
import { DAY_SHORT_NAMES, CALENDAR_LENGTH, isWorkingDay } from 'src/shared/DateUtils';
import { APPROVED, CREATED } from 'src/shared/Constants';
import { IListItem, ActionAsyncThunk } from 'src/shared/Common';

import 'src/styles/calendarOverviewStyles.css';

// Days colors
const defaultCategoryColor = '#F0F0F0';
const weekendColor = '#FF0000';
const unapprovedColor = 'lightGrey';

interface Props {
    userId: string;
    currentDate: Date;
    employees: Employee[];
    eventLogs: EventLog[];
    eventLogCategories: EventLogCategory[];
    isLoading: boolean;
    editingEventLog: (id: string) => ActionAsyncThunk<EventLogEdit, string>;
    deleteEventLog: (id: string) => ActionAsyncThunk<boolean, string>;
    productionCalendar: IProductionCalendar[];
    invertedTheme: boolean;
}

const CalendarOverviewComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IListItem[]>([]);
    const [columns, setColumns] = useState<IColumn[] | []>([]);
    const [showTools, setShowTools] = useState<boolean>(false);
    const [currentElement, setCurrentElement] = useState<React.RefObject<HTMLDivElement> | null>(null);
    const [currentId, setCurrentId] = useState<string>();
    const [defaultColor, setDefaultColor] = useState<string>('#000000');

    useEffect(() => {
        setDefaultColor(getTheme().semanticColors.bodyText);
    }, [props.invertedTheme]);

    // Create items
    useEffect(() => {
        if (props.employees.length !== 0) {
            setItems(getCalendarItems(props.employees, props.eventLogs));
        }
    }, [props.employees, props.eventLogs]);

    // Create columns
    useEffect(() => {
        // Get days to headers
        const DaysColumns: IColumn[] = getDaysColumns(props.currentDate, CALENDAR_LENGTH, 50);

        let _columns: IColumn[] = [
            {
                key: 'fullName',
                name: '',
                fieldName: 'title',
                minWidth: 100,
                maxWidth: 200,
            },
        ];

        _columns = _columns.concat(DaysColumns); // attach days to columns

        setColumns(_columns);
    }, [props.currentDate]);

    // Get color of category by id
    const getColor = (id: string): string => {
        const result = props.eventLogCategories.filter(cat => cat.id === id);
        return result.length !== 0 && result[0].color ? result[0].color : defaultCategoryColor;
    };

    const _renderItemColumn = (item: any, column?: IColumn) => {
        // Cell text color
        let cellTextColor: string = defaultColor;

        // Event category
        const fieldContent = item[column?.fieldName as string] as string;

        // Cell content = day number
        const field = column?.key ? new Date(column?.key).getDate().toString() : '';

        if (column?.key === 'fullName') {
            return <div>{fieldContent}</div>;
        } else {
            // Hightlight weekens
            if (!isWorkingDay(new Date(column.key), props.productionCalendar)) {
                cellTextColor = weekendColor;
            }
            // If cell include content
            if (fieldContent !== undefined) {
                const ref = React.createRef<HTMLDivElement>();
                const _onCellClick = () => {
                    setShowTools(true);
                    setCurrentElement(ref);
                    setCurrentId(fieldContent);
                };

                const event = props.eventLogs.find(ev => ev.id === fieldContent);
                const cellBackColor =
                    event?.approvalStatusId === APPROVED ? getColor(event.eventCategoryId) : unapprovedColor;

                return (
                    <div
                        ref={ref}
                        style={{ backgroundColor: cellBackColor }}
                        className="calendar-cell black cursor-pointer"
                        onClick={() => _onCellClick()}
                    >
                        {field}
                    </div>
                );
            }
            return (
                <div style={{ color: cellTextColor }} className="calendar-cell">
                    {field}
                </div>
            );
        }
    };

    const Tools = () => {
        //const currentEventLog = props.eventLogs.filter(ev=>ev.eventLogId===Number.parseInt(currentId!))[0];
        const currentEventLog: EventLog = props?.eventLogs.filter(ev => ev.id === currentId)[0];
        const categoryName = `${currentEventLog.eventCategoryName}`;

        const period = currentEventLog.endDate
            ? `c ${currentEventLog.startDate.toLocaleDateString()} по ${currentEventLog.endDate.toLocaleDateString()}`
            : `${currentEventLog.startDate.toLocaleDateString()}`;

        return (
            <Callout target={currentElement} onDismiss={() => setShowTools(false)}>
                <Label className="calendar-label">
                    {categoryName} {period}
                </Label>
                {currentEventLog.employeeId === props?.userId && currentEventLog.approvalStatusId === CREATED && (
                    <div>
                        <IconButton
                            title="Изменить"
                            iconProps={{ iconName: 'Edit' }}
                            onClick={() => props?.editingEventLog(currentEventLog.id)}
                        />
                        <IconButton
                            title="Удалить"
                            iconProps={{ iconName: 'Delete', className: 'red' }}
                            onClick={() => {
                                props?.deleteEventLog(currentEventLog.id);
                                setShowTools(false);
                            }}
                        />
                    </div>
                )}
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
                layoutMode={0}
                enableShimmer={props.isLoading}
            />
            {showTools && <Tools />}
        </div>
    );
};

// Returns list of event days
const getEmployeesEventLogDays = (employeeEventLogs: EventLog[]) => {
    const days = [];
    let j = 0;

    for (let i = 0; i < employeeEventLogs.length; i++) {
        // if 1 day event
        if (employeeEventLogs[i].endDate === null) {
            days[j] = {
                content: employeeEventLogs[i].id,
                fieldName: `${employeeEventLogs[i].startDate.toLocaleDateString()}`,
            };
            j++;
        } else {
            // if many days event
            const date = new Date(employeeEventLogs[i].startDate);
            while (date < employeeEventLogs[i].endDate! || date.getDate() === employeeEventLogs[i].endDate?.getDate()) {
                days[j] = {
                    content: employeeEventLogs[i].id,
                    fieldName: `${date.toLocaleDateString()}`,
                };
                j++;
                date.setDate(date.getDate() + 1);
            }
        }
    }
    return days;
};

// Returns list of days of the mounth with column props
const getDaysColumns = (start: Date, count: number, maxWidth: number): IColumn[] => {
    const day = new Date(start);
    const days: IColumn[] = [];
    for (let i = 0; i < count; i++) {
        days[i] = {
            key: `${day}`,
            fieldName: `${day.toLocaleDateString()}`,
            name: DAY_SHORT_NAMES[day.getDay()],
            minWidth: 10,
            maxWidth: maxWidth,
        };
        day.setDate(day.getDate() + 1);
    }
    return days;
};

const getCalendarItems = (
    _employees: Employee[],
    _eventLogs: EventLog[],
    collator = new Intl.Collator('ru', { numeric: true, sensitivity: 'base' }),
): IListItem[] => {
    // Fetch employees names
    const _items = _employees
        .map(item => {
            return {
                key: item.id,
                title: item.fullName,
            };
        })
        .sort((a, b) => collator.compare(a.title, b.title));
    // Attach employees events days
    for (let i = 0; i < _items.length; i++) {
        const _employeeEventLogs = _eventLogs.filter(ev => ev.employeeId === _items[i].key);
        const employeeEvents = Object.assign(
            {},
            ...getEmployeesEventLogDays(_employeeEventLogs).map(key => ({ [key.fieldName]: key.content })),
        );
        _items[i] = { ..._items[i], ...employeeEvents };
    }

    return _items;
};

export default CalendarOverviewComponent;
