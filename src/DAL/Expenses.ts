import baseAPI from './Config';
import { SERVER_URL } from './Constants';
import { AxiosResponse } from 'axios';
import { stringify } from 'querystring';
import { getISOString } from 'src/shared/DateUtils';

// Interfaces
export interface Expense {
    id: string;
    employeeId: string;
    employeeName: string;
    expenseCategory: string;
    documentId: number | null;
    documentName: string | null;
    documentUrl: string | null;
    description: string;
    amount: number;
    transactionDate: Date;
    paymentDate: Date | null;
    approvalStatusId: string;
    approvalStatus: string;
    currency: string;
    paymentMethod: string;
    managerName: string | null;
}

export interface ExpenseEdit {
    id: string;
    employeeId: string;
    approvalStatusId: string;
    expenseCategoryId: string;
    documentId: number | null;
    description?: string;
    amount: number;
    transactionDate: Date;
    paymentDate: Date | null;
    currencyId: string;
    paymentMethodId: string;
    managerId: string | null;
}

export interface ExpenseFromServer {
    id: string;
    employeeId: string;
    employeeName: string;
    expenseCategory: string;
    documentId: number | null;
    documentName: string;
    documentUrl: string;
    description: string;
    amount: number;
    transactionDate: string;
    paymentDate: string | null;
    approvalStatusId: string;
    approvalStatus: string;
    currency: string;
    paymentMethod: string;
    managerName: string | null;
}

export interface ExpenseEditFromServer {
    id: string;
    employeeId: string;
    approvalStatusId: string;
    expenseCategoryId: string;
    documentId: number | null;
    description: string;
    amount: number;
    transactionDate: string;
    paymentDate: string | null;
    currencyId: string;
    paymentMethodId: string;
    managerId: string | null;
}

// Map methods
export const mapExpenseFromServer = (expense: ExpenseFromServer): Expense => ({
    ...expense,
    transactionDate: new Date(expense.transactionDate),
    paymentDate: expense.paymentDate ? new Date(expense.paymentDate) : null,
});

export const mapExpenseEditFromServer = (expense: ExpenseEditFromServer): ExpenseEdit => ({
    ...expense,
    transactionDate: new Date(expense.transactionDate),
    paymentDate: expense.paymentDate ? new Date(expense.paymentDate) : null,
});

// Const lists
export const Currencies = [
    {
        currencyId: '834394d1-00cf-4b1a-9b97-599d0ddfcf73',
        title: 'RUB',
    },
    {
        currencyId: '793aa59b-f6b5-4a22-be36-fc6408b97bed',
        title: 'USD',
    },
    {
        currencyId: 'fff2c883-f53e-4c7b-a69e-76d0989430b0',
        title: 'EUR',
    },
];

export const PaymentMethods = [
    {
        paymentMethodId: '2f74f23e-e1cd-493c-aa4a-852e81b31fc0',
        title: 'Личная карта',
    },
    {
        paymentMethodId: '8beb4b66-5aae-48b4-b9c6-dd0da189fa2e',
        title: 'Корпоративная карта',
    },
    {
        paymentMethodId: '3ee56d63-0fbc-4107-8159-59e98b6cc006',
        title: 'Наличные',
    },
];

// Fetch methods
export const getExpenses = async (
    employeeId: string | null,
    status: string | null,
    fromDate: Date | null,
    toDate: Date | null,
): Promise<AxiosResponse<ExpenseFromServer[]>> => {
    const query = {
        employeeId: employeeId,
        approvalStatusId: status,
        fromDate: fromDate ? getISOString(fromDate) : null,
        toDate: toDate ? getISOString(toDate) : null,
    };

    return baseAPI.get(`${SERVER_URL}Expenses?${stringify(query)}`);
};

export const getExpense = async (id: string): Promise<AxiosResponse<ExpenseEditFromServer>> => {
    return baseAPI.get(`${SERVER_URL}Expenses/${id}`);
};

export const postExpense = async (expense: ExpenseEdit): Promise<AxiosResponse> => {
    return baseAPI.post(`${SERVER_URL}Expenses/`, expense);
};

export const putExpense = async (expense: ExpenseEdit): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}Expenses/${expense.id}`, expense);
};

export const putExpenseChangeStatus = async (id: string, newStatusId: string): Promise<AxiosResponse> => {
    return baseAPI.put(`${SERVER_URL}Expenses/ChangeStatus/${id}?newStatusId=${newStatusId}`);
};

export const deleteExpense = async (id: string): Promise<AxiosResponse> => {
    return baseAPI.delete(`${SERVER_URL}Expenses/${id}`);
};

// Files
export const uploadFile = async (file: FormData): Promise<AxiosResponse<number>> => {
    return baseAPI.post(`${SERVER_URL}files/`, file);
};

export const saveFile = async (id: number): Promise<AxiosResponse> => {
    return baseAPI.get(`${SERVER_URL}files/${id}`, 'blob');
};
