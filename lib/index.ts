export { responseDebounceErr, responseDebounce, requestDebounce } from "./interceptors/debounce";

export { requestRepairConfig } from "./interceptors/repairConfig";

export { requestGetAddTimeStamp } from "./interceptors/getAddTimeStamp";

export { requestFormUrlencoded } from "./interceptors/formUrlencoded";


export { buildResponseCache, requestCache } from "./interceptors/cache";

/**
 * 这个功能还不完善，不建议使用
 * This function is not perfect, not recommended
 */
export { buildRequestWaitToken } from "./interceptors/waitToken";



