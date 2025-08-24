export const debounceRAF = (func, delay) => {
    let timeoutId;
    const debouncedFunction = (...args) => {
        // 每次呼叫時，如果之前有計時器，就先清除它
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // 設定新的計時器
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };

    // 添加一個 cancel 方法，用於手動清除計時器
    debouncedFunction.cancel = () => {
        clearTimeout(timeoutId);
        timeoutId = null; // 清除 id，避免再次觸發或誤判
    };

    return debouncedFunction;
}
