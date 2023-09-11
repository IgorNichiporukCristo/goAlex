import React, {useCallback} from "react";
import {IconChevronLeft} from "@sberdevices/plasma-icons";
import Search from "src/components/Search/Search";
import "./SearchMob.scss";
import MainEvents from "../../components/MainEvents";
import NewsCard from "../../components/NewsCard";

const SearchMob = ({ news, communities, newsEvents, newSearchValue }) => {
    const [searchValue, setSearchValue] = React.useState(newSearchValue);

    const onHandlerSearchChange = useCallback( (newValue) => {
        setSearchValue(newValue);
    }, []);

    const onHandlerSend = useCallback(() => {
      window.get_evg_func("sendAE")("SEARCH", {search: searchValue, platforms: "MOB"});
    }, [searchValue, window.screen.availWidth]);

    return(
        <div className="searchMob">
            <button
                className="searchMob__back"
                onClick={() => {
                    window.get_evg_func("sendAE")("GO_BACK_SKILL", {});
                }}
            >
                <IconChevronLeft size="s" color="white" />
                <span>Поиск</span>
            </button>
            <Search
                className='searchMob__search'
                onChange={onHandlerSearchChange}
                onSend={onHandlerSend} value={searchValue}
            />
            {(!!newsEvents?.length || !!communities?.length || !!news?.length) && <div className='searchMob__title'>Вот, что удалось найти</div>}
            <MainEvents news={newsEvents} communities={communities} isSearch />
            {news?.length > 0 && (
                <>
                    <div className='searchMob__newsCards'>Записи сообществ</div>
                    {news?.map(({ id, community, data, time, title, description, url, repost, parentPostCommunity, type }) => (
                        <NewsCard
                            key={`newsCard-${id}`}
                            id={id}
                            community={community}
                            data={data}
                            time={time}
                            title={title}
                            description={description}
                            url={url}
                            repost={repost}
                            parentPostCommunity={parentPostCommunity}
                            type={type}
                            isSearch
                        />
                    ))}
                </>
            )}
        </div>
    )
};

export default React.memo(SearchMob);
