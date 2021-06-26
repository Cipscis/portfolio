(()=>{"use strict";const e=[],{activate:t,deactivate:n}=function(){const t={activate:function(e,n){t._activator(e,n,t._activateSingle)},deactivate:function(e,n){t._activator(e,n,t._deactivateSingle)},_activator:function(e,n,i){if("string"==typeof e)try{e=document.querySelectorAll(e)}catch(n){let o=i===t._deactivateSingle?"deactivate":"activate";throw new DOMException(`${o} failed because it was passed an invalid selector string: '${e}'`)}e instanceof Node?i(e,n):e.length&&e.forEach&&e.forEach((e=>i(e,n)))},_activateSingle:function(e,n){if(e instanceof Node==0)throw new TypeError("activate failed because a valid Node was not passed");if(!t._getNodeBindings(e,n)&&(e.addEventListener("click",n),!1===t._isNodeType(e,"button"))){!1===t._getNodeHasBindings(e)&&e.addEventListener("keydown",t._preventSpacebarScroll);let i=t._makeSpacebarFn(n);e.addEventListener("keyup",i);let o={spacebarFn:i};if(!1===t._isNodeType(e,"a")){let i=t._makeEnterFn(n);e.addEventListener("keydown",i),o.enterFn=i}t._rememberNodeBindings(e,n,o)}},_deactivateSingle:function(e,n){if(e instanceof Node==0)throw new TypeError("deactivate failed because a valid Node was not passed");let i=t._getNodeBindings(e,n);e.removeEventListener("click",n),i&&!1===t._isNodeType(e,"button")&&(e.removeEventListener("keyup",i.spacebarFn),!1===t._isNodeType(e,"a")&&e.removeEventListener("keydown",i.enterFn),t._forgetNodeBindings(e,n),!1===t._getNodeHasBindings(e)&&e.removeEventListener("keydown",t._preventSpacebarScroll))},_rememberNodeBindings:function(t,n,i){let o=e.find((e=>e.node===t));o||(o={node:t,bindings:[{fn:n}]},e.push(o));let r=o.bindings.find((e=>e.fn===n));r||(r={fn:n},o.bindings.push(r)),Object.assign(r,i)},_forgetNodeBindings:function(t,n){let i=e.find((e=>e.node===t));if(!i)return;let o=i.bindings.find((e=>e.fn===n));if(!o)return;let r=i.bindings.indexOf(o);i.bindings.splice(r,1)},_getNodeBindings:function(t,n){let i=e.find((e=>e.node===t));if(i)return i.bindings.find((e=>e.fn===n))||void 0},_getNodeHasBindings:function(t){return!!e.find((e=>e.node===t))},_makeEnterFn:function(e){return function(n){let i=t._isEnter(n);i&&e.apply(this,arguments)}},_isEnter:function(e){return e.key&&"enter"===e.key.toLowerCase()},_preventSpacebarScroll:function(e){let n=e.target,i=t._isNodeType(n,"button"),o=t._isNodeType(n,"input","textarea"),r=t._isSpacebar(e);i||o||!r||e.preventDefault()},_makeSpacebarFn:function(e){return function(n){let i=t._isSpacebar(n);i&&e.apply(this,arguments)}},_isSpacebar:function(e){return e.key&&(" "===e.key||"spacebar"===e.key.toLowerCase())},_isNodeType:function(e,...t){t=t.map((e=>e.toLowerCase()));let n=e.nodeName.toLowerCase();return t.includes(n)}};return{activate:t.activate,deactivate:t.deactivate}}(),i=function(){const e={},t={_isFocusOnInput:function(){let e=document.activeElement,t=e.nodeName.toLowerCase(),n=["input","textarea","select"].includes(t);if("input"===t){let t=e.attributes.type.value.toLowerCase();["color","radio","checkbox"].includes(t)&&(n=!1)}else e.isContentEditable&&(n=!0);return n},_bindFn:function(t,n,i){document.addEventListener("keydown",i),e[t]||(e[t]=[]),e[t].push({fn:n,fnWrapper:i})},bind:function(e,n,i,o){if("string"!=typeof e)throw new TypeError("The key parameter to bind must be a string.");e=e.toLowerCase(),t._bindFn(e,n,(function(r){(i||!t._isFocusOnInput()||o)&&r.key&&r.key.toLowerCase()===e&&(o&&!r.ctrlKey||!1===n.apply(this,arguments)&&(r.preventDefault(),r.stopPropagation()))}))},unbind:function(t,n){let i=e[t];if(i){let e;for(e=0;e<i.length&&i[e].fn!==n;e++);e<i.length&&(document.removeEventListener("keydown",i[e].fnWrapper),i.splice(e,1))}},rebind:function(e,n,i,o,r){t.unbind(e,n),t.bind(i,n,o,r)},_getSequenceArgs:function(e,t,n,i){let o=Array.prototype.splice.call(arguments,0),r=o[0];return i=o[o.length-1],Array.isArray(r)||(r=o.splice(0,o.length-1)),{keys:r,fn:i}},bindSequence:function(e,n,i,o){let r=t._getSequenceArgs.apply(this,arguments),a=r.keys,c=[];if(o=r.fn,a.length>1){let e=function(e){let n=e.key.toLowerCase();if(!t._isFocusOnInput()&&("shift"!==n&&c.push(n),c.length>a.length&&c.shift(),n===a[a.length-1])){let t;for(t=0;t<a.length&&a[t]===c[t];t++);t===a.length&&!1===o.apply(this,arguments)&&(e.preventDefault(),e.stopPropagation())}},n=a.join(",");t._bindFn(n,o,e)}},unbindSequence:function(e,n,i,o){let r=t._getSequenceArgs.apply(this,arguments),a=r.keys.join(",");o=r.fn,t.unbind(a,o)},rebindSequence:function(e,n,i){t.unbindSequence(e,n),t.bindSequence(i,n)}};return{bind:t.bind,unbind:t.unbind,rebind:t.rebind,bindSequence:t.bindSequence,unbindSequence:t.unbindSequence,rebindSequence:t.rebindSequence}}(),o={};(function(e,t,n){const i=".js-modal__body",o=".js-modal__trigger";let r,a;const c=function(e){let t,n=e.matches("input, select, textarea, button, object"),i=!1===e.disabled,o=e.matches("a, area")&&e.matches("[href]"),r=e.matches("[tabindex]");t=n?i:o||r;let a=function(e){let t=window.getComputedStyle(e),n=t.visibility,i=t.display;return"hidden"!==n&&"none"!==i}(e);return t=t&&a,t},d=function(e){let t=c(e),n=e.matches('[tabindex="-1"]');return t&&!n},s={init:function(e){e=e||{},s._onShow=e.onShow||(()=>{}),s._initEvents(),s._initSubscriptions()},_initEvents:function(){e(o,s._processTriggerClick),e(".js-modal__close",s._hideEvent)},_initSubscriptions:function(){n&&(n("/modal/show",s._showById),n("/modal/hide",s._hide))},_bindModalActiveEvents:function(){t.bind("escape",s._hide,!0),document.addEventListener("click",s._hideIfBackgroundClick),document.querySelectorAll("*").forEach((e=>e.addEventListener("focus",s._wrapTab)))},_unbindModalActiveEvents:function(){t.unbind("escape",s._hide),document.removeEventListener("click",s._hideIfBackgroundClick),document.querySelectorAll("*").forEach((e=>e.removeEventListener("focus",s._wrapTab)))},_processTriggerClick:function(e){let t=e.target.closest(o),n=t.getAttribute("href");e.preventDefault(),n=!0===/^#/.test(n)?n.substring(1):t.getAttribute("aria-controls"),s._showById(n)},_wrapTab:function(e){let t=e.target,n=a.querySelector(i),o=!!t.closest(i),r=n.compareDocumentPosition(t)===Node.DOCUMENT_POSITION_FOLLOWING;if(!o){e.preventDefault();let t=s._getTabbable();r?t[0].focus():t[t.length-1].focus()}},_hideIfBackgroundClick:function(e){let t=e.target;t.closest(i)||t.closest(o)||s._hide()},_showById:function(e){let t=document.querySelector("#"+e);s._show(t)},_show:function(e){a?a.setAttribute("aria-hidden",!0):r=document.activeElement,a=e,e.setAttribute("aria-hidden",!1);let t=s._getBodyOpenClass(e);document.querySelector("body").classList.add(t),s._onShow(e);let n=s._getFocusable();n.length&&n[0].focus(),s._bindModalActiveEvents()},_hideEvent:function(e){e.preventDefault(),s._hide()},_hide:function(){if(a){a.setAttribute("aria-hidden",!0);let e=s._getBodyOpenClass(a);document.querySelector("body").classList.remove(e),s._unbindModalActiveEvents(),r&&r.focus(),a=void 0,r=void 0}},_getBodyOpenClass:function(e){return e.getAttribute("data-modal-body-open-class")||"modal__body-open"},_getFocusable:function(e){let t=(e=e||a).querySelector(i).querySelectorAll("*");return Array.prototype.filter.call(t,c)},_getTabbable:function(e){let t=(e=e||a).querySelector(i).querySelectorAll("*");return Array.prototype.filter.call(t,d)}};return{init:s.init}})(t,i,(function(e,t){e in o||(o[e]=[]);let n=o[e];!1===n.includes(t)&&n.push(t)})).init()})();
//# sourceMappingURL=modal.bundle.js.map