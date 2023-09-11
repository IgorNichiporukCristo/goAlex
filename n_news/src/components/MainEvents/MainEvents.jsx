import "./MainEvents.scss";
import {formatDate} from "../../pages/utils";
import React from "react";
import normalizeContent from 'src/assets/scripts/normalizeContent';
import { IconPlus } from '@salutejs/plasma-icons';

import cn from 'classnames'

const MainEvents = ({stateButtonLeftPanel, news, communities, className, isSearch }) => {
    const [activeNews, setActiveNews] = React.useState(0);
    const newsRef = React.useRef();

    const scroll = React.useCallback((next) => {
        const scrollLeft = newsRef?.current.scrollLeft;
        const scrollWidth = next ? newsRef?.current.offsetWidth + scrollLeft : 0;

        newsRef?.current.scroll({
            top: 0,
            left: scrollWidth,
            behavior: "smooth",
        });
    }, [])

    React.useEffect(() => {
        if(!news?.length) return
        if (activeNews !== 0) {
            scroll(true);
        }
        if (activeNews === news?.length) {
            scroll(false);
            setActiveNews(0);
        }
    }, [activeNews])

    React.useEffect(() => {
        const timer = setInterval(() => {
            setActiveNews((prev) => (prev + 1));
        }, 10000);

        return () => clearInterval(timer)
    }, [])
    return(
        <div className={cn("main-event__wrapper", className)}>
            <div className={stateButtonLeftPanel ? 'main-event main-event-active' : 'main-event'}>
                {news?.length > 0 && (
                    <>
                    <div className="main-event__title">Главные события</div>
                    <div className="main-event__newsWrapper">
                        <div className="main-event__news" ref={newsRef}>
                            {news?.map(({ id, url, title, data, time, description, community }) => (
                                    <div
                                        className="main-event__newsItem"
                                        onClick={() => {
                                            isSearch ? window.get_evg_func("sendAE")("GET_NEWS_SEARCH", { id }) : window.get_evg_func("sendAE")("GET_NEWS", {id});
                                        }}
                                    >
                                        <div className="main-event__newsItemImageWrapper">
                                            {
                                                (url?.indexOf(".m3u8") >= 0 || url?.indexOf(".mp4") >= 0) && url !== "" ?
                                                    (<div className="main-event__newsItemImage">
                                                        <video src={Array.isArray(url) ? url[0] : url} alt={title} controls id={id} />
                                                    </div>)
                                                    :
                                                    (<div className="main-event__newsItemImage">
                                                        <img src={Array.isArray(url) ? url[0] : url} alt={title}/>
                                                    </div>)
                                            }
                                            <div className="main-event__newsItemTitleWrapper">
                                                <div className="main-event__newsItemTitle" dangerouslySetInnerHTML={{ __html: normalizeContent(title) }} />
                                                <div className="main-event__newsItemDate">
                                                    {formatDate(data, time)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="main-event__newsItemDescription" dangerouslySetInnerHTML={{ __html: normalizeContent(description)}} />
                                        <div className="main-event__community">
                                            {community}
                                        </div>
                                    </div>
                            ))}
                        </div>
                        <div className="main-event__lowerBar">
                            {Array(news?.length).fill("").map((_, pos) => (
                                    <div
                                        key={pos}
                                        className={"main-event__dot" + (activeNews === (pos) ? " main-event__dot_current" : "")}
                                    />
                                )
                            )}
                        </div>
                    </div>
                    </>
                )}
                {communities?.length > 0 && <div className="main-event__communities">
                    <div className="main-event__communitiesTitle">Сообщества для Вас</div>
                    {communities?.map(({title, description, icon}) => (
                        <div className="main-event__communitiesCard">
                            <div className="main-event__communitiesCardIcon" />
                            <div>
                                <div className="main-event__communitiesCardTitle">{title}</div>
                                <div className="main-event__communitiesCardDescription">{description}</div>
                            </div>
                            <button className="main-event__communitiesCardPlus">
                                <IconPlus />
                            </button>
                        </div>
                    ))}
                    <button className="main-event__communitiesButtonAll">Показать все</button>
                </div>}
            </div>
        </div>
    )
};

export default React.memo(MainEvents);