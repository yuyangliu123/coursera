// tokenUpdater.js
let updateTokenFn = null;

export const setUpdateTokenFn = (fn) => {
  updateTokenFn = fn;
};

export const getUpdateTokenFn = () => updateTokenFn;
