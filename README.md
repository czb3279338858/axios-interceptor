# axios-interceptor

## Project setup
```
npm install axios-interceptor
```

## Example
### useInterceptor
``` ts
const selfAxios = axios.create()
const {
  // A method for re-initiating failed requests.
  doRetry
} = useInterceptor({
  axios: selfAxios,
  // A method for obtaining the unique value of the request, used to determine whether it is the same request in the request interceptor and the response interceptor. useCache relies on it to get the data in the cache, useDebounce relies on it to determine whether it is the same request, whether it needs to be merged.
  // It provides an [internal getKey](https://github.com/czb3279338858/axios-interceptor/blob/3.0/lib/getKey.ts).
  getKey: (config: InternalAxiosRequestConfig) => JSON.stringify(config),
  // Using the data caching feature, data is only cached when isSuccess returns true.
  useCache: {
    isSuccess: (value: AxiosResponse) => value.status >= 200 && value.status < 300
  },
  // Using the request deduplication feature, when a request has not returned, but is initiated again elsewhere, they will be merged into one.
  // But be aware that some interfaces cannot be deduplicated, such as the interface for obtaining the unique id of the uploaded file.
  useDebounce: true,
  // Add a timestamp parameter to the get request.
  useTimestamp: {
    timestampKey: 'timestamp'
  },
  // When a request fails, it is allowed to re-initiate the request through the doRetry method. The return of isRetry determines whether the request needs to be added to the re-initiation queue.
  useRetry: {
    isRetry: (err: AxiosError) => !!err.response?.status && err.response.status >= 500 && err.response.status < 600
  },
  // The requestListChange method is called when the queue of pending requests changes, and the queue is passed as a parameter. For example, after a request is responded, the number of requests in the queue decreases by 1, and the requestListChange method is triggered.
  useChange: {
    requestListChange: (configs: AxiosRequestConfig[]) => console.log(configs)
  }
})
```

### useCache
``` ts
async function getUserInfo() {
  const { 
    data,
    // Requests with the _cache parameter will additionally return a _delCacheFun in the response to delete this cache.
    // This is useful for limiting the lifetime of the cache. For example, a cache for an interface is only valid on the current page, and when the page is destroyed, the cache should also be destroyed.
    _delCacheFun
  } = await selfAxios.get('https://.../getUserInfo', {
    // This request needs to cache the response data.
    _cache: true
  })
}

const userInfo = await getUserInfo()
// It additionally returns the _delCache method, which is used to delete the data cached by the getUserInfo request, commonly used for manually deleting data that has a certain lifespan.
userInfo._delCache()
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

### useDebounce
``` ts
async function getUserInfo() {
  const res = await selfAxios.get('https://.../getUserInfo', {
    // This request does not need to be deduplicated, such as the interface for obtaining a unique id.
    _noDebounce: true,
  })
}
```