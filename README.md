英语很差，翻译来自于机器，希望你能看得懂中文 English is very poor. Translation comes from machines. I hope you can understand.

# 简介 brief introduction
- 提供了以下 axios 拦截器 The following axios interceptors are provided
  1. 以参数作为关键字缓存响应数据 Cache response data with parameters as keywords
  2. 在指定请求响应后清空指定缓存 Clear the specified cache after the specified request response
  2. 具有相同参数的请求在未响应前只会发起一次 Requests with the same parameters will only be initiated once before they are not responded to
  3. 为 get 请求添加时间戳参数 Add timestamp parameter for get request

# 示例
- [axios 拦截器使用方法 How to use the axios interceptor](https://github.com/czb3279338858/axios-interceptors/blob/main/src/utils/initSelfAxios.ts)
- 添加拦截器后 axios 的使用方法 How to use axios after adding interceptors
  1. [获取当前用户信息（带缓存） Get current user information (with cache)](https://github.com/czb3279338858/axios-interceptors/blob/main/src/request/axiosUser.ts)
  2. [更新当前用户信息响应后，清除当前用户信息的缓存 After updating the current user information response, clear the cache of the current user information](https://github.com/czb3279338858/axios-interceptors/blob/main/src/request/axiosUpdateUser.ts)
- 在 vue 中的运用 Application in vue
  1. [获取字典数据 Get dictionary data](https://github.com/czb3279338858/axios-interceptors/blob/main/src/utils/getDict.ts)
  2. [可直接绑定在 template 中的字典翻译函数 Dictionary translation function that can be directly bound in template](https://github.com/czb3279338858/axios-interceptors/blob/main/src/utils/transDict.ts)

# 初衷 original intention
- 有些数据在一个地方获取，在另一个地方使用，这导致难以维护 Some data is obtained in one place and used in another, which makes it difficult to maintain
  - 修改导致数据已经没有使用但依然被获取 The data has not been used but is still obtained due to modification
  - 修改导致数据依然在使用，但早于获取 The data is still in use due to modification, but it is earlier than the data obtained
  - 期望，在即将被使用的地方获取数据，但是这些获取只会发起一次请求 It is expected that the data will be obtained at the place where it will be used, but these acquisition will only be initiated once
- vue 中经常需要根据一组数据去获取某一项的 label，这导致难以维护 In vue, it is often necessary to obtain the label of an item according to a set of data, which makes it difficult to maintain
  - 首先，在 component 中定义一个 data，去保存即将获取的这一组数据 First, define a data in the component to save the group of data to be obtained
  - 其次，在 template 中绑定一个函数去处理这组数据，获取 label。 Secondly, bind a function in the template to process this set of data and obtain the label
  - 当获取 label 不在需要时，往往会忽略对这一组数据相关代码的处理 When it is not necessary to obtain the label, the processing of this group of data related codes is often ignored
  - 期望，一个函数能够被直接绑定在 template 中，维护时只需要删除它，不再需要处理其他问题 It is expected that a function can be directly bound in the template, and it only needs to be deleted during maintenance, and no other problems need to be handled
- 所以 therefore
  - 建立一个请求层，负责处理响应的缓存问题，使用该包实现 Establish a request layer to handle the response caching problem, and use this package to implement
  - 建立一个逻辑层，负责逻辑和 vue 响应状态的处理 Establish a logic layer to handle logic and vue response status

# 关于    
- 有任何疑问或建议请添加微信 WeiXin-CZB
- 关于这个项目的初衷请[查看](https://www.cnblogs.com/qq3279338858/p/16445704.html)
