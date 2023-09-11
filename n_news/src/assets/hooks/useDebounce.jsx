import React from "react";

const useDebounce = (timeout) => {
    const timer = React.useRef(null)
    return (func) => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            func();
        }, timeout);
    };
};

export default useDebounce;
