import { AxiosError, isAxiosError } from 'axios';

export const handleException = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any
): {
    isAxiosError: boolean;
    message: string;
    axiosError?: AxiosError;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any;
    statusCode?: number;
    statusText?: string;
} => {
    const isAxios = isAxiosError(error);
    if (isAxios) {
        return {
            isAxiosError: isAxios,
            message: error.message,
            axiosError: error,
            data: valueOrUndefined(error.response?.data),
            statusCode: valueOrUndefined(error.response?.status),
            statusText: valueOrUndefined(error.response?.statusText),
        };
    } else if (error instanceof Error) {
        return {
            isAxiosError: isAxios,
            message: error.message,
        };
    }
    return {
        isAxiosError: isAxios,
        message: `${error}`,
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const valueOrUndefined = (value?: any) => value || undefined;
