import React, { FC, useState, useEffect } from 'react';
import { ShimmeredDetailsList } from '@fluentui/react/lib/ShimmeredDetailsList';
import { IColumn, IconButton } from '@fluentui/react';
import { Expense } from 'src/DAL/Expenses';
import { MONTH_NAMES, getMonthsByPeriod, getISOString } from 'src/shared/DateUtils';
import { IListItem } from 'src/shared/Common';
import moment from 'moment';

interface Props {
    expenses: Expense[];
    isLoading: boolean;
    fromDate: Date;
    toDate: Date;
}

const ExpensesReportOverviewComponent: FC<Props> = (props: Props) => {
    const [items, setItems] = useState<IListItem[]>([]);
    const [columns, setColumns] = useState<IColumn[] | []>([]);
    const [months, setMonths] = useState<Date[]>([]);

    // Get months
    useEffect(() => {
        const _months = getMonthsByPeriod(props.fromDate, props.toDate);
        setMonths(_months);
    }, [props.fromDate, props.toDate]);

    useEffect(() => {
        setItems(getExpenseReportItems(props.expenses, months, props.fromDate, props.toDate));
    }, [props.expenses, months, props.fromDate, props.toDate]);

    useEffect(() => {
        // Create columns
        let _columns: IColumn[] = [];

        // Attach employee column
        _columns.push({
            key: 'expensesReportOverview_employee',
            name: 'Сотрудник',
            fieldName: 'title',
            minWidth: 100,
            maxWidth: 200,
            isMultiline: true,
        });

        // Attach months columns
        _columns = _columns.concat(
            months.map(item => {
                return {
                    key: item.toString(),
                    name: MONTH_NAMES[item.getMonth()],
                    fieldName: item.toString(),
                    minWidth: 50,
                    maxWidth: 100,
                };
            }),
        );

        // Attach more btn column
        _columns.push({
            key: 'expensesReportOverview_moreBtn',
            name: '',
            fieldName: 'moreBtn',
            minWidth: 50,
            maxWidth: 100,
        });

        setColumns(_columns);
    }, [months]);

    return <ShimmeredDetailsList columns={columns} items={items} selectionMode={0} enableShimmer={props.isLoading} />;
};

const getEmployeeExpensesSummary = (_expenses: Expense[], _months: Date[]) => {
    let logs = [];

    logs = _months.map(item => {
        // Get monthly expenses
        const monthlyExpenses = _expenses.filter(exp => moment(exp.transactionDate).isSame(item, 'month'));
        if (monthlyExpenses.length === 0) {
            return {
                key: item,
                fieldName: item.toString(),
                content: <div>-</div>,
            };
        }
        // Get expenses by currencies
        const rubSum = monthlyExpenses
            .filter(exp => moment(exp.transactionDate).isSame(item, 'month') && exp.currency === 'RUB')
            .reduce((prev, current) => prev + current.amount, 0);
        const usdSum = monthlyExpenses
            .filter(exp => moment(exp.transactionDate).isSame(item, 'month') && exp.currency === 'USD')
            .reduce((prev, current) => prev + current.amount, 0);
        const eurSum = monthlyExpenses
            .filter(exp => moment(exp.transactionDate).isSame(item, 'month') && exp.currency === 'EUR')
            .reduce((prev, current) => prev + current.amount, 0);

        return {
            key: item,
            fieldName: item.toString(),
            content: (
                <div>
                    {rubSum !== 0 && <div>{rubSum.toFixed(2)} RUB</div>}
                    {usdSum !== 0 && <div>{usdSum.toFixed(2)} USD</div>}
                    {eurSum !== 0 && <div>{eurSum.toFixed(2)} EUR</div>}
                </div>
            ),
        };
    });
    return logs;
};

// Get unique emloyees from expenses list
const getEmployees = (_expenses: Expense[]) => {
    // Order by employeeName
    const expensesSort: Expense[] = JSON.parse(JSON.stringify(_expenses));
    expensesSort.sort((a, b) => (a.employeeName > b.employeeName ? 1 : -1));

    // Get unique Ids
    const uniqueIds = Array.from(new Set(expensesSort.map(item => item.employeeId)));

    // Get employees list
    const result = [];
    for (let i = 0; i < uniqueIds.length; i++) {
        result.push({
            employeeId: uniqueIds[i],
            fullName: expensesSort.find(exp => exp.employeeId === uniqueIds[i])?.employeeName,
        });
    }
    return result;
};

const getExpenseReportItems = (_expenses: Expense[], _months: Date[], fromDate: Date, toDate: Date): IListItem[] => {
    // Create employees items
    const _employees = getEmployees(_expenses);
    const _items = _employees.map(item => {
        return {
            key: item.employeeId,
            title: item.fullName,
            moreBtn: (
                <IconButton
                    iconProps={{ iconName: 'ChevronRightMed' }}
                    title="Подробнее"
                    href={`/Reports/ExpensesReport/${item.employeeId}?fromDate=${getISOString(
                        fromDate,
                    )}&toDate=${getISOString(toDate)}`}
                />
            ),
        };
    });

    // Attach expenses items
    for (let i = 0; i < _items.length; i++) {
        const _employeeExpenses = getEmployeeExpensesSummary(
            _expenses.filter(e => e.employeeId === _items[i].key),
            _months,
        );
        const _expensesItems = Object.assign({}, ..._employeeExpenses.map(key => ({ [key.fieldName]: key.content })));
        _items[i] = { ..._items[i], ..._expensesItems };
    }

    // Attach summary row
    let summaryItem = {
        key: '',
        title: 'Итого',
        moreBtn: <span></span>,
    };

    const _summaryExpenses = getEmployeeExpensesSummary(_expenses, _months);
    const _summaryExpensesItems = Object.assign({}, ..._summaryExpenses.map(key => ({ [key.fieldName]: key.content })));
    summaryItem = { ...summaryItem, ..._summaryExpensesItems };

    _items.push(summaryItem);

    return _items;
};

export default ExpensesReportOverviewComponent;
