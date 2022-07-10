import React, { FC, useEffect } from 'react';
import ContentContainer from 'src/containers/ContentContainer/ContentContainer';
import ExpensesReportComponent from 'src/components/Reports/ExpensesReportComponent';

import { connect } from 'react-redux';

import { APPROVED } from 'src/shared/Constants';
import { Spinner } from '@fluentui/react';
import SelectPeriodComponent from 'src/components/Reports/SelectPeriodComponent';
import { IExpensesReportProps, mapStateToProps, mapDispatchToProps } from './IExpensesReportProps';

const ExpensesReportContainer: FC<IExpensesReportProps> = (props: IExpensesReportProps) => {
    useEffect(() => {
        if (props.searchProps.fromDate && props.searchProps.toDate) {
            const employeeId = props.match.params.employeeId;
            props.getEmployee(employeeId);
            props.getExpenses({
                employeeId,
                status: APPROVED,
                fromDate: props.searchProps.fromDate,
                toDate: props.searchProps.toDate,
            });
        }
    }, [props.getExpenses, props.getEmployee, props.searchProps.fromDate, props.searchProps.toDate, props.match]);

    return (
        <ContentContainer
            title={`Компенсация расходов для сотрудника "${props.employee?.fullName}"`}
            showContent={props.employee !== null && props.expenses !== null}
        >
            <SelectPeriodComponent fromDate={props.searchProps.fromDate} toDate={props.searchProps.toDate} />

            {props.isLoadingDocument && <Spinner label="Скачивание..." labelPosition="right" />}

            <ExpensesReportComponent
                expenses={props.expenses || []}
                isLoading={props.expensesLoading}
                saveFile={props.saveFile}
            />
        </ContentContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ExpensesReportContainer);
