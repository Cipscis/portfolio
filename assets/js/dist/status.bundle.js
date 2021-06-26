(()=>{"use strict";const e={},t=function(e){const t="data-autohide-timeout",n={SUCCESS:"SUCCESS",ERROR:"ERROR"},i={[n.SUCCESS]:"success",[n.ERROR]:"error",hidden:"hidden"},s={_initSubscriptions:function(){e&&(e("/status/success",s.success),e("/status/error",s.error),e("/status/hide",s.hide))},_getEl:function(e){return"string"==typeof e?e=document.querySelector(e):e instanceof NodeList?e=e[0]:void 0===e&&(e=document.querySelector(".js-status")),e||console.error("No status element could be found"),e},_clearType:function(e){for(let t in n){let n=i[t];e.classList.contains(n)&&e.classList.remove(n)}},_setType:function(e,t){let n=i[e];n?(s._clearType(t),window.setTimeout((()=>t.classList.add(n)),10)):console.error("No CSS class is defined for status type "+e)},_clearMessage:function(e){e.textContent=""},_setMessage:function(e,t){s._clearMessage(t),window.setTimeout((()=>t.textContent=e),100)},_show:function(e,t,n,o){s._setType(t,n),s._setMessage(e,n),n.classList.remove(i.hidden),s._setAutohide(n,o)},_setAutohide:function(e,n){if(s._clearAutohide(e),n&&n>0){let i=window.setTimeout((()=>s.hide(e)),n);e.setAttribute(t,i)}},_clearAutohide:function(e){let n=e.getAttribute(t);n&&(window.clearTimeout(n),e.removeAttribute(t))},hide:function(e){(e=s._getEl(e)).classList.add(i.hidden),s._clearAutohide(e)},success:function(e,t,i){t=s._getEl(t),s._show(e,n.SUCCESS,t,i)},error:function(e,t,i){t=s._getEl(t),s._show(e,n.ERROR,t,i)}};return s._initSubscriptions(),{hide:s.hide,success:s.success,error:s.error}}((function(t,n){t in e||(e[t]=[]);let i=e[t];!1===i.includes(n)&&i.push(n)})),n=[],{activate:i,deactivate:s}=function(){const e={activate:function(t,n){e._activator(t,n,e._activateSingle)},deactivate:function(t,n){e._activator(t,n,e._deactivateSingle)},_activator:function(t,n,i){if("string"==typeof t)try{t=document.querySelectorAll(t)}catch(n){let s=i===e._deactivateSingle?"deactivate":"activate";throw new DOMException(`${s} failed because it was passed an invalid selector string: '${t}'`)}t instanceof Node?i(t,n):t.length&&t.forEach&&t.forEach((e=>i(e,n)))},_activateSingle:function(t,n){if(t instanceof Node==0)throw new TypeError("activate failed because a valid Node was not passed");if(!e._getNodeBindings(t,n)&&(t.addEventListener("click",n),!1===e._isNodeType(t,"button"))){!1===e._getNodeHasBindings(t)&&t.addEventListener("keydown",e._preventSpacebarScroll);let i=e._makeSpacebarFn(n);t.addEventListener("keyup",i);let s={spacebarFn:i};if(!1===e._isNodeType(t,"a")){let i=e._makeEnterFn(n);t.addEventListener("keydown",i),s.enterFn=i}e._rememberNodeBindings(t,n,s)}},_deactivateSingle:function(t,n){if(t instanceof Node==0)throw new TypeError("deactivate failed because a valid Node was not passed");let i=e._getNodeBindings(t,n);t.removeEventListener("click",n),i&&!1===e._isNodeType(t,"button")&&(t.removeEventListener("keyup",i.spacebarFn),!1===e._isNodeType(t,"a")&&t.removeEventListener("keydown",i.enterFn),e._forgetNodeBindings(t,n),!1===e._getNodeHasBindings(t)&&t.removeEventListener("keydown",e._preventSpacebarScroll))},_rememberNodeBindings:function(e,t,i){let s=n.find((t=>t.node===e));s||(s={node:e,bindings:[{fn:t}]},n.push(s));let o=s.bindings.find((e=>e.fn===t));o||(o={fn:t},s.bindings.push(o)),Object.assign(o,i)},_forgetNodeBindings:function(e,t){let i=n.find((t=>t.node===e));if(!i)return;let s=i.bindings.find((e=>e.fn===t));if(!s)return;let o=i.bindings.indexOf(s);i.bindings.splice(o,1)},_getNodeBindings:function(e,t){let i=n.find((t=>t.node===e));if(i)return i.bindings.find((e=>e.fn===t))||void 0},_getNodeHasBindings:function(e){return!!n.find((t=>t.node===e))},_makeEnterFn:function(t){return function(n){let i=e._isEnter(n);i&&t.apply(this,arguments)}},_isEnter:function(e){return e.key&&"enter"===e.key.toLowerCase()},_preventSpacebarScroll:function(t){let n=t.target,i=e._isNodeType(n,"button"),s=e._isNodeType(n,"input","textarea"),o=e._isSpacebar(t);i||s||!o||t.preventDefault()},_makeSpacebarFn:function(t){return function(n){let i=e._isSpacebar(n);i&&t.apply(this,arguments)}},_isSpacebar:function(e){return e.key&&(" "===e.key||"spacebar"===e.key.toLowerCase())},_isNodeType:function(e,...t){t=t.map((e=>e.toLowerCase()));let n=e.nodeName.toLowerCase();return t.includes(n)}};return{activate:e.activate,deactivate:e.deactivate}}();i(".js-status-example-success",(()=>t.success("Success :)"))),i(".js-status-example-error",(()=>t.error("Error :("))),i(".js-status-example-hide",(()=>t.hide())),i(".js-status-example-custom",(()=>t.success("Custom success :)",".js-status-custom"))),i(".js-status-example-custom-hide",(()=>t.hide(".js-status-custom"))),i(".js-status-example-autohide",(()=>t.success("This message will hide in 10 seconds",void 0,1e4)))})();
//# sourceMappingURL=status.bundle.js.map