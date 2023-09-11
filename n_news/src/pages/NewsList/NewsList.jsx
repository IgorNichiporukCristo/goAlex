import React, { useCallback, useMemo, useState, useEffect } from "react";

import { typography } from "@sberdevices/plasma-tokens";
import { IconChevronLeft, IconSearch } from "@sberdevices/plasma-icons";
import { filtersIds, filters } from "./data";
import cn from "classnames";

import NewsCard from "src/components/NewsCard";
import Switch from "src/components/Switch";
import Skills from "src/components/Skills";
import FilteringPopup from "src/components/FilteringPopup";
import Header from "src/components/Header";
import Collapse from "src/components/Collapse";
import Carousel from "src/components/Carousel";
import Search from "src/components/Search";
import Popper from "src/components/Popper/Popper";
// import CanvasTabs from "src/components/CanvasTabs/CanvasTabs";
import CanvasTabs from "src/CanvasTabs";

import MicButton from "../../MicButton";
import LeftPanel from "src/components/LeftPanel";

import { getTodayDate } from "../utils";

import { TopButtons } from "./TopButtons.jsx";

import SearchResultWeb from "src/components/SearchResultWeb/SearchResultWeb";
import "./NewsList.scss";

const NewsList = (props) => {
  const [searchRef, setSearchRef] = useState(null);
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [refSwitch, setRefSwitch] = useState(null);
  const [activeTab, setActiveTab] = useState(props.sortType);
  const [activeFilter, setActiveFilter] = useState(
    props.sortType === "popular"
      ? props.filterType.popular
      : props.filterType.new
  );
  const [popularTabText, setPopularTabText] = useState(
    filters[props.filterType.popular].name
  );
  const [newTabText, setNewTabText] = useState(
    filters[props.filterType.new].name
  );
  const [searchValue, setSearchValue] = useState(props.newSearchValue);
  const [searchData, setSearchData] = useState(props.searchData);

  useEffect(() => {
    let scr = window.evg_last_max_scroll;
    let elem = document.getElementById("root");

    elem.style.scrollBehavior = "smooth";
    scr -= 200;
    if (scr < 0) scr = 0;
    elem.scroll(0, scr);
  }, []);

  useEffect(() => {
    // debugger;
    setSearchData(props.searchData);
  }, [props.searchData]);

  useEffect(() => {
    setPopularTabText(filters[props.filterType.popular].name);
    setNewTabText(filters[props.filterType.new].name);
  });

  useEffect(() => {
    setActiveFilter(
      props.sortType === "popular"
        ? props.filterType.popular
        : props.filterType.new
    );
    setActiveTab(props.sortType);
  });

  const tabList = useMemo(
    () => [
      {
        id: "popular",
        name: popularTabText,
      },
      {
        id: "new",
        name: newTabText,
      },
      {
        id: "recommendations",
        name: "Рекомендации (скоро)",
        web: true,
      },
    ],
    [popularTabText, newTabText, props]
  );
  // const tabList = [
  //   {
  //     id: 'popular',
  //     name: popularTabText,
  //   },
  //   {
  //     id: 'new',
  //     name: newTabText,
  //   },
  // ];

  const popupList = useMemo(
    () =>
      activeTab === "new"
        ? [
            {
              id: filtersIds[0],
              name: filters.new.name,
            },
            {
              id: filtersIds[1],
              name: filters.new10.name,
            },
          ]
        : [
            {
              id: filtersIds[2],
              name: filters.popular.name,
            },
            {
              id: filtersIds[3],
              name: filters.day.name,
            },
            {
              id: filtersIds[4],
              name: filters.week.name,
            },
            {
              id: filtersIds[5],
              name: filters.month.name,
            },
            // {
            //   id: filtersIds[6],
            //   name: filters.year.name,
            // },
            // {
            //   id: filtersIds[7],
            //   name: filters.allTime.name,
            // },
          ],
    [activeTab]
  );

  const onClickFilter = useCallback(
    (sort) => {
      setIsOpenPopup(false);
      if (sort === "new") {
        if (sort === activeTab) {
          setRefSwitch(document.getElementById(`tab-${sort}`));
          setIsOpenPopup(true);
          window.get_evg_func("sendAE")("NEW_FILTER", {});
        } else {
          if (props.infoType !== "news") {
            window.get_evg_func("sendAE")("NEW_LENTA", {});
          } else {
            window.get_evg_func("sendAE")("NEW_NEWS", {});
          }
        }
      }

      if (sort === "popular") {
        if (sort === activeTab) {
          setRefSwitch(document.getElementById(`tab-${sort}`));
          setIsOpenPopup(true);
          window.get_evg_func("sendAE")("SHOW_POPULAR_FILTER", {});
        } else {
          if (props.infoType !== "news") {
            window.get_evg_func("sendAE")("POPULAR_LENTA", {});
          } else {
            window.get_evg_func("sendAE")("POPULAR_NEWS", {});
          }
        }
      }

      if (sort === "recommendations") {
        window.get_evg_func("sendAE")("RECOMMENDATION", {});
      }

      // setActiveTab(sort);
    },
    [activeTab, props.infoType]
  );

  const onClickPopupListItem = useCallback(
    (id) => {
      setActiveFilter(id);
      if (activeTab === "popular") {
        setPopularTabText(filters[id].name);
      } else {
        setNewTabText(filters[id].name);
      }
      setIsOpenPopup(false);
      window.get_evg_func("sendAE")(filters[id].event, {});
    },
    [activeTab]
  );

  useEffect(() => {
    const getActiveSort =
      props.sortType === "popular"
        ? props.filterType.popular
        : props.filterType.new;
    setActiveFilter(getActiveSort);
  }, [props.sortType, props.filterType]);

  useEffect(() => {
    const { filterTypeCommand: command, clearFilterTypeCommand } = props;

    if (command !== "" && !isOpenPopup) {
      if (command === "showPopularFilter" && activeTab === "popular") {
        setIsOpenPopup(true);
        window.get_evg_func("sendAE")("SHOW_POPULAR_FILTER", {});
      }

      if (command === "showNewFilter" && activeTab === "new") {
        setIsOpenPopup(true);
        window.get_evg_func("sendAE")("NEW_FILTER", {});
      }
    }

    clearFilterTypeCommand();
  }, [props, activeTab, isOpenPopup]);

  useEffect(() => {
    const { filterItemId: id, clearFilterItemId } = props;

    if (id !== "" && isOpenPopup && activeFilter !== id) {
      if (id === filtersIds[0] || id === filtersIds[1]) {
        if (activeTab === "new") {
          onClickPopupListItem(id);
        }
      } else if (activeTab === "popular") {
        onClickPopupListItem(id);
      }
    }

    clearFilterItemId();
  }, [props, activeFilter, activeTab, isOpenPopup, onClickPopupListItem]);

  const j = useMemo(() => {
    if (!props?.data) {
      return [];
    }
    return props.data;
  }, [props.data]);

  React.useEffect(() => {
    if (searchValue === "") setSearchData({});
  }, [searchValue]);

  const onHandlerSearchChange = useCallback((newValue) => {
    setSearchValue(newValue);
  }, []);

  const onHandlerSend = useCallback(() => {
    if (window.screen.availWidth > 1366) {
      window.get_evg_func("sendAE")("SEARCH", {
        search: searchValue,
        platforms: "WEB",
      });
    } else {
      window.get_evg_func("sendAE")("SEARCH", {
        search: searchValue,
        platforms: "MOB",
      });
    }
  }, [searchValue, window.screen.availWidth]);

  return (
    <div
      className={props.stateButtonLeftPanel ? "newsList newsListRight" : "newsList"}
    >
      <div
        className="header__backButton"
        onClick={() => {
          window.get_evg_func("sendAE")("GO_BACK", {});
        }}
      >
        <IconChevronLeft size="s" color="white" className="header_LeftButton" />
        <div className="newsList__backDate">{getTodayDate()}</div>
        <div className="newsList__showButton">
          <TopButtons />
        </div>
      </div>
      <CanvasTabs activeIndex={3} className="newsList__canvasTabs" />
      <Search
        className={cn(
          "newsList__search",
          isOpenSearch && "newsList__search_active"
        )}
        value={searchValue}
        onChange={onHandlerSearchChange}
        onSend={onHandlerSend}
        setPopperElement={setSearchRef}
      />
      {
        /* searchValue.length > 0 &&  */ Object.keys(searchData).length > 0 &&
          window.screen.availWidth > 1366 && (
            <Popper autoMaxWidth targetRef={searchRef}>
              <SearchResultWeb searchData={props.searchData} />
            </Popper>
          )
      }
      <Header className="newsList__header" infoType={props.infoType} />
      <div className="newsList__switchWrapper">
        <Switch
          onClick={onClickFilter}
          items={tabList}
          activeItem={activeTab}
        />
        <button
          className="newsList__searchButton"
          onClick={() => {
            setIsOpenSearch(true);
          }}
        >
          <IconSearch size="s" color="white" />
        </button>
      </div>
      {/*<div className="skirt" />*/}
      <div className="ourSkills">
        <div className="lhs" style={typography.body3}>
          {(activeTab === "popular" ? "Популярные" : "Свежие") +
            " навыки ассистента"}
        </div>
        <div
          id="pressSkills"
          className="rhs"
          onClick={() => {
            if (isOpenCollapse) {
              setIsOpenCollapse(false);
            } else {
              setIsOpenCollapse(true);
            }
            props.clearSkillsScrollDirection();
          }}
        >
          {isOpenCollapse ? "Свернуть" : "Развернуть"}
        </div>
      </div>
      {
        props.skl.length > 0 && (
          // <Collapse isOpen={isOpenCollapse}>
          <div
            className={cn(
              "newsList__coruselWrapper",
              isOpenCollapse && "newsList__coruselWrapper_open"
            )}
          >
            <Carousel
              length={props.skl.length}
              withArrows
              visibleElements={4}
              className="newsList__corusel"
            >
              {/* TODO Убратб window костыли */}
              <Skills
                skills={props.skl}
                scrollDirection={props.skillsScrollDirection}
                clearScrollDirection={props.clearSkillsScrollDirection}
                skillsNumber={window.screen.availWidth < 1366 ? 4 : 8}
              />
            </Carousel>
          </div>
        )
        // </Collapse>
      }
      {j.map(
        ({
          id,
          community,
          data,
          time,
          title,
          description,
          url,
          repost,
          parentPostCommunity,
          type,
          voting,
        }) => (
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
            voting={voting}
          />
        )
      )}
      {props.shownAllNews && props.infoType === "news" && (
        <div className="newsList__allNewsMessage">
          Вы просмотрели все новости
        </div>
      )}
      <FilteringPopup
        isOpen={isOpenPopup}
        onClose={() => setIsOpenPopup(false)}
        onClickListItem={onClickPopupListItem}
        activeItem={activeFilter}
        list={popupList}
        targetRef={refSwitch}
      />
      <>
        <button
          className="newsList__homeSvg"
          onClick={() => window.get_evg_func("sendAE")("HOME_PRESS", {})}
        >
          <img src="./gradHomeIcon.svg" alt="home" />
        </button>
        <LeftPanel setStateButtonLeftPanel={props.setStateButtonLeftPanel} />
      </>

      <MicButton />
    </div>
  );
};

export default React.memo(NewsList);
