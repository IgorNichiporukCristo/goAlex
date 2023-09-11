import React, { useMemo } from "react";

// import { typography } from "@sberdevices/plasma-tokens";
import { IconChevronLeft } from "@sberdevices/plasma-icons";

import { skills } from "../../skills";

import "./SkillsPage.scss";

const SkillsPage = (props) => {
  let y = props.phrase;
  if (!Array.isArray(props.phrase)) y = [y];

  const image = useMemo(() => {
    const img = skills.find((k) => k.name === props.title);
    return img && img.icon ? img.icon : "";
  }, [props.title]);

  const showStartButton = useMemo(() => {
    const skill = skills.find((k) => k.name === props.title);
    return skill && props.launchSkill;
  }, [props.title]);

  return (
    <div className="skillsPage">
      <div className="head">
        <div
          className="chev"
          onClick={() => {
            window.get_evg_func("sendAE")("GO_BACK_SKILL", {});
          }}
        >
          <IconChevronLeft size="s" color="white" />
        </div>
      </div>
      <div className="skillsPage__header">
        <div className="skillsPage__image">
          <img src={image && "./skills/inner/" + image} alt={props.title} />
        </div>
        <div>
          <div className="skillsPage__title">
            {props.title}
          </div>
          <div className="skillsPage__subtitle">
            <span>{props.type}</span>
          </div>
        </div>
      </div>
      <div className="skillsPage__buttons">
        <div className="skillsPage__rating">
          <img src="./star.svg" alt="star" />
          <div className="skillsPage__ratingText">{props.val}</div>
        </div>
        {showStartButton && (
          <a
            id="skillLaunch"
            href={"#"}
            className="skillsPage__link"
            onClick={() => {
              window.get_evg_func("sendAE")("ACTIVATE_SKILL");
              window.get_evg_func("closeApp")();
            }}
          >
            Запустить
          </a>
        )}
      </div>
      <div className="op">
        Описание:
      </div>
      <div className="sub">
        {props.subst}
      </div>
      <div className="lnc">
        <div className="tp1">
          Для запуска скажите:
        </div>
        {y.map((i, pos) => (
          <div className="tp2" key={pos}>
            <div>{i}</div>
          </div>
        ))}
      </div>
      {/*<div className="skillsPage__devices">
        <div className="skillsPage__devicesTitle" style={typography.body3}>
          Работает на устройствах
        </div>
        <div className="skillsPage__devicesItem">
          <img
            className="skillsPage__devicesIcon"
            src="./mobileIcon.svg"
            alt="mobileIcon"
          />
          <div style={typography.caption} className="skillsPage__devicesName">
            <span>Сбер Салют</span>
          </div>
        </div>
      </div>*/}
    </div>
  );
};

export default React.memo(SkillsPage);
