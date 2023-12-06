# axios-interceptor

## Project setup
```
npm install axios-interceptor
```

## Example
- To make the request cache the response data, so that the same interface does not need to fetch from the backend again when it is initiated again. For example: the interface for getting the current user information.
``` js
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { useCacheInterceptor } from 'axios-interceptor'
export const selfAxios = axios.create()

useCacheInterceptor({
  axios: selfAxios,
  // Optional, used to determine whether the request has been successfully responded, and only the data of successful responses will be cached. The default is as follows:
  isSuccessResponse: (value: AxiosResponse): boolean => {
    return value.status >= 200 && value.status < 300
  },
  // Optional, used to determine the uniqueness of a request. The default getKey logic is listed separately below.
  getKey(config: InternalAxiosRequestConfig): string {
   ... 
  }
})
```
``` js
async function getUserInfo() {
  const res = await selfAxios.get('https://.../getUserInfo', {
    // This request needs to cache the response data.
    _cache: true
  })
}
```
``` ts
async function postUserInfo() {
  const res = await selfAxios.get('https://.../postUserInfo', {
    // Updated the user data, and deleted the cache of the possible user data retrieval interface in the cacheMap.
    _delCache(cacheMap: CacheMap){
      for (const [key, value] of cacheMap) {
        if (value.config.url?.includes('https://.../getUserInfo')) {
          cacheMap.delete(key)
          break
        }
      }
    }
  })
}
```

- When the same request is initiated again before the response returns, they will be merged into one, and only one request will be sent to the backend. This is very useful for code organization.
  - For example: getUserManagement and getUserSkills, these two interfaces both depend on the response data of getUserInfo. You can complete the entire asynchronous logic in their respective functions without worrying about whether getUserInfo is repeatedly called.
``` js
import axios, { InternalAxiosRequestConfig } from "axios";
import { useDebounceInterceptor } from 'axios-interceptor'
export const selfAxios = axios.create()
useDebounceInterceptor({ 
  axios: selfAxios,
  // Optional, used to determine the uniqueness of a request. The default getKey logic is listed separately below.
  getKey(config: InternalAxiosRequestConfig): string {
   ... 
  }
})
```
``` js
async function getUserInfo() {
  const res = await selfAxios.get('https://.../getUserInfo', {
    // This request does not need to be deduplicated, such as the interface for obtaining a unique id.
    _noDebounce: true,
  })
}
```

- Wait for some asynchronous actions to complete before initiating the request. For example: In WeChat mini programs, you need to obtain the current user’s authorization token before initiating other business requests.
``` js
import axios, { InternalAxiosRequestConfig } from "axios";
import { useAwaitInterceptor } from 'axios-interceptor'
const selfAxios = axios.create()
useAwaitInterceptor({
  axios: selfAxios,
  awaitFun(config: InternalAxiosRequestConfig) {
    if (config._awaitSign === 'await') {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('')
        }, 1000)
      })
    }
  }
})
```
``` js
async function getUserInfo() {
  const res = await selfAxios.get('https://.../getUserInfo', {
    // Optional, in the registered awaitFun, different asynchronous logic can be executed according to different _awaitSign.
    _awaitSign: 'await',
  })
}
```

- Add a timestamp parameter to the get request.
``` js
useTimestampInterceptor({
  axios: selfAxios,
  // Optional, The default is as follows:
  timestampKey: 'timestamp'
})
```

## getKey
- useCacheInterceptor and useDebounceInterceptor both rely on the built-in method getKey to determine whether it is the same request. Please refer to the [source code](https://github.com/czb3279338858/axios-interceptor/blob/2.0/lib/getKey.ts) for the specific implementation.
