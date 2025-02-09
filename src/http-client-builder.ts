import axios, { CreateAxiosDefaults } from 'axios';

export const buildHttpClient = (config?: CreateAxiosDefaults) => {
    const defaultTimeout = process.env.AXIOS_TIMEOUT ? +process.env.AXIOS_TIMEOUT : 2000;
    const defaultCancelTimeout = process.env.AXIOS_CANCEL_TIMEOUT ? +process.env.AXIOS_CANCEL_TIMEOUT : 2000;

    const httpClient = axios.create({
        timeout: defaultTimeout,
        signal: config?.signal ?? newAbortSignal(defaultCancelTimeout),
        ...config,
    });
    return httpClient;
};

// AbortSignal.timeout() is only supported with nodejs 17.3+
export const newAbortSignal = (timeoutMs: number) => {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs).unref();
    return abortController.signal;
};
