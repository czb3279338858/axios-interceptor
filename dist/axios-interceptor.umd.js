(function(s,u){typeof exports=="object"&&typeof module!="undefined"?u(exports,require("axios")):typeof define=="function"&&define.amd?define(["exports","axios"],u):(s=typeof globalThis!="undefined"?globalThis:s||self,u(s.AxiosInterceptor={},s.axios))})(this,function(s,u){"use strict";var E=Object.defineProperty,g=Object.defineProperties;var x=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var F=Object.prototype.hasOwnProperty,G=Object.prototype.propertyIsEnumerable;var M=(s,u,a)=>u in s?E(s,u,{enumerable:!0,configurable:!0,writable:!0,value:a}):s[u]=a,i=(s,u)=>{for(var a in u||(u={}))F.call(u,a)&&M(s,a,u[a]);if(D)for(var a of D(u))G.call(u,a)&&M(s,a,u[a]);return s},c=(s,u)=>g(s,x(u));function a(e){return e&&typeof e=="object"&&"default"in e?e:{default:e}}var O=a(u);const p=e=>e===O.default.defaults.adapter,l=new Map,m=new Map;let S=0;function v(e){return function(t){if(!p(t.adapter))return t;const{checkToken:n,initToken:r,currentAxios:o,updateConfig:d}=e;if(n(t)||t._needToken)return t;l.size||r().then(()=>{l.forEach((w,C)=>{o.request(d(w)).then(U=>{var j;(j=m.get(C))==null||j(U),m.delete(C)})})}).finally(()=>{l.clear()}),l.set(++S,t);const k=new Promise((w,C)=>{m.set(S,w)});return c(i({},t),{adapter:()=>k})}}function A(e){const t=e.headers,n=e.method,r=t[n],o=t.common;["common","delete","get","head","post","put","patch"].forEach(k=>{delete t[k]});const b=Object.assign({},o,r,t);return c(i({},e),{headers:b})}const T=(e,t,n)=>{const r=t[0];if(t.length>1){const o=e[r];return typeof o!="object"||o===null?void 0:T(o,t.slice(1),n)}else e[r]=n},H=(e,t,n)=>T(e,t.split("."),n);let R=[];function f(e){const t=JSON.parse(JSON.stringify(e));return R.forEach(n=>{H(e,n,null)}),JSON.stringify(t)}R.push("params._timeStamp");function K(e){return e.method==="get"&&(e.params=c(i({},e.params),{_timeStamp:new Date().getTime()})),e}const _=(e,t="")=>{let n=[];for(const r in e){if(typeof r=="symbol")continue;const o=e[r];if(["symbol","function","undefined"].includes(typeof o))continue;const d=t?`${t}[${r}]`:`${r}`;typeof o=="object"&&o!==null?n.push(_(o,d)):n.push(`${encodeURIComponent(d)}=${encodeURIComponent(o===null?"":o)}`)}return n.join("&")};function $(e){const t=e.headers,n=t==null?void 0:t["Content-Type"],r=e.data;return n==="application/x-www-form-urlencoded"&&typeof r!="string"?c(i({},e),{data:_(r)}):n==="application/json"&&typeof r!="string"?c(i({},e),{data:JSON.stringify(r)}):e}const h=new Map,y=new Map;function I(e){if(!p(e.adapter))return e;const t=f(e),n=h.get(t);if(n)return c(i({},e),{adapter:n});{const r=new Promise((d,b)=>{y.set(t,d)}),o=()=>r;return h.set(t,o),e}}function J(e){const t=f(e.config),n=y.get(t);return n&&(n(e),h.delete(t),y.delete(t)),e}const q=new Map;function N(e){if(!p(e.adapter))return e;if(e._cache){const t=f(e),n=q.get(t);return n?c(i({},e),{adapter:async()=>n}):e}return e}function P(e){return t=>{const{config:n,data:r}=t;if(n._cache&&t.status===200&&(!e||r[e.statusKey]===e.successCode)){const o=f(n);q.get(o)||q.set(o,t)}return t}}s.buildRequestWaitToken=v,s.buildResponseCache=P,s.requestCache=N,s.requestDebounce=I,s.requestFormUrlencoded=$,s.requestGetAddTimeStamp=K,s.requestRepairConfig=A,s.responseDebounce=J,Object.defineProperties(s,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
