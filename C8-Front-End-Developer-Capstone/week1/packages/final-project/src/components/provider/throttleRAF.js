export const throttleRAF = (func) => {
    let ticking = false;
    return () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(() => {
                func();
                ticking = false;
            });
        }
    };
};
