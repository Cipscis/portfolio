(()=>{"use strict";var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{bind:()=>b,unbind:()=>g});const n=new Map;function o(e,t,n){if("string"==typeof e)try{e=document.querySelectorAll(e)}catch(t){throw new DOMException(`${n===i?"deactivate":"activate"} failed because it was passed an invalid selector string: '${e}'`)}e instanceof HTMLElement?n(e,t):e.forEach((e=>n(e,t)))}function r(e,t){if(!(e instanceof HTMLElement))throw new TypeError("activate failed because a valid HTMLElement was not passed");if(!(s(e,t)||(e.addEventListener("click",t),e instanceof HTMLButtonElement))){!1===c(e)&&e.addEventListener("keydown",a);const o=function(e){return function(t){if(l(t))return e.call(this,t)}}(t);e.addEventListener("keyup",o);const r={spacebarFn:o};if(!(e instanceof HTMLAnchorElement)){const n=function(e){return function(t){const n=function(e){return!(!e.key||"enter"!==e.key.toLowerCase())}(t);if(n)return e.call(this,t)}}(t);e.addEventListener("keydown",n),r.enterFn=n}!function(e,t,o){let r=n.get(e);r||(r=new Map([[t,o]]),n.set(e,r));let i=r.get(t);i?Object.assign(i,o):(i=Object.assign({},o),r.set(t,i))}(e,t,r)}}function i(e,t){if(!(e instanceof HTMLElement))throw new TypeError("deactivate failed because a valid HTMLElement was not passed");e.removeEventListener("click",t);const o=s(e,t);o&&(e instanceof HTMLButtonElement||(o.spacebarFn&&e.removeEventListener("keyup",o.spacebarFn),e instanceof HTMLAnchorElement||o.enterFn&&e.removeEventListener("keydown",o.enterFn),function(e,t){const o=n.get(e);o&&(o.delete(t),n.delete(e))}(e,t),!1===c(e)&&e.removeEventListener("keydown",a)))}function s(e,t){const o=n.get(e);if(o)return o.get(t)}function c(e){return n.has(e)}function a(e){const t=this,n=t instanceof HTMLButtonElement,o=t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement,r=l(e);n||o||!r||e.preventDefault()}function l(e){return!(!e.key||" "!==e.key&&"spacebar"!==e.key.toLowerCase())}class u extends Array{constructor(e){if("string"!=typeof e)throw new RangeError("KeyBind: Constructor argument must be a string");super(0);const t=e.trim().split(/\s+/g);for(const e of t)this.push(e)}toString(){return this.join(" ")}match(e){if(e.length!==this.length)return!1;for(const[t,n]of e.entries()){const e=this[t];if(!n.match(e))return!1}return!0}}const d=Object.freeze({alt:/\balt\+/g,ctrl:/\b(control|ctrl|command|cmd|meta)\+/g,shift:/\bshift\+/g}),f=new Map([["space"," "],["spacebar"," "],["up","arrowup"],["right","arrowright"],["down","arrowdown"],["left","arrowleft"],["esc","escape"]]);class h{key;modifiers;constructor(e){if(!("key"in e))throw new RangeError("KeyPress: key is a required option");this.key=e.key,this.modifiers={altKey:e.altKey||!1,ctrlKey:e.metaKey||e.ctrlKey||!1,shiftKey:e.shiftKey||!1}}match(e){const t={altKey:!1,ctrlKey:!1,shiftKey:!1};let n;for(n in d.alt.test(e)&&(t.altKey=!0,e=e.replace(d.alt,"")),d.ctrl.test(e)&&(t.ctrlKey=!0,e=e.replace(d.ctrl,"")),d.shift.test(e)&&(t.shiftKey=!0,e=e.replace(d.shift,"")),t)if(t[n]&&!this.modifiers[n])return!1;return e.toLowerCase()===this.key.toLowerCase()||f.get(e.toLowerCase())===this.key.toLowerCase()}}const y=new Map,p=Object.freeze({allowInInput:!1}),m=(e,t,n)=>{const o=Object.assign({},p,n),r=new u(e),i=[];return function(e,...n){if(["Alt","Control","Meta","Shift"].includes(e.key))return;if(!o.allowInInput&&w(document.activeElement))return;if(v(document.activeElement))return;const s=new h(e);i.push(s),i.length>r.length&&i.shift(),r.match(i)&&(i.splice(0),t.apply(this,[e,...n]))}},b=(e,t,n)=>{y.has(e)||y.set(e,new Map);const o=y.get(e);if(o.has(t))return;const r=m(e,t,n);document.addEventListener("keydown",r),o.set(t,r)},g=(e,t)=>{const n=y.get(e);if(!n)return;const o=n.get(t);o&&(document.removeEventListener("keydown",o),n.delete(t))},w=function(e){let t=!1;if(e instanceof HTMLElement)if(e instanceof HTMLTextAreaElement||e instanceof HTMLSelectElement)t=!0;else if(e instanceof HTMLInputElement){t=!0;const n=(e.type||"text").toLowerCase();["button","checkbox","color","file","hidden","image","radio","range","reset","submit"].includes(n)&&(t=!1)}else e.isContentEditable&&(t=!0);return t},v=function(e){let t=!1;return e instanceof HTMLInputElement&&"password"===(e.type||"text").toLowerCase()&&(t=!0),t},E={},_=function(e,t){const n=e.split(/\s+/).filter((e=>!!e));if(n.length>1)for(const e of n)_(e,t);else{e in E||(E[e]=[]);const n=E[e];!1===n.includes(t)&&n.push(t)}},L=function(e,t,n){const o=".js-modal__body",r=".js-modal__trigger";let i=null,s=null;const c=function(e){let t,n=e.matches("input, select, textarea, button, object"),o=!1===e.disabled,r=e.matches("a, area")&&e.matches("[href]"),i=e.matches("[tabindex]");t=n?o:r||i;let s=function(e){let t=window.getComputedStyle(e),n=t.visibility,o=t.display;return"hidden"!==n&&"none"!==o}(e);return t=t&&s,t},a=function(e){let t=c(e),n=e.matches('[tabindex="-1"]');return t&&!n},l={init:function(e){e=e||{},l._onShow=e.onShow||(()=>{}),l._initEvents(),l._initSubscriptions()},_initEvents:function(){e(r,l._processTriggerClick),e(".js-modal__close",l._hideEvent)},_initSubscriptions:function(){n&&(n("/modal/show",l._showById),n("/modal/hide",l._hide))},_bindModalActiveEvents:function(){t.bind("escape",l._hide,!0),document.addEventListener("click",l._hideIfBackgroundClick),document.querySelectorAll("*").forEach((e=>e.addEventListener("focus",l._wrapTab)))},_unbindModalActiveEvents:function(){t.unbind("escape",l._hide),document.removeEventListener("click",l._hideIfBackgroundClick),document.querySelectorAll("*").forEach((e=>e.removeEventListener("focus",l._wrapTab)))},_processTriggerClick:function(e){let t=e.target.closest(r),n=t.getAttribute("href");e.preventDefault(),n=!0===/^#/.test(n)?n.substring(1):t.getAttribute("aria-controls"),l._showById(n)},_wrapTab:function(e){let t=e.target,n=s.querySelector(o),r=!!t.closest(o),i=n.compareDocumentPosition(t)===Node.DOCUMENT_POSITION_FOLLOWING;if(!r){e.preventDefault();let t=l._getTabbable();i?t[0].focus():t[t.length-1].focus()}},_hideIfBackgroundClick:function(e){let t=e.target;t.closest(o)||t.closest(r)||l._hide()},_showById:function(e){let t=document.querySelector("#"+e);l._show(t)},_show:function(e){s?s.setAttribute("aria-hidden",!0):i=document.activeElement,s=e,e.setAttribute("aria-hidden",!1);let t=l._getBodyOpenClass(e);document.querySelector("body").classList.add(t),l._onShow(e);let n=l._getFocusable();n.length&&n[0].focus(),l._bindModalActiveEvents()},_hideEvent:function(e){e.preventDefault(),l._hide()},_hide:function(){if(s){s.setAttribute("aria-hidden",!0);let e=l._getBodyOpenClass(s);document.querySelector("body").classList.remove(e),l._unbindModalActiveEvents(),i&&i.focus(),s=null,i=null}},_getBodyOpenClass:function(e){return e.getAttribute("data-modal-body-open-class")||"modal__body-open"},_getFocusable:function(e){let t=(e=e||s).querySelector(o).querySelectorAll("*");return Array.prototype.filter.call(t,c)},_getTabbable:function(e){let t=(e=e||s).querySelector(o).querySelectorAll("*");return Array.prototype.filter.call(t,a)}};return{init:l.init}}((function(e,t){o(e,t,r)}),t,_);L.init()})();
//# sourceMappingURL=modal.js.map