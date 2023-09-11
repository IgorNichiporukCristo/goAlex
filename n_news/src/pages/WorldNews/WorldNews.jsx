import React from "react";

import { typography } from "@sberdevices/plasma-tokens";
import { Button } from "@sberdevices/plasma-ui";

import Header from '../../components/Header';

import "./WorldNews.scss";

const WorldNews = ({ infoType }) => {
  return (
    <div className="worldNews">
      <Header
        infoType={infoType}
        goBackEvent={"GO_BACK_WORLD_NEWS"}
      />
      <div className="worldNews__cardWrapper">
        <div className="worldNews__card">
          <div className="worldNews__img">
            <img src="./err.svg" alt="warning" />
          </div>
          <h3 style={typography.headline3} className="worldNews__title">Переходим<br/>к&nbsp;мировым новостям!</h3>
          <p style={typography.footnote1} className="worldNews__text">К новостям Сбера Вы можете вернуться в&nbsp;любой момент</p>
          <Button
            id="goWorldNews"
            className="worldNews__button"
            outlined={false}
            view="secondary"
            size="s"
            stretch={true}
            onClick={() => {window.get_evg_func("sendAE")("GO_WORLD_NEWS", {})}}
          >
            <div style={typography.button2}>Перейти</div>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(WorldNews);
