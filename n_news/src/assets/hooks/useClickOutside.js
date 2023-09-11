import * as React from 'react';

export default (
    callBack,
    ref,
    ignoreSelector
) => {
    const onClickOutside = React.useCallback(
        (e) => {
            const target = e.target;

            if (!ref) {
                return;
            }

            if (ignoreSelector && target.closest(ignoreSelector)) {
                return;
            }

            const element = 'current' in ref ? ref.current : ref;

            if (element && !element.contains(target)) {
                callBack(e);
            }
        },
        [ref, callBack, ignoreSelector]
    );

    React.useEffect(() => {
        window.addEventListener('click', onClickOutside);

        return () => {
            window.removeEventListener('click', onClickOutside);
        };
    }, [onClickOutside]);
};
