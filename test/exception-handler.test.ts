/* eslint-disable @typescript-eslint/no-explicit-any */
import nock from 'nock';
import { buildHttpClient } from '../src/http-client-builder';
import { handleException } from '../src/exception-handler';
import { preventDanglingOpenHandle } from './prevent-dangling-open-handle';
import { mockResponse } from './mocks';

describe('Exception handler', () => {
    describe('axios', () => {
        it('should recognise axios error', async () => {
            expect.assertions(1);

            nock('https://myservice').get('/entity').reply(500, mockResponse);

            const httpClient = buildHttpClient({ baseURL: 'https://myservice' });
            try {
                preventDanglingOpenHandle();

                await httpClient.get('/entity');
            } catch (e: any) {
                const { isAxiosError } = handleException(e);
                expect(isAxiosError).toBeTruthy();
            }
        });

        it('should get axios error details', async () => {
            expect.assertions(5);

            nock('https://myservice').get('/entity').reply(500, mockResponse);

            const httpClient = buildHttpClient({ baseURL: 'https://myservice' });
            try {
                preventDanglingOpenHandle();

                await httpClient.get('/entity');
            } catch (e: any) {
                const { message, axiosError, data, statusCode, statusText } = handleException(e);
                expect(message).toEqual('Request failed with status code 500');
                expect(axiosError).toEqual(e);
                expect(data).toEqual(mockResponse);
                expect(statusCode).toEqual(500);
                // Status message is not currently supported by Nock
                expect(statusText).toBeUndefined();
            }
        });
    });

    describe('Error', () => {
        const error = new Error("I'm a bad error I am!");

        it('should not recognise Error as axios error', () => {
            expect.assertions(1);
            try {
                throw error;
            } catch (e: any) {
                const { isAxiosError } = handleException(e);
                expect(isAxiosError).toBeFalsy();
            }
        });

        it('should get Error details', () => {
            expect.assertions(5);
            try {
                throw error;
            } catch (e: any) {
                const { message, axiosError, data, statusCode, statusText } = handleException(e);
                expect(message).toEqual("I'm a bad error I am!");
                expect(axiosError).toBeUndefined();
                expect(data).toBeUndefined();
                expect(statusCode).toBeUndefined();
                expect(statusText).toBeUndefined();
            }
        });
    });

    describe('non-Error', () => {
        const error = "I'm not such a bad error!";

        it('should not recognise non-Error as axios error', () => {
            expect.assertions(1);
            try {
                throw error;
            } catch (e: any) {
                const { isAxiosError } = handleException(e);
                expect(isAxiosError).toBeFalsy();
            }
        });

        it('should get non-Error details', () => {
            expect.assertions(5);
            try {
                throw error;
            } catch (e: any) {
                const { message, axiosError, data, statusCode, statusText } = handleException(e);
                expect(message).toEqual("I'm not such a bad error!");
                expect(axiosError).toBeUndefined();
                expect(data).toBeUndefined();
                expect(statusCode).toBeUndefined();
                expect(statusText).toBeUndefined();
            }
        });
    });
});
