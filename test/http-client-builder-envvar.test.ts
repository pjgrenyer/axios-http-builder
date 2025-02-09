import { buildHttpClient, newAbortSignal } from '../src/http-client-builder';
import nock from 'nock';
import { mockResponse } from './mocks';

describe('http builder test', () => {
    beforeEach(() => {
        nock.cleanAll();
    });

    describe('envvars', () => {
        it('should use timeout envvar', async () => {
            expect.assertions(1);

            const originalAxiosTimeout = process.env.AXIOS_TIMEOUT;
            try {
                process.env.AXIOS_TIMEOUT = '3000';

                nock('https://myservice').get('/entity').delayConnection(2000).reply(200, mockResponse);
                const httpClient = buildHttpClient({ baseURL: 'https://myservice', signal: newAbortSignal(4000) });
                const result = await httpClient.get('/entity');
                expect(result.data).toEqual(mockResponse);
            } finally {
                process.env.AXIOS_TIMEOUT = originalAxiosTimeout;
            }
        });

        it('should use cancel timeout envvar', async () => {
            expect.assertions(1);

            const originalAxiosCancelTimeout = process.env.AXIOS_CANCEL_TIMEOUT;
            try {
                process.env.AXIOS_CANCEL_TIMEOUT = '3000';

                nock('https://myservice').get('/entity').delayConnection(2000).reply(200, mockResponse);
                const httpClient = buildHttpClient({ baseURL: 'https://myservice', timeout: 4000 });
                const result = await httpClient.get('/entity');
                expect(result.data).toEqual(mockResponse);
            } finally {
                process.env.AXIOS_CANCEL_TIMEOUT = originalAxiosCancelTimeout;
            }
        });
    });
});
