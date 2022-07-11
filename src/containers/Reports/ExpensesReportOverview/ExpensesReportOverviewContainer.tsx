import React, { FC, useEffect, useState } from 'react';

import { ComboBox, IComboBoxOption, IComboBox, Label, Spinner } from '@fluentui/react';

import ExpensesReportOverviewComponent from 'src/components/Reports/ExpensesReportOverviewComponent';
import ExpensesReportDetailsComponent from 'src/components/Reports/ExpensesReportDetailsComponent';
import SelectPeriodComponent from 'src/components/Reports/SelectPeriodComponent';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import { APPROVED } from 'src/shared/Constants';
import DetailToggleComponent from 'src/components/Reports/DetailToggleComponent';

import { connect } from 'react-redux';
import { IExpensesReportOverviewProps, mapStateToProps, mapDispatchToProps } from './IExpensesReportOverviewProps';

const ExpensesReportOverviewContainer: FC<IExpensesReportOverviewProps> = (props: IExpensesReportOverviewProps) => {
    const [EmployeesOptions, setEmployeesOptions] = useState<IComboBoxOption[]>();
    const [currentEmployeeId, setCurrentEmployeeId] = useState<string>('');

    useEffect(() => {
        if (props.searchProps.fromDate && props.searchProps.toDate) {
            props.getExpenses({
                employeeId: null,
                status: APPROVED,
                fromDate: props.searchProps.fromDate,
                toDate: props.searchProps.toDate,
            });
            props.getEmployees();
        }
    }, [props.getExpenses, props.getEmployees, props.searchProps.fromDate, props.searchProps.toDate]);

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
        option?: IComboBoxOption,
    ): void => {
        if (option) {
            setCurrentEmployeeId(option.key.toString());
        }
    };

    return (
        <ContentContainer title="Компенсация расходов" showContent={props.expenses !== null}>
            <SelectPeriodComponent fromDate={props.searchProps.fromDate} toDate={props.searchProps.toDate} />

            <DetailToggleComponent isDetail={props.searchProps.isDetail} />

            {props.searchProps.isDetail && props.employees?.length !== 0 && (
                <ComboBox
                    label="Сотрудник"
                    options={EmployeesOptions}
                    selectedKey={currentEmployeeId}
                    onChange={_onChangeCurrentEmployee}
                    className="combobox-employee"
                />
            )}

            {props.isLoadingDocument && <Spinner label="Скачивание..." labelPosition="right" />}

            {props.expenses?.length === 0 && !props.expensesLoading && (
                <Label className="text-center">Нет данных для отображения</Label>
            )}

            {props.searchProps.isDetail && props.expenses?.length !== 0 && (
                <ExpensesReportDetailsComponent
                    expenses={
                        currentEmployeeId
                            ? props.expenses?.filter(exp => exp.employeeId === currentEmployeeId) || []
                            : props.expenses || []
                    }
                    isLoading={props.expensesLoading}
                    saveFile={props.saveFile}
                />
            )}

            {!props.searchProps.isDetail &&
                props.expenses?.length !== 0 &&
                props.searchProps.fromDate &&
                props.searchProps.toDate && (
                    <ExpensesReportOverviewComponent
                        expenses={props.expenses || []}
                        isLoading={props.expensesLoading}
                        fromDate={props.searchProps.fromDate}
                        toDate={props.searchProps.toDate}
                    />
                )}
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesReportOverviewContainer);
