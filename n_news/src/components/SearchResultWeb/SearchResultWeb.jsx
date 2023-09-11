import React from "react";
import {useEffect} from "react";
import cn from 'classnames';

import "./SearchResultWeb.scss";
import { IconChevronRight } from '@salutejs/plasma-icons';
import { formatDate } from '../../pages/utils';

const SearchResultWeb = ({ searchData, className }) => {

  const [mainTitle, setmainTitle] = React.useState('Вот, что удалось найти: ')

  useEffect(() => {
    // debugger;
  }, [searchData]);

    React.useEffect(() => {
        let newsEventsLength = Object.values(searchData)[0]?.length;
        let communitiesLength = Object.values(searchData)[1]?.length;
        let newsLength = Object.values(searchData)[2]?.length;
        if (!newsEventsLength && !communitiesLength && !newsLength) {
            setmainTitle('Ничего не найдено');
        } else if(!!newsEventsLength && !!communitiesLength && !newsLength) {
            setmainTitle('Нашлись события и сообщества:')
        } else if(!newsEventsLength && !!communitiesLength && !!newsLength) {
            setmainTitle('Нашлись сообщества и записи:')
        } else if(!!newsEventsLength && !communitiesLength && !!newsLength) {
            setmainTitle('Нашлись события и записи:')
        } else if(!!newsEventsLength && !communitiesLength && !newsLength) {
            setmainTitle('Нашлись события:')
        } else if(!newsEventsLength && !!communitiesLength && !newsLength) {
            setmainTitle('Нашлись сообщества:')
        } else if(!newsEventsLength && !communitiesLength && !!newsLength) {
            setmainTitle('Нашлись записи:')
        } else {
            setmainTitle('Вот, что удалось найти:')
        }
    }, [searchData]);

  
    return(
        <div className={cn('searchResultWeb', className)}>
            <div className='searchResultWeb__title searchResultWeb__title_main'>{mainTitle}</div>
            {Object.keys(searchData).map((value, index) => {
                let cardsWrapperTitle;
                switch (value) {
                    case 'news':
                        cardsWrapperTitle = 'Записи сообществ'
                        break;
                    case 'newsEvents':
                        cardsWrapperTitle = 'События';
                        break;
                    case 'communities':
                        cardsWrapperTitle = 'Сообщества';
                        break;
                }
                if(Object.values(searchData)[index].length === 0) return;
                return(
                    <div key={cardsWrapperTitle} className='searchResultWeb__cardsWrapper'>
                        <div className='searchResultWeb__cardsWrapperTitle'>
                            {cardsWrapperTitle}
                        </div>
                        {Object.values(searchData)[index].map((item) => {
                            let cardDescription;
                            let cardButton;
                            let icon;
                            let onClick;
                            let id = item?.id;
                            switch (value) {
                                case 'news':
                                    cardDescription = 'от ' + item?.parentPostCommunity;
                                    cardButton = 'Читать статью'
                                    onClick = () => window.get_evg_func("sendAE")("GET_NEWS_SEARCH", { id });
                                    break;
                                case 'newsEvents':
                                    cardDescription = formatDate(item.data, item.time);
                                    cardButton = 'Узнать больше';
                                    onClick = () => window.get_evg_func("sendAE")("GET_NEWS_SEARCH", { id });
                                    break;
                                case 'communities':
                                    cardDescription = item?.description + ' подписчиков';
                                    cardButton = 'Подписаться';
                                    icon = item.icon;
                                    break;
                            }
                            return (
                                <button className='searchResultWeb__card' onClick={onClick}>
                                    {icon && <div  className='searchResultWeb__cardImage'>
                                        <img src={icon} alt={item.title} />
                                    </div>}
                                    <div className='searchResultWeb__cardContentWrapper'>
                                        <div className='searchResultWeb__cardTitle'>{item.title}</div>
                                        {cardDescription && <div className='searchResultWeb__cardDescription'>{cardDescription}</div>}
                                    </div>
                                    <button className='searchResultWeb__cardButton'>
                                        {cardButton}
                                        <IconChevronRight className='searchResultWeb__cardChevron'/>
                                    </button>
                                </button>
                        )})}
                    </div>
                )
            })}
        </div>
    )
}

export default React.memo(SearchResultWeb)
