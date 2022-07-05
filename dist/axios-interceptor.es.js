var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import axios from "axios";
const isDefaultAdapter = (adapter) => {
  return adapter === axios.defaults.adapter;
};
const waitingConfig = /* @__PURE__ */ new Map();
const waitingResolve = /* @__PURE__ */ new Map();
let currentIndex = 0;
function buildRequestWaitToken(arg) {
  return function(config) {
    if (!isDefaultAdapter(config.adapter))
      return config;
    const { checkToken, initToken, currentAxios, updateConfig } = arg;
    const check = checkToken(config);
    if (check || config._needToken)
      return config;
    if (!waitingConfig.size) {
      initToken().then(() => {
        waitingConfig.forEach((config2, key) => {
          currentAxios.request(updateConfig(config2)).then((response) => {
            var _a;
            (_a = waitingResolve.get(key)) == null ? void 0 : _a(response);
            waitingResolve.delete(key);
          });
        });
      }).finally(() => {
        waitingConfig.clear();
      });
    }
    waitingConfig.set(++currentIndex, config);
    const promise = new Promise((resolve, reject) => {
      waitingResolve.set(currentIndex, resolve);
    });
    return __spreadProps(__spreadValues({}, config), {
      adapter: () => promise
    });
  };
}
function requestRepairConfig(config) {
  const selfHeaders = config.headers;
  const method = config.method;
  const methodHeaders = selfHeaders[method];
  const commonHeaders = selfHeaders.common;
  const delHeaderKeys = ["common", "delete", "get", "head", "post", "put", "patch"];
  delHeaderKeys.forEach((key) => {
    delete selfHeaders[key];
  });
  const newHeaders = Object.assign({}, commonHeaders, methodHeaders, selfHeaders);
  return __spreadProps(__spreadValues({}, config), {
    headers: newHeaders
  });
}
const _lodashSet = (obj, path, value) => {
  const firstPath = path[0];
  if (path.length > 1) {
    const firstObj = obj[firstPath];
    if (typeof firstObj !== "object" || firstObj === null)
      return;
    return _lodashSet(firstObj, path.slice(1), value);
  } else {
    obj[firstPath] = value;
  }
};
const lodashSet = (obj, path, value) => {
  return _lodashSet(obj, path.split("."), value);
};
let clearKeys = [];
function getRequestKey(config) {
  const keyConfig = JSON.parse(JSON.stringify(config));
  clearKeys.forEach((path) => {
    lodashSet(config, path, null);
  });
  return JSON.stringify(keyConfig);
}
clearKeys.push("params._timeStamp");
function requestGetAddTimeStamp(config) {
  if (config.method === "get") {
    config.params = __spreadProps(__spreadValues({}, config.params), {
      _timeStamp: new Date().getTime()
    });
  }
  return config;
}
const qsStringify = (obj, prefix = "") => {
  let strList = [];
  for (const key in obj) {
    if (typeof key === "symbol")
      continue;
    const value = obj[key];
    if (["symbol", "function", "undefined"].includes(typeof value))
      continue;
    const k = prefix ? `${prefix}[${key}]` : `${key}`;
    if (typeof value === "object" && value !== null) {
      strList.push(qsStringify(value, k));
    } else {
      strList.push(`${encodeURIComponent(k)}=${encodeURIComponent(value === null ? "" : value)}`);
    }
  }
  return strList.join("&");
};
function requestFormUrlencoded(config) {
  const headers = config.headers;
  const contentType = headers == null ? void 0 : headers["Content-Type"];
  const data = config.data;
  if (contentType === "application/x-www-form-urlencoded" && typeof data !== "string") {
    return __spreadProps(__spreadValues({}, config), {
      data: qsStringify(data)
    });
  }
  if (contentType === "application/json" && typeof data !== "string") {
    return __spreadProps(__spreadValues({}, config), {
      data: JSON.stringify(data)
    });
  }
  return config;
}
const requestingAdapter = /* @__PURE__ */ new Map();
const requestingResolve = /* @__PURE__ */ new Map();
function requestDebounce(config) {
  if (!isDefaultAdapter(config.adapter))
    return config;
  const key = getRequestKey(config);
  const adapter = requestingAdapter.get(key);
  if (adapter) {
    return __spreadProps(__spreadValues({}, config), {
      adapter
    });
  } else {
    const promise = new Promise((resolve, reject) => {
      requestingResolve.set(key, resolve);
    });
    const adapter2 = () => promise;
    requestingAdapter.set(key, adapter2);
    return config;
  }
}
function responseDebounce(response) {
  const key = getRequestKey(response.config);
  const resolve = requestingResolve.get(key);
  if (resolve) {
    resolve(response);
    requestingAdapter.delete(key);
    requestingResolve.delete(key);
  }
  return response;
}
const cache = /* @__PURE__ */ new Map();
function requestCache(config) {
  if (!isDefaultAdapter(config.adapter))
    return config;
  if (config._cache) {
    const key = getRequestKey(config);
    const response = cache.get(key);
    if (response) {
      return __spreadProps(__spreadValues({}, config), {
        adapter: async () => {
          return response;
        }
      });
    } else {
      return config;
    }
  }
  return config;
}
function buildResponseCache(arg) {
  return (response) => {
    const { config, data } = response;
    if (config._cache && response.status === 200 && (!arg || data[arg.statusKey] === arg.successCode)) {
      const key = getRequestKey(config);
      if (!cache.get(key)) {
        cache.set(key, response);
      }
    }
    return response;
  };
}
export { buildRequestWaitToken, buildResponseCache, requestCache, requestDebounce, requestFormUrlencoded, requestGetAddTimeStamp, requestRepairConfig, responseDebounce };
