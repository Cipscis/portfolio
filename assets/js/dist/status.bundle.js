(()=>{"use strict";const e={},t=function(s,n){const o=s.split(/\s+/).filter((e=>!!e));if(o.length>1)for(const e of o)t(e,n);else{s in e||(e[s]=[]);const t=e[s];!1===t.includes(n)&&t.push(n)}},s=function(e){const t="data-autohide-timeout",s={SUCCESS:"SUCCESS",ERROR:"ERROR"},n={[s.SUCCESS]:"success",[s.ERROR]:"error",hidden:"hidden"},o={_initSubscriptions:function(){e&&(e("/status/success",o.success),e("/status/error",o.error),e("/status/hide",o.hide))},_getEl:function(e){return"string"==typeof e?e=document.querySelector(e):e instanceof NodeList?e=e[0]:void 0===e&&(e=document.querySelector(".js-status")),e||console.error("No status element could be found"),e},_clearType:function(e){for(let t in s){let s=n[t];e.classList.contains(s)&&e.classList.remove(s)}},_setType:function(e,t){let s=n[e];s?(o._clearType(t),window.setTimeout((()=>t.classList.add(s)),10)):console.error("No CSS class is defined for status type "+e)},_clearMessage:function(e){e.textContent=""},_setMessage:function(e,t){o._clearMessage(t),window.setTimeout((()=>t.textContent=e),100)},_show:function(e,t,s,i){o._setType(t,s),o._setMessage(e,s),s.classList.remove(n.hidden),o._setAutohide(s,i)},_setAutohide:function(e,s){if(o._clearAutohide(e),s&&s>0){let n=window.setTimeout((()=>o.hide(e)),s);e.setAttribute(t,n)}},_clearAutohide:function(e){let s=e.getAttribute(t);s&&(window.clearTimeout(s),e.removeAttribute(t))},hide:function(e){(e=o._getEl(e)).classList.add(n.hidden),o._clearAutohide(e)},success:function(e,t,n){t=o._getEl(t),o._show(e,s.SUCCESS,t,n)},error:function(e,t,n){t=o._getEl(t),o._show(e,s.ERROR,t,n)}};return o._initSubscriptions(),{hide:o.hide,success:o.success,error:o.error}}(t),n=new Map;function o(e,t,s){if("string"==typeof e)try{e=document.querySelectorAll(e)}catch(t){throw new DOMException(`${s===c?"deactivate":"activate"} failed because it was passed an invalid selector string: '${e}'`)}e instanceof HTMLElement?s(e,t):e.forEach((e=>s(e,t)))}function i(e,t){if(!(e instanceof HTMLElement))throw new TypeError("activate failed because a valid HTMLElement was not passed");if(!(r(e,t)||(e.addEventListener("click",t),e instanceof HTMLButtonElement))){!1===a(e)&&e.addEventListener("keydown",u);const s=function(e){return function(t){if(l(t))return e.call(this,t)}}(t);e.addEventListener("keyup",s);const o={spacebarFn:s};if(!(e instanceof HTMLAnchorElement)){const s=function(e){return function(t){if(function(e){return!(!e.key||"enter"!==e.key.toLowerCase())}(t))return e.call(this,t)}}(t);e.addEventListener("keydown",s),o.enterFn=s}!function(e,t,s){let o=n.get(e);o||(o=new Map([[t,s]]),n.set(e,o));let i=o.get(t);i?Object.assign(i,s):(i=Object.assign({},s),o.set(t,i))}(e,t,o)}}function c(e,t){if(!(e instanceof HTMLElement))throw new TypeError("deactivate failed because a valid HTMLElement was not passed");e.removeEventListener("click",t);const s=r(e,t);s&&(e instanceof HTMLButtonElement||(s.spacebarFn&&e.removeEventListener("keyup",s.spacebarFn),e instanceof HTMLAnchorElement||s.enterFn&&e.removeEventListener("keydown",s.enterFn),function(e,t){const s=n.get(e);s&&(s.delete(t),n.delete(e))}(e,t),!1===a(e)&&e.removeEventListener("keydown",u)))}function r(e,t){const s=n.get(e);if(s)return s.get(t)}function a(e){return n.has(e)}function u(e){const t=this,s=t instanceof HTMLButtonElement,n=t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement,o=l(e);s||n||!o||e.preventDefault()}function l(e){return!(!e.key||" "!==e.key&&"spacebar"!==e.key.toLowerCase())}function d(e,t){o(e,t,i)}d(".js-status-example-success",(()=>s.success("Success :)"))),d(".js-status-example-error",(()=>s.error("Error :("))),d(".js-status-example-hide",(()=>s.hide())),d(".js-status-example-custom",(()=>s.success("Custom success :)",".js-status-custom"))),d(".js-status-example-custom-hide",(()=>s.hide(".js-status-custom"))),d(".js-status-example-autohide",(()=>s.success("This message will hide in 10 seconds",void 0,1e4)))})();
//# sourceMappingURL=status.bundle.js.map