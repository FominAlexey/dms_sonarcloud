const { IsDayOffAPI } = require('isdayoff');
export interface IProductionCalendar {
    year: number;
    months: number[][];
}

interface IProductionCalendarFromServer {
    'Год/Месяц': string;
    Январь: string;
    Февраль: string;
    Март: string;
    Апрель: string;
    Май: string;
    Июнь: string;
    Июль: string;
    Август: string;
    Сентябрь: string;
    Октябрь: string;
    Ноябрь: string;
    Декабрь: string;
}

const productionCalendar: { [key: string]: string } = {
    Январь: '',
    Февраль: '',
    Март: '',
    Апрель: '',
    Май: '',
    Июнь: '',
    Июль: '',
    Август: '',
    Сентябрь: '',
    Октябрь: '',
    Ноябрь: '',
    Декабрь: '',
};

interface IProductionCalendarProperties {
    api: typeof IsDayOffAPI;
    monthsOfTheYear: string[];
    workingDaysOfMonthsOfTheYear: number[];
    valueYear: number;
}

const ProductionCalendarProperties: IProductionCalendarProperties = {
    api: null,
    monthsOfTheYear: [],
    workingDaysOfMonthsOfTheYear: [],
    valueYear: NaN,
};

export const getProductionCalendar = async (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        ProductionCalendarProperties.api = new IsDayOffAPI();
        ProductionCalendarProperties.monthsOfTheYear = Object.keys(productionCalendar);
        ProductionCalendarProperties.valueYear = new Date().getFullYear();

        productionCalendar['Год/Месяц'] = ProductionCalendarProperties.valueYear.toString();

        // Получение выходных на текущий год
        for (let monthNumber = 0; monthNumber < 12; monthNumber++) {
            await ProductionCalendarProperties.api.month({ month: monthNumber }).then((res: []) => {
                ProductionCalendarProperties.workingDaysOfMonthsOfTheYear = [];
                // Конвертация массив из нулей и единиц в даты
                res.forEach((element, index) => {
                    if (element === 1) {
                        ProductionCalendarProperties.workingDaysOfMonthsOfTheYear.push(index + 1);
                    }
                });

                productionCalendar[ProductionCalendarProperties.monthsOfTheYear[monthNumber]] =
                    ProductionCalendarProperties.workingDaysOfMonthsOfTheYear.toString();
            });
        }
        resolve(new Array(productionCalendar));
    });
    // return axios(SERVER_URL + 'govrucalendar', generateFetchConfigAxios('GET'));
};

// Returns array of nums unworking days for a month
const getProductionMonth = (monthString: string): number[] => {
    return (
        monthString
            .split(',')
            // filter shortened days
            .filter(m => !m.includes('*'))
            .map(item => {
                return Number.parseInt(item);
            })
    );
};

export const mapProductionCalendarFromServer = (
    productionCalendar: IProductionCalendarFromServer,
): IProductionCalendar => ({
    year: Number.parseInt(productionCalendar['Год/Месяц']),
    months: [
        getProductionMonth(productionCalendar.Январь),
        getProductionMonth(productionCalendar.Февраль),
        getProductionMonth(productionCalendar.Март),
        getProductionMonth(productionCalendar.Апрель),
        getProductionMonth(productionCalendar.Май),
        getProductionMonth(productionCalendar.Июнь),
        getProductionMonth(productionCalendar.Июль),
        getProductionMonth(productionCalendar.Август),
        getProductionMonth(productionCalendar.Сентябрь),
        getProductionMonth(productionCalendar.Октябрь),
        getProductionMonth(productionCalendar.Ноябрь),
        getProductionMonth(productionCalendar.Декабрь),
    ],
});
