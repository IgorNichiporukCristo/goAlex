import * as React from 'react';
import "./Collapse.scss";
import cn from 'classnames';

const Collapse = ({ children, isOpen, className }) => {
    const [height, setHeight] = React.useState(0);
    const content = React.useRef(null);

    const checkHeight = React.useCallback(() => {
        if (content.current) setHeight(content.current.scrollHeight);
    }, []);

    React.useEffect(() => {
        checkHeight();
        window.addEventListener('resize', checkHeight);
        return () => window.removeEventListener('resize', checkHeight);
    }, [checkHeight]);

    React.useEffect(() => {
        checkHeight();
    }, [children, isOpen]);

    return (
        <div
            ref={content}
            style={{ height: `${isOpen ? height : "0"}px` }}
            className={cn("collapse", className)}
        >
            {children}
        </div>
    );
};

export default React.memo(Collapse);