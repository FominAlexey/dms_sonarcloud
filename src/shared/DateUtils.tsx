import { IProductionCalendar } from 'src/DAL/ProductionCalendar';
import moment from 'moment';

export const CALENDAR_LENGTH = 14;
export const WEEK_LENGTH = 7;

export const DAY_SHORT_NAMES = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
export const MONTH_NAMES = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
];
export const MONTH_SHORT_NAMES = [
    'янв',
    'фев',
    'март',
    'апр',
    'май',
    'июнь',
    'июль',
    'авг',
    'сент',
    'окт',
    'ноя',
    'дек',
];
export const DAY_NAMES = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

export const DAY_PICKER_STRINGS = {
    months: MONTH_NAMES,
    shortMonths: MONTH_SHORT_NAMES,
    days: DAY_NAMES,
    shortDays: DAY_SHORT_NAMES,
    goToToday: 'Сегодня',
    weekNumberFormatString: 'Номер недели {0}',
    prevMonthAriaLabel: 'Предыдущий месяц',
    nextMonthAriaLabel: 'Следующий месяц',
    prevYearAriaLabel: 'Предыдущий год',
    nextYearAriaLabel: 'Следующий год',
    prevYearRangeAriaLabel: 'Предыдущий диапазон',
    nextYearRangeAriaLabel: 'Следуюший диапазон',
    closeButtonAriaLabel: 'Закрыть',
};

// Employee's work experiense
export interface IExperiense {
    years: number;
    months: number;
    days: number;
}

// Returns employee's work experiens
export const getExperiense = (date: Date) => {
    let tempDate = moment(date.toJSON());
    const yearsDiff = moment().diff(moment(tempDate), 'years');

    tempDate = moment(tempDate).add(yearsDiff, 'years');
    const monthsDiff = moment().diff(moment(tempDate), 'months', true);

    tempDate = moment(tempDate).add(Math.trunc(monthsDiff), 'months');
    const daysDiff = moment().diff(moment(tempDate), 'days');

    const result: IExperiense = {
        years: yearsDiff,
        months: monthsDiff,
        days: daysDiff,
    };

    return result;
};

// Return string with employee's experiense
export const getExperienseString = (date: Date) => {
    const experiense = getExperiense(date);
    return `${experiense.years} г ${Math.trunc(experiense.months)} м ${experiense.days} д`;
};

// List of days of the week
export const ListOfDayNames = (startDate: Date, count: number) => {
    const startDay = new Date(startDate);
    const weekDays = [];
    for (let i = 0; i < count; i++) {
        weekDays[i] = {
            key: `${startDay.getDay()}_${i}`,
            content: DAY_SHORT_NAMES[startDay.getDay()],
        };
        startDay.setDate(startDay.getDate() + 1);
    }
    return weekDays;
};

// Prepare date to send to server
export const toUTC = (date: Date) => {
    return moment(date.toJSON()).utc(true).toDate();
};

export const getISOString = (date: Date): string => {
    return `${toUTC(date).toISOString().slice(0, 10)}`;
};

export const getNextDate = (date: Date): Date => {
    const nextdate = date.getDate() + 1;
    return new Date(date.getFullYear(), date.getMonth(), nextdate);
};

// Start of week, 1=monday
export const getStartOfWeek = (day: Date) => {
    return moment(day.toJSON()).startOf('isoWeek').toDate();
};

// End of week, 0=sunday
export const getEndOfWeek = (day: Date) => {
    return moment(day.toJSON()).endOf('isoWeek').toDate();
};

export const getStartOfMonth = (date: Date) => {
    return moment(date.toJSON()).startOf('month').toDate();
};

export const getEndOfMonth = (date: Date) => {
    return moment(date.toJSON()).endOf('month').toDate();
};

export const getDateFromLocaleString = (dateString: string) => {
    const d = dateString.split('.');
    return new Date(Number.parseInt(d[2]), Number.parseInt(d[1]) - 1, Number.parseInt(d[0]));
};

// Return count of days between two dates
export const getDaysCount = (startDate: Date, endDate: Date | null) => {
    //return endDate ? moment(endDate.toJSON()).diff(moment(startDate.toJSON()), 'days', true) : 1
    const oneDay = 24 * 60 * 60 * 1000;
    return endDate ? Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay) + 1) : 1;
};

export const getMonthsByPeriod = (fromDate: Date, toDate: Date) => {
    const _months = [];
    let startDate = fromDate;
    do {
        _months.push(new Date(startDate.getFullYear(), startDate.getMonth()));
        startDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1);
    } while (moment(startDate).isSameOrBefore(toDate, 'month'));
    return _months;
};

// Change date on <value> days
export const changeDateByValue = (date: Date, value: number): Date => {
    return moment(date.toJSON())
        .add(value - 1, 'days')
        .toDate();
};

export const isWorkingDay = (date: Date, productionCalendar: IProductionCalendar[]): boolean => {
    const currentMonthWeekends =
        productionCalendar.find(md => md.year === date.getFullYear())?.months[date.getMonth()] || [];
    if (currentMonthWeekends.includes(date.getDate())) {
        return false;
    }
    return true;
};

// Return count of working days between two dates
export const getWorkingDays = (
    fromDate: Date,
    toDate: Date | null,
    productionCalendar: IProductionCalendar[],
): number => {
    let num = 0;

    if (!toDate) {
        toDate = fromDate;
    }

    const _fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());

    const _toDate = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

    while (_fromDate <= _toDate) {
        if (isWorkingDay(_fromDate, productionCalendar)) {
            num++;
        }
        _fromDate.setDate(_fromDate.getDate() + 1);
    }
    return num;
};
