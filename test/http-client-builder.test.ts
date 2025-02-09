import { buildHttpClient, newAbortSignal } from '../src/http-client-builder';
import nock from 'nock';
import { mockResponse } from './mocks';
import { preventDanglingOpenHandle } from './prevent-dangling-open-handle';

describe('http builder test', () => {
    beforeEach(() => {
        nock.cleanAll();
    });

    it('should create and use http client', async () => {
        nock('https://myservice').get('/entity').reply(200, mockResponse);
        const httpClient = buildHttpClient();
        const result = await httpClient.get('https://myservice/entity');
        expect(result.data).toEqual(mockResponse);
    });

    it('should create and use http client with baseUrl', async () => {
        nock('https://myservice').get('/entity').reply(200, mockResponse);
        const httpClient = buildHttpClient({ baseURL: 'https://myservice' });
        const result = await httpClient.get('/entity');
        expect(result.data).toEqual(mockResponse);
    });

    describe('timeout', () => {
        it('should timeout', async () => {
            expect.assertions(1);

            nock('https://myservice').get('/entity').delayConnection(2000).reply(200, mockResponse);

            const httpClient = buildHttpClient({ baseURL: 'https://myservice', signal: newAbortSignal(3000) });
            try {
                preventDanglingOpenHandle();

                await httpClient.get('/entity');

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                expect(e.message).toEqual('timeout of 2000ms exceeded');
            }
        });

        it("shouldn't timeout", async () => {
            expect.assertions(1);

            nock('https://myservice').get('/entity').delayConnection(2000).reply(200, mockResponse);
            const httpClient = buildHttpClient({ baseURL: 'https://myservice', timeout: 3000, signal: newAbortSignal(3000) });
            const result = await httpClient.get('/entity');
            expect(result.data).toEqual(mockResponse);
        });
    });

    describe('cancel', () => {
        it('should cancel', async () => {
            expect.assertions(1);

            nock('https://myservice').get('/entity').delayConnection(2000).reply(200, mockResponse);
            const httpClient = buildHttpClient({ baseURL: 'https://myservice', timeout: 5000 });
            try {
                preventDanglingOpenHandle();

                await httpClient.get('/entity');

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
                expect(e.message).toEqual('canceled');
            }
        });

        it("shouldn't cancel", async () => {
            expect.assertions(1);

            nock('https://myservice').get('/entity').delayConnection(2000).reply(200, mockResponse);
            const httpClient = buildHttpClient({ baseURL: 'https://myservice', timeout: 3000, signal: newAbortSignal(3000) });
            const result = await httpClient.get('/entity');
            expect(result.data).toEqual(mockResponse);
        });
    });
});
