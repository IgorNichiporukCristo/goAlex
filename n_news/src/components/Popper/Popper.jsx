import './Popper.scss';

import * as React from 'react';
import { usePopper } from 'react-popper';
import useClickOutside from 'src/assets/hooks/useClickOutside';
import cn from 'classnames'

const Popper = ({placement = 'bottom', onClose, targetRef, isShow, children, className, autoMaxWidth, ...props}) => {
    const [popperElement, setPopperElement] = React.useState(null);
    // const [isAnimate, setIsAnimate] = React.useState(false);
    // const animateOn = React.useCallback(() => {
    //     setIsAnimate(true);
    // }, []);
    //`
    // const animateOff = React.useCallback(() => {
    //     setIsAnimate(false);
    // }, []);
    //
    // const close = React.useCallback(() => {
    //     if (!isAnimate && onClose) onClose();
    // }, [onClose, isAnimate]);

    // useClickOutside(onClose, popperElement);
    //
    // React.useEffect(() => {
    //     if (!autoMaxWidth || !popperElement || !targetRef) {
    //         return;
    //     }
    //
    //     const wrapperWidth = targetRef?.getBoundingClientRect?.()?.width || 0;
    //
    //     if (!wrapperWidth) {
    //         popperElement.style.maxWidth = '0';
    //         return;
    //     }
    //
    //     popperElement.style.width = `${wrapperWidth}px`;
    // }, [autoMaxWidth, popperElement, targetRef]);

    const { styles, attributes } = usePopper(targetRef, popperElement, {
        placement: 'bottom',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 8],
                },
            },
        ],
    });

    return (
         <div
             ref={setPopperElement}
             style={styles.popper}
             {...attributes.popper}
             className={cn('popper', className)}
             {...props}
         >
             {children}
         </div>
    );
};

export default React.memo(Popper);