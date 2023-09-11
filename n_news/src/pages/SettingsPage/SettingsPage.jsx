import React, { useCallback, useState, useEffect } from "react";

import { Tabs, TabItem } from "@sberdevices/plasma-ui";
import { typography } from "@sberdevices/plasma-tokens";
import { IconChevronLeft } from "@sberdevices/plasma-icons";

import CommunityItem from "../../components/CommunityItem";
import Search from "../../components/Search";

import "./SettingsPage.scss";

const SettingsPage = ({
  data,
  settingsItemId,
  clearSettingsItemId,
  searchQuery,
  clearSearchQuery,
}) => {
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [isOpenInput, setIsOpenInput] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [timer, setTimer] = useState(null);

  const onClickInput = useCallback((isOpen, event) => {
    setIsOpenInput(isOpen);
    window.get_evg_func("sendAE")(event, {});
  }, []);

  const onChangeInput = useCallback((value) => {
    setSearchValue(value);

    clearTimeout(timer);

    setTimer(setTimeout(() => {
      if (value !== "") {
        window.get_evg_func("sendAE")("SETTINGS_SEARCH", {
          payload: value,
        });
      }
    }, 500));
  }, [timer]);

  useEffect(() => {
    if (searchQuery !== "" && isOpenInput) {
      setSearchValue(searchQuery);
      window.get_evg_func("sendAE")("SETTINGS_SEARCH", {
        payload: searchQuery,
      });
    }

    clearSearchQuery();
  }, [searchQuery, clearSearchQuery, isOpenInput]);

  useEffect(() => {
    return () => {
      clearTimeout(timer)
    }
  }, [timer]);

  return (
    <div className="settingsPage">
      <div className="settingsPage__header">
        <div
          className="settingsPage__backButton"
          onClick={() => {
            window.get_evg_func("sendAE")("GO_BACK_SETTINGS", {});
          }}
        >
          <IconChevronLeft size="s" color="white" />
        </div>
        <div style={typography.body2}>Настройки ленты</div>
      </div>

      <Search
        value={searchValue}
        onChange={onChangeInput}
        openId="openSettingsField"
        closeId="closeSettingsField"
        openSearchEvent={() => onClickInput(true, "OPEN_SETTINGS_FIELD")}
        closeSearchEvent={() => onClickInput(false, "CLOSE_SETTINGS_FIELD")}
      />

      {!isOpenInput && data.type !== "search" && (
        <>
          <Tabs
            size="s"
            stretch={true}
            pilled={true}
          >
            <TabItem
              id="pressSettingsSubscriptions"
              onClick={() => {
                setActiveTab("subscriptions");
                window.get_evg_func("sendAE")("SETTINGS_SUBSCRIPTIONS", {});
              }}
              isActive={activeTab === "subscriptions"}
              aria-controls="my-tabs"
              style={{ outline: 'none' }}
            >
              <div style={typography.button2}>Мои подписки</div>
            </TabItem>

            <TabItem
              id="pressSettingsRecommendations"
              onClick={() => {
                setActiveTab("recommendations");
                window.get_evg_func("sendAE")("SETTINGS_RECOMMENDATIONS", {});
              }}
              isActive={activeTab === "recommendations"}
              aria-controls="my-tabs"
              style={{ outline: 'none' }}
            >
              <div style={typography.button2}>Рекомендации</div>
            </TabItem>
          </Tabs>

          <div className="settingsPage__list">
            {data.list.length > 0 && data.list.map(({ id, name, subscribers, icon, is_subscribed }) => (
              <CommunityItem
                key={`subscriptionsItem-${id}`}
                id={id}
                name={name}
                count={subscribers}
                icon={icon}
                isSubscribed={is_subscribed}
                settingsItemId={settingsItemId}
                clearSettingsItemId={clearSettingsItemId}
              />
            ))}
            {(activeTab === "subscriptions" && !data.list.length) && (
              <div style={typography.body1} className="settingsPage__listEmpty">Здесь будут Ваши подписки</div>
            )}
          </div>
        </>
      )}

      {data.type === "search" && (
        <div className="settingsPage__list">
          {data.list.length > 0 && data.list.map(({ id, name, subscribers, icon, is_subscribed }) => (
            <CommunityItem
              key={`subscriptionsItem-${id}`}
              id={id}
              name={name}
              count={subscribers}
              icon={icon}
              isSubscribed={is_subscribed}
              settingsItemId={settingsItemId}
              clearSettingsItemId={clearSettingsItemId}
            />
          ))}
          {!data.list.length && (
            <div style={typography.body1} className="settingsPage__listEmpty">Не нашел такое сообщество<br />Попробуйте проверить название</div>
          )}
        </div>
      )}
      
    </div>
  )
};

export default React.memo(SettingsPage);
