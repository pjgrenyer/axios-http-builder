# axios-http-builder

[![NPM version](https://img.shields.io/npm/v/axios-http-builder.svg?style=flat-square)](https://www.npmjs.com/package/axios-http-builder)
[![NPM downloads](https://img.shields.io/npm/dm/axios-http-builder.svg?style=flat-square)](https://www.npmjs.com/package/axios-http-builder)
[![Code Style](https://img.shields.io/badge/code%20style-prettier-brightgreen.svg)](https://github.com/prettier/prettier)

An [axios](https://axios-http.com/) instance builder for use on client or server side with common features pre-configured:

- [Timeout](https://axios-http.com/docs/req_config)
- [Cancellation](https://axios-http.com/docs/cancellation)

By default, axios does not configure a timeout or a cancellation timeout. However, ```axios-http-builder``` sets both to 2 seconds by default, which remains configurable.

```axios-http-builder``` also includes an optional exception handler.

## Install

```
npm i -save axios-http-builder
```

## Usage

To use the default configuration, instantiate the axios instance with ```buildHttpClient``` and then use as normal:

```
import { buildHttpClient } from 'axios-http-builder';

const httpClient = buildHttpClient();
await httpClient.get('https://myservice/entity');
```

```buildHttpClient``` takes a ```CreateAxiosDefaults``` object, so you can use any of axios' options as normal:

```
import { buildHttpClient } from 'axios-http-builder';

const httpClient = buildHttpClient({ baseURL: 'https://myservice' });
await httpClient.get('/entity');
```

The ```axios-http-builder``` defaults are applied to the configuration, unless you specify your own:

```
import { buildHttpClient, newAbortSignal } from 'axios-http-builder';

const httpClient = buildHttpClient({ baseURL: 'https://myservice' , timeout: 3000, signal: newAbortSignal(3000)});
await httpClient.get('/entity');
```

The timeout and cancellation timeout can also be set using environment variables:

```
AXIOS_TIMEOUT=3000
AXIOS_CANCEL_TIMEOUT=3000
```

## Exception Handling

```axios-http-builder``` includes an optional exception handling function:

```
import { buildHttpClient, handleException } from 'axios-http-builder';

const httpClient = buildHttpClient({ baseURL: 'https://myservice' });
try {
    await httpClient.get('/entity');
} catch (e: any) {
    const { isAxiosError, message, axiosError, data, statusCode, statusText } = handleException(e);
    ...
}
```

```handleException``` analyses the exception to determine whether it is an ```AxiosError```, ```Error``` or something else. It always returns ```isAxiosError``` and ```message```. The other values are only returned if the exception is an ```AxiosError```. The intention is to provide a boilerplate function which handles ```AxiosError``` and other exceptions and always return the right exception message.

- ```isAxiosError``` - whether or not the exception is an ```AxiosError```
- ```message``` - the exception message
- ```axiosError``` - the ```AxiosError``` object. Although this is the same as the original exception, the type of the original exception is not recognised by the compiler, as it could be ```Error``` or something else. Only returned for ```AxiosError```s
- ```data``` - the body of the response. Only returned for ```AxiosError```s
- ```statusCode``` - the http status code. Only returned for ```AxiosError```s
- ```statusText``` - the http status text. Only returned for ```AxiosError```s

