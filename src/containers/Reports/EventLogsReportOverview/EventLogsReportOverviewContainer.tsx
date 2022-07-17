import React, { FC, FormEvent, useEffect, useState } from 'react';

import { ComboBox, IComboBox, IComboBoxOption, Label } from '@fluentui/react';

import EventLogsOverviewReportComponent from 'src/components/Reports/EventLogsOverviewReportComponent';
import EventLogsDetailsReportComponent from 'src/components/Reports/EventLogsDetailsReportComponent';
import SelectPeriodComponent from 'src/components/Reports/SelectPeriodComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import { APPROVED } from 'src/shared/Constants';
import DetailToggleComponent from 'src/components/Reports/DetailToggleComponent';

import { connect } from 'react-redux';
import { IEventLogsReportOverviewProps, mapStateToProps, mapDispatchToProps } from './IEventLogsReportOverviewProps';

const EventLogsReportOverviewContainer: FC<IEventLogsReportOverviewProps> = (props: IEventLogsReportOverviewProps) => {
    const [EmployeesOptions, setEmployeesOptions] = useState<IComboBoxOption[]>();
    const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('');

    useEffect(() => {
        props.getEmployees();
    }, [props.getEmployees]);

    useEffect(() => {
        if (props.searchProps.fromDate && props.searchProps.toDate) {
            props.getEventLogs({
                employeeId: null,
                status: APPROVED,
                fromDate: props.searchProps.fromDate,
                toDate: props.searchProps.toDate,
                currentUser: true,
            });
            props.getEventLogCategories();
            props.getProductionCalendar();
        }
    }, [
        props.getEventLogCategories,
        props.getEventLogs,
        props.getProductionCalendar,
        props.searchProps.fromDate,
        props.searchProps.toDate,
    ]);

    // Set employees list options
    useEffect(() => {
        let options: IComboBoxOption[] = [
            {
                key: '',
                text: 'Все сотрудники',
            } as IComboBoxOption,
        ];

        if (props.employees)
            options = options.concat(
                props.employees.map(item => {
                    return {
                        key: item.id,
                        text: item.fullName,
                    } as IComboBoxOption;
                }),
            );
        setEmployeesOptions(options);
    }, [props.employees]);

    const _onChangeCurrentEmployee = (
        event: FormEvent<IComboBox>,
        option?: IComboBoxOption | undefined,
        index?: number | undefined,
        value?: string | undefined,
    ): void => {
        if (option) {
            setCurrentEmployeeId(option.key.toString());
        }
    };

    return (
        <ContentContainer
            title="Отчет по нерабочему времени"
            showContent={
                props.employees !== null &&
                props.productionCalendar !== null &&
                props.eventLogCategories !== null &&
                props.eventLogs !== null
            }
        >
            <SelectPeriodComponent fromDate={props.searchProps.fromDate} toDate={props.searchProps.toDate} />

            <DetailToggleComponent isDetail={props.searchProps.isDetail} />

            {props.searchProps.isDetail &&
                !(
                    props.eventLogs?.length === 0 ||
                    props.eventLogCategories?.length === 0 ||
                    props.employees?.length === 0
                ) && (
                    <ComboBox
                        label="Сотрудник"
                        options={EmployeesOptions}
                        selectedKey={currentEmployeeId}
                        onChange={_onChangeCurrentEmployee}
                        className="combobox-employee"
                    />
                )}

            {(props.eventLogs?.length === 0 || props.eventLogCategories?.length === 0) &&
                !(props.eventLogsLoaging || props.eventLogCategoriesLoading) && (
                    <Label className="text-center">Нет данных для отображения</Label>
                )}

            {props.searchProps.isDetail &&
                !(props.eventLogs?.length === 0 || props.eventLogCategories?.length === 0) && (
                    <EventLogsDetailsReportComponent
                        eventLogs={
                            currentEmployeeId
                                ? props.eventLogs?.filter(el => el.employeeId === currentEmployeeId) || []
                                : props.eventLogs || []
                        }
                        isLoading={
                            props.employeesLoading ||
                            props.eventLogsLoaging ||
                            props.eventLogCategoriesLoading ||
                            props.productionCalendarLoading
                        }
                        eventLogCategories={props.eventLogCategories || []}
                        productionCalendar={props.productionCalendar}
                    />
                )}

            {!props.searchProps.isDetail &&
                !(props.eventLogs?.length === 0 || props.eventLogCategories?.length === 0) && (
                    <EventLogsOverviewReportComponent
                        eventLogs={props.eventLogs || []}
                        eventLogsCategories={props.eventLogCategories || []}
                        isLoading={
                            props.eventLogsLoaging || props.eventLogCategoriesLoading || props.productionCalendarLoading
                        }
                        productionCalendar={props.productionCalendar || []}
                        fromLimit={props.searchProps.fromDate}
                        toLimit={props.searchProps.toDate}
                    />
                )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(EventLogsReportOverviewContainer);
