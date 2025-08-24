import{G as p}from"./chunk-5PH6ULNP-DzDKoMfl.js";import{j as i,r as l,C as P,i as L,T as q,u as R,m as V,k as G,l as N,n as _}from"./index-BgPfMftx.js";import{a as F,T as I,b as O}from"./chunk-3Y4YXCR2-D1_PzN3D.js";import{u as A}from"./index-Bgli6ANI.js";import{E as D}from"./chunk-VMD3UMGK-CTiViLtf.js";var j=String.raw,z=j`
  :root,
  :host {
    --chakra-vh: 100vh;
  }

  @supports (height: -webkit-fill-available) {
    :root,
    :host {
      --chakra-vh: -webkit-fill-available;
    }
  }

  @supports (height: -moz-fill-available) {
    :root,
    :host {
      --chakra-vh: -moz-fill-available;
    }
  }

  @supports (height: 100dvh) {
    :root,
    :host {
      --chakra-vh: 100dvh;
    }
  }
`,K=()=>i.jsx(p,{styles:z}),U=({scope:e=""})=>i.jsx(p,{styles:j`
      html {
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        font-family: system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;
        -moz-osx-font-smoothing: grayscale;
        touch-action: manipulation;
      }

      body {
        position: relative;
        min-height: 100%;
        margin: 0;
        font-feature-settings: "kern";
      }

      ${e} :where(*, *::before, *::after) {
        border-width: 0;
        border-style: solid;
        box-sizing: border-box;
        word-wrap: break-word;
      }

      main {
        display: block;
      }

      ${e} hr {
        border-top-width: 1px;
        box-sizing: content-box;
        height: 0;
        overflow: visible;
      }

      ${e} :where(pre, code, kbd,samp) {
        font-family: SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 1em;
      }

      ${e} a {
        background-color: transparent;
        color: inherit;
        text-decoration: inherit;
      }

      ${e} abbr[title] {
        border-bottom: none;
        text-decoration: underline;
        -webkit-text-decoration: underline dotted;
        text-decoration: underline dotted;
      }

      ${e} :where(b, strong) {
        font-weight: bold;
      }

      ${e} small {
        font-size: 80%;
      }

      ${e} :where(sub,sup) {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
      }

      ${e} sub {
        bottom: -0.25em;
      }

      ${e} sup {
        top: -0.5em;
      }

      ${e} img {
        border-style: none;
      }

      ${e} :where(button, input, optgroup, select, textarea) {
        font-family: inherit;
        font-size: 100%;
        line-height: 1.15;
        margin: 0;
      }

      ${e} :where(button, input) {
        overflow: visible;
      }

      ${e} :where(button, select) {
        text-transform: none;
      }

      ${e} :where(
          button::-moz-focus-inner,
          [type="button"]::-moz-focus-inner,
          [type="reset"]::-moz-focus-inner,
          [type="submit"]::-moz-focus-inner
        ) {
        border-style: none;
        padding: 0;
      }

      ${e} fieldset {
        padding: 0.35em 0.75em 0.625em;
      }

      ${e} legend {
        box-sizing: border-box;
        color: inherit;
        display: table;
        max-width: 100%;
        padding: 0;
        white-space: normal;
      }

      ${e} progress {
        vertical-align: baseline;
      }

      ${e} textarea {
        overflow: auto;
      }

      ${e} :where([type="checkbox"], [type="radio"]) {
        box-sizing: border-box;
        padding: 0;
      }

      ${e} input[type="number"]::-webkit-inner-spin-button,
      ${e} input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
      }

      ${e} input[type="number"] {
        -moz-appearance: textfield;
      }

      ${e} input[type="search"] {
        -webkit-appearance: textfield;
        outline-offset: -2px;
      }

      ${e} input[type="search"]::-webkit-search-decoration {
        -webkit-appearance: none !important;
      }

      ${e} ::-webkit-file-upload-button {
        -webkit-appearance: button;
        font: inherit;
      }

      ${e} details {
        display: block;
      }

      ${e} summary {
        display: list-item;
      }

      template {
        display: none;
      }

      [hidden] {
        display: none !important;
      }

      ${e} :where(
          blockquote,
          dl,
          dd,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6,
          hr,
          figure,
          p,
          pre
        ) {
        margin: 0;
      }

      ${e} button {
        background: transparent;
        padding: 0;
      }

      ${e} fieldset {
        margin: 0;
        padding: 0;
      }

      ${e} :where(ol, ul) {
        margin: 0;
        padding: 0;
      }

      ${e} textarea {
        resize: vertical;
      }

      ${e} :where(button, [role="button"]) {
        cursor: pointer;
      }

      ${e} button::-moz-focus-inner {
        border: 0 !important;
      }

      ${e} table {
        border-collapse: collapse;
      }

      ${e} :where(h1, h2, h3, h4, h5, h6) {
        font-size: inherit;
        font-weight: inherit;
      }

      ${e} :where(button, input, optgroup, select, textarea) {
        padding: 0;
        line-height: inherit;
        color: inherit;
      }

      ${e} :where(img, svg, video, canvas, audio, iframe, embed, object) {
        display: block;
      }

      ${e} :where(img, video) {
        max-width: 100%;
        height: auto;
      }

      [data-js-focus-visible]
        :focus:not([data-focus-visible-added]):not(
          [data-focus-visible-disabled]
        ) {
        outline: none;
        box-shadow: none;
      }

      ${e} select::-ms-expand {
        display: none;
      }

      ${z}
    `}),g={light:"chakra-ui-light",dark:"chakra-ui-dark"};function Y(e={}){const{preventTransition:o=!0}=e,n={setDataset:r=>{const t=o?n.preventTransition():void 0;document.documentElement.dataset.theme=r,document.documentElement.style.colorScheme=r,t==null||t()},setClassName(r){document.body.classList.add(r?g.dark:g.light),document.body.classList.remove(r?g.light:g.dark)},query(){return window.matchMedia("(prefers-color-scheme: dark)")},getSystemTheme(r){var t;return((t=n.query().matches)!=null?t:r==="dark")?"dark":"light"},addListener(r){const t=n.query(),a=s=>{r(s.matches?"dark":"light")};return typeof t.addListener=="function"?t.addListener(a):t.addEventListener("change",a),()=>{typeof t.removeListener=="function"?t.removeListener(a):t.removeEventListener("change",a)}},preventTransition(){const r=document.createElement("style");return r.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(r),()=>{window.getComputedStyle(document.body),requestAnimationFrame(()=>{requestAnimationFrame(()=>{document.head.removeChild(r)})})}}};return n}var Z="chakra-ui-color-mode";function B(e){return{ssr:!1,type:"localStorage",get(o){if(!(globalThis!=null&&globalThis.document))return o;let n;try{n=localStorage.getItem(e)||o}catch{}return n||o},set(o){try{localStorage.setItem(e,o)}catch{}}}}var H=B(Z),S=()=>{};function M(e,o){return e.type==="cookie"&&e.ssr?e.get(o):o}function T(e){const{value:o,children:n,options:{useSystemColorMode:r,initialColorMode:t,disableTransitionOnChange:a}={},colorModeManager:s=H}=e,u=t==="dark"?"dark":"light",[m,v]=l.useState(()=>M(s,u)),[y,h]=l.useState(()=>M(s)),{getSystemTheme:x,setClassName:w,setDataset:k,addListener:C}=l.useMemo(()=>Y({preventTransition:a}),[a]),b=t==="system"&&!m?y:m,d=l.useCallback(c=>{const f=c==="system"?x():c;v(f),w(f==="dark"),k(f),s.set(f)},[s,x,w,k]);A(()=>{t==="system"&&h(x())},[]),l.useEffect(()=>{const c=s.get();if(c){d(c);return}if(t==="system"){d("system");return}d(u)},[s,u,t,d]);const $=l.useCallback(()=>{d(b==="dark"?"light":"dark")},[b,d]);l.useEffect(()=>{if(r)return C(d)},[r,C,d]);const E=l.useMemo(()=>({colorMode:o??b,toggleColorMode:o?S:$,setColorMode:o?S:d,forced:o!==void 0}),[b,$,d,o]);return i.jsx(P.Provider,{value:E,children:n})}T.displayName="ColorModeProvider";function J(e={}){const{strict:o=!0,errorMessage:n="useContext: `context` is undefined. Seems you forgot to wrap component within the Provider",name:r}=e,t=l.createContext(void 0);t.displayName=r;function a(){var s;const u=l.useContext(t);if(!u&&o){const m=new Error(n);throw m.name="ContextError",(s=Error.captureStackTrace)==null||s.call(Error,m,a),m}return u}return[t.Provider,a,t]}function Q(e){const{cssVarsRoot:o,theme:n,children:r}=e,t=l.useMemo(()=>L(n),[n]);return i.jsxs(q,{theme:t,children:[i.jsx(W,{root:o}),r]})}function W({root:e=":host, :root"}){const o=[e,"[data-theme]"].join(",");return i.jsx(p,{styles:n=>({[o]:n.__cssVars})})}J({name:"StylesContext",errorMessage:"useStyles: `styles` is undefined. Seems you forgot to wrap the components in `<StylesProvider />` "});function X(){const{colorMode:e}=R();return i.jsx(p,{styles:o=>{const n=V(o,"styles.global"),r=G(n,{theme:o,colorMode:e});return r?N(r)(o):void 0}})}var ee=e=>{const{children:o,colorModeManager:n,portalZIndex:r,resetScope:t,resetCSS:a=!0,theme:s={},environment:u,cssVarsRoot:m,disableEnvironment:v,disableGlobalStyle:y}=e,h=i.jsx(D,{environment:u,disabled:v,children:o});return i.jsx(Q,{theme:s,cssVarsRoot:m,children:i.jsxs(T,{colorModeManager:n,options:s.config,children:[a?i.jsx(U,{scope:t}):i.jsx(K,{}),!y&&i.jsx(X,{}),r?i.jsx(F,{zIndex:r,children:h}):h]})})},te=e=>function({children:n,theme:r=e,toastOptions:t,...a}){return i.jsxs(ee,{theme:r,...a,children:[i.jsx(I,{value:t==null?void 0:t.defaultOptions,children:n}),i.jsx(O,{...t})]})},se=te(_);export{se as C};
