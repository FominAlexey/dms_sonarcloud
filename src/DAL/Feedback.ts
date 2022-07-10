import baseAPI from './Config';
import { SERVER_URL, senderEmail } from './Constants';
import { getEmail } from 'src/shared/LocalStorageUtils';
import { AxiosResponse } from 'axios';

interface SendFeedBackMsg {
    from: string;
    subject: string;
    message: string;
}

export const sendFeedback = async (message: string): Promise<AxiosResponse> => {
    const sendGridMsg: SendFeedBackMsg = {
        from: senderEmail,
        subject: 'Devs feedback',
        message: message + ' Message From: ' + getEmail(),
    };

    return baseAPI.post(`${SERVER_URL}SendFeedBack/`, sendGridMsg);
};
