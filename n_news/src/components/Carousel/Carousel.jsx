import React, { useState, useCallback, useRef } from 'react';

import "./Carousel.scss";
import { IconDisclosureLeft, IconDisclosureRight } from '@salutejs/plasma-icons';
import { Button } from '@salutejs/plasma-ui';
import cn from 'classnames';

const Carousel = ({ visibleElements = 1 ,withArrows, length, withInterval, children, className, ...props }) => {
    const carousel = useRef(null);
    const [pageNumber, setPageNumber] = useState(0);

    const onScrollSkills = useCallback(() => {
        const scrollLeft = carousel.current.scrollLeft;
        const scrollWidth = carousel.current.scrollWidth;
        const penultPagePos = (Math.ceil(length / visibleElements) - 2) * carousel.current.offsetWidth;
        const pageNumb = Math.round(((scrollLeft / scrollWidth) * length) / visibleElements);

        if (scrollLeft > penultPagePos) {
            setPageNumber(Math.ceil(length / visibleElements) - 1);
        } else {
            setPageNumber(pageNumb);
        }
    }, [length, visibleElements]);

    const scroll = useCallback((direction) => {
        const scrollLeft = carousel.current.scrollLeft;
        const scrollWidth = direction ? carousel.current.offsetWidth : -carousel.current.offsetWidth;

        carousel.current.scroll({
            top: 0,
            left: scrollLeft + scrollWidth,
            behavior: "smooth",
        });
    }, [])
    return (
        <div className={cn("carousel__wrapper", className)}>
            {withArrows && length > 1 && (
                <>
                    <Button
                        onClick={() => scroll(false)}
                        view="clear" className="carousel__arrowWrapper carousel__arrowWrapper_left"
                        contentLeft={<IconDisclosureLeft className="carousel__arrow" />}
                    />
                    <Button
                        onClick={() => scroll(true)}
                        view="clear" className="carousel__arrowWrapper carousel__arrowWrapper_right"
                        contentLeft={<IconDisclosureRight className="carousel__arrow" />}
                    />
                </>
            )}
            <div
                className="carousel"
                onScroll={onScrollSkills}
                ref={carousel}
                id="carousel"
            >
                {children}
            </div>
            {length > 1 && <div className="carousel__lowerBars" id="lowerBars">
                {Array(length).fill(null).map((_, pos) => {
                    if (pos % visibleElements === 0)
                        return (
                            <div
                                key={pos}
                                className={cn("carousel__dot", pageNumber === (pos / visibleElements) && "carousel__dot_current")}
                            />
                        );
                    return null;
                })}
            </div>}
        </div>
    );
}

export default React.memo(Carousel);