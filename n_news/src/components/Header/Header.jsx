import React, { useRef, useCallback, useEffect } from "react";

import {
  IconChevronLeft,
  IconSearch,
  IconSettings,
} from "@sberdevices/plasma-icons";

import cn from "classnames";
import "./Header.scss";

const Header = ({ infoType, goBackEvent = "GO_BACK", className }) => {
  const menu = useRef(null);

  const onClickMenuItem = useCallback((pageName) => {
    window.get_evg_func("sendAE")(pageName, {});
  }, []);

  useEffect(() => {
    if (infoType === "worldNews" && menu && menu.current) {
      menu.current.scroll(menu.current.scrollWidth, 0);
    }
  }, [infoType]);

  return (
    <div className={cn("header", className)}>
      <div className="header__item">
        <div className="header__menu" ref={menu}>
          <div
            className={"kind " + (infoType === "lenta" ? "active" : "")}
            onClick={() => onClickMenuItem("LENTA")}
          >
            {window.screen.availWidth < 1366 ? 'Лента' : 'Моя лента '}
          </div>
          <div
            className={"kind " + (infoType === "news" ? "active" : "")}
            onClick={() => onClickMenuItem("NEWS")}
          >
            {window.screen.availWidth < 1366 ? 'СБЕР' : 'Новости Сбера'}
          </div>
          <div className={"kind header__recommendations" + (infoType === "recommendations" ? "active" : "")}>
            Рекомендации(скоро)
          </div>
          <div
            className={"kind " + (infoType === "worldNews" ? "active" : "")}
            onClick={() => onClickMenuItem("WORLD_NEWS")}
          >
            {window.screen.availWidth < 1366 ? 'МИР' : 'Новости мира'}
          </div>
        </div>
      </div>
      <div className="header__item">
        {/*<button*/}
        {/*  className="header__iconButton"*/}
        {/*  onClick={() => {*/}
        {/*    window.get_evg_func("sendAE")("SETTINGS", {});*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <IconSettings size="s" color="white" />*/}
        {/*</button>*/}
      </div>
    </div>
  );
};

export default React.memo(Header);
