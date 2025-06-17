import { QueryClient } from '@tanstack/react-query';

export const client = new QueryClient();

export const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getAllData = async (url, configuration) => {
    try {
        const response = await fetch(url, configuration);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`${data.message}`);
        }
        return data;
    } catch (error) {
        throw new Error(`${error.message}`);
    }
};

export const sendRequest = async ({ url, configuration }) => {
    try {
        const response = await fetch(url, configuration);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`${data.message}`);
        } else {
            return { statusCode: response.status, data };
        }
    } catch (error) {
        throw new Error(`${error.message}`);
    }
};
