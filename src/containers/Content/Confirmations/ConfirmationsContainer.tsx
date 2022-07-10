import React, { FC, useEffect } from 'react';

import { connect } from 'react-redux';

import { CREATED, zeroGuid } from 'src/shared/Constants';
import { IConfirmationsProps, mapStateToProps, mapDispatchToProps } from './IConfirmationsProps';
import EventLogConfirmationsComponent from 'src/components/Confirmations/EventLogConfirmationsComponent';
import ExpenseConfirmationsComponent from 'src/components/Confirmations/ExpenseConfirmationsComponent';

const ConfirmationsContainer: FC<IConfirmationsProps> = (props: IConfirmationsProps) => {
    useEffect(() => {
        props.getExpenses({ employeeId: null, status: CREATED, fromDate: null, toDate: null });
    }, [props.getExpenses, props.needToUpdateExpenses]);

    useEffect(() => {
        props.getEventLogs({ employeeId: null, status: CREATED, fromDate: null, toDate: null, currentUser: true });
    }, [props.getEventLogs, props.needToUpdateEventLogs]);

    const expenseId = props.currentExpense ? props.currentExpense.id : zeroGuid;
    const eventLogId = props.currentEventLog ? props.currentEventLog.id : zeroGuid;

    return (
        <>
            {/* Expenses confirmations */}
            <ExpenseConfirmationsComponent
                expenseId={expenseId}
                expenses={props.expenses}
                currentExpense={props.currentExpense}
                expensesLoading={props.expensesLoading}
                isDeletingExpense={props.isDeletingExpense}
                patchExpense={props.patchExpense}
                clearExpense={props.clearExpense}
                deletingExpense={props.deletingExpense}
                deleteExpense={props.deleteExpense}
                saveFile={props.saveFile}
            />

            {/* EventLogs confirmations */}
            <EventLogConfirmationsComponent
                eventLogId={eventLogId}
                eventLogs={props.eventLogs}
                currentEventLog={props.currentEventLog}
                eventLogsLoading={props.eventLogsLoading}
                isDeletingEventLog={props.isDeletingEventLog}
                patchEventLog={props.patchEventLog}
                clearEventLog={props.clearEventLog}
                deletingEventLog={props.deletingEventLog}
                deleteEventLog={props.deleteEventLog}
            />
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmationsContainer);
