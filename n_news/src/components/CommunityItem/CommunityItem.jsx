import React, { useCallback, useState, useEffect } from "react";

import { typography } from "@sberdevices/plasma-tokens";
import { IconDone, IconPlus } from "@sberdevices/plasma-icons";

import "./CommunityItem.css";

const formattingUsersCount = (count) => {
  const number = Number(count);

  switch (true) {
    case number > 999999:
      return `${String(Math.floor((number / 1000000) * 10) / 10).replace('.', ',')} М`
    case number > 999:
      return `${String(Math.floor((number / 1000) * 10) / 10).replace('.', ',')} К`
    default:
      return count;
  }
};

const CommunityItem = ({
  id,
  icon = null,
  name,
  count,
  isSubscribed,
  settingsItemId,
  clearSettingsItemId,
}) => {
  const [active, setActive] = useState(isSubscribed ?? false);

  const onClick = useCallback(() => {
    if (active) {
      window.get_evg_func("sendAE")("REMOVE_FROM_SUBSCRIPTIONS", { id });
      setActive(false);
    } else {
      window.get_evg_func("sendAE")("ADD_TO_SUBSCRIPTIONS", { id });
      setActive(true);
    }
  }, [id, active]);

  useEffect(() => {
    setActive(isSubscribed);
  }, [isSubscribed]);

  useEffect(() => {
    if (settingsItemId && id === settingsItemId.id) {
      if (settingsItemId.type === "add" && !active) {
        window.get_evg_func("sendAE")("ADD_TO_SUBSCRIPTIONS", { id });
        setActive(true);
      }

      if (settingsItemId.type === "remove" && active) {
        window.get_evg_func("sendAE")("REMOVE_FROM_SUBSCRIPTIONS", { id });
        setActive(false);
      }
    }

    clearSettingsItemId();
  }, [settingsItemId, clearSettingsItemId, active, id]);

  return (
    <div className="communityItem">
      <div className="communityItem__icon">
        <img src={icon ? icon : "./sber_logo.svg"} alt={name} />
      </div>
      <div className="communityItem__text">
        <div
          style={typography.body1}
          className="communityItem__name"
        >{name}</div>
        <div
          style={typography.footnote1}
          className="communityItem__count"
        >{formattingUsersCount(count)}</div>
      </div>
      <button
        className="communityItem__button"
        onClick={onClick}
      >
        {active ? (
          <IconDone size="s" color="#24B23E" />
        ) : (
          <IconPlus size="s" color="white" />
        )}
      </button>
    </div>
  )
};

export default React.memo(CommunityItem);
