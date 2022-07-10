import React, { FC } from 'react';
import { Label, Icon } from '@fluentui/react';
import { EventLogCategory } from 'src/DAL/Dictionaries';

interface Props {
    eventLogCategories: EventLogCategory[];
}

const CalendarLegendComponent: FC<Props> = ({ eventLogCategories }: Props) => {
    let displayedEventLogCategories: EventLogCategory[] = [];
    displayedEventLogCategories = displayedEventLogCategories.concat(eventLogCategories);
    displayedEventLogCategories.push({ id: '', title: 'Не подтверждено', color: 'lightGrey', limit: 0 });

    return (
        <div className="ms-Grid mt-20" dir="ltr">
            <div className="ms-Grid-row h-start">
                {displayedEventLogCategories?.map(item => {
                    return (
                        <div key={item.id} className="mr-30 h-start">
                            <Icon iconName="CircleFill" style={{ color: item.color }} className="mr-5" />
                            <Label>{item.title}</Label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarLegendComponent;
