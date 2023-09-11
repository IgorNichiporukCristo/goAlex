import "./App.scss";

import { Version } from "./Version.js";

import { typography } from "@sberdevices/plasma-tokens";

import "./NewScreen.css";
import React, { useState, useEffect, useCallback } from "react";
import { add_evg_func, exec_evg_func, get_evg_func } from "./EvgUtils.jsx";
import { initialize } from "./utils";

import NewsPage from "./pages/NewsPage";
import SkillsPage from "./pages/SkillsPage";
import NewsList, { filtersIds } from "./pages/NewsList";
import WorldNews from "./pages/WorldNews";
import SettingsPage from "./pages/SettingsPage";
import SearchMob from "src/pages/SearchMob";
import CanvasTabs from "./CanvasTabs";

import AlertItem from "./components/AlertItem";
import ModalDebug from "./components/ModalDebug";
import MainEvents from "./components/MainEvents";

import { Spinner } from "@sberdevices/plasma-ui";
import { skills } from "./skills";

import testObj from "./test_obj2.json";

//TODO split everything into managable pieces and put'em in
// separate files

function press_on_item(str) {
  let r = document.getElementById(str);
  if (r) r.click();
}

function NewScreen() {
  return (
    <div className="newScreen">
      <div className="tp">
        <img src="./err.svg" alt="none" />
        <div className="top">Не удалось загрузить информацию</div>
        <div className="bot">Попробуйте позже</div>
      </div>
    </div>
  );
}

function show_alert() {
  let r = document.getElementsByClassName("alertItem");
  if (r && r[0]) r = r[0];
  else return;
  let pos = 0;

  r.style.bottom = -1000 + "px";
  r.style.display = "flex";
  let bottom_pos = 0 - Number(r.clientHeight);
  r.style.bottom = bottom_pos;

  let id = setInterval(move_alert, 10);
  function move_alert() {
    let time_anim = 200;
    let time_delay = 1600;
    if (pos <= time_anim) {
      r.style.bottom =
        bottom_pos +
        (1 - (time_anim - pos) / time_anim) * (0 - bottom_pos + 140) +
        "px";
    } else if (
      pos >= time_anim + time_delay &&
      pos <= 2 * time_anim + time_delay
    ) {
      r.style.bottom =
        bottom_pos +
        ((time_anim - (pos - time_anim - time_delay)) / time_anim) *
          (0 - bottom_pos + 140) +
        "px";
    } else if (pos > 2 * time_anim + time_delay) {
      r.style.display = "none";
      clearInterval(id);
    }
    pos += 10;
  }
}

function trigger_new_news() {
  let r = document.getElementById("root");
  r.onscroll = (e) => {
    let j = e.srcElement;
    if (j.scrollTop + j.clientHeight >= j.scrollHeight - 400) {
      // debugger;
      if (
        window.evg_max_scroll === undefined ||
        window.evg_max_scroll <= j.scrollTop + j.clientHeight
      ) {
        if (
          window.evg_max_height === undefined ||
          window.evg_max_height !== r.scrollHeight
        ) {
          window.get_evg_func("sendAE")("PAGINATION", {});
          window.evg_max_scroll = j.scrollTop + j.clientHeight;
          window.evg_last_max_scroll = j.scrollTop + j.clientHeight;
          window.evg_max_height = r.scrollHeight;
        }
      }
    }
  };
}

function disable_new_news() {
  // debugger;
  let r = document.getElementById("root");
  r.onscroll = null;
  console.log(window.evg_max_scroll);
  delete window.evg_max_scroll;
  delete window.evg_max_height;
}

function App() {
  const [inputObjects, setInputObjects] = useState([]);
  const [currObject, setCurrObject] = useState([]);
  const [mode, setMode] = useState("normal");
  const [currScreen, setCurrScreen] = useState("default");
  const [currScreenParams, setCurrScreenParams] = useState([]);
  const [currNews, setCurrNews] = useState([]);
  const [mainEvents, setMainEvents] = useState(null);
  const [searchData, setSearchData] = useState({});
  const [searchValue, setSearchValue] = useState("");

  const [currInfoType, setCurrInfoType] = useState("lenta");
  const [currSortType, setCurrSortType] = useState("popular");
  const [currFilterType, setCurrFilterType] = useState({
    new: "new",
    popular: "popular",
  });
  const [iconState, setIconState] = useState(1);
  const [skl, setSkl] = useState([]);
  const [alertParams, setAlertParams] = useState([]);

  const [shownComments, setShownComments] = useState(false);
  const [voiceComment, setVoiceComment] = useState("");
  const [newCommentId, setNewCommentId] = useState("");

  const [filterTypeCommand, setFilterTypeCommand] = useState("");
  const [filterItemId, setFilterItemId] = useState("");

  const [shownAllNews, setShownAllNews] = useState(false);

  const [skillsScrollDirection, setSkillsScrollDirection] = useState("");

  const [speakerVal, setSpeakerVal] = useState(true);
  const [micVal, setMicVal] = useState(true);

  const [settingsItemId, setSettingsItemId] = useState(null);
  const [settingsSearchQuery, setSettingsSearchQuery] = useState("");

  const [stateButtonLeftPanel, setStateButtonLeftPanel] = useState(false);

  function sendAE(act, stf) {
    console.log("SEND EVENT " + act + " with parameters");
    console.log(stf);
    window.evg_assistant.sendData({
      action: { action_id: act, parameters: stf },
    });
  }

  const onToggleComments = useCallback(() => {
    if (shownComments) {
      // window.get_evg_func("sendAE")("HIDE_COMMENTS", {});
      setShownComments(false);
    } else {
      // window.get_evg_func("sendAE")("SHOW_COMMENTS", {});
      setShownComments(true);
    }
  }, [shownComments]);

  const clearVoiceComment = useCallback(() => {
    setVoiceComment("");
  }, []);

  const clearFilterTypeCommand = useCallback(() => {
    setFilterTypeCommand("");
  }, []);

  const clearFilterItemId = useCallback(() => {
    setFilterItemId("");
  }, []);

  const clearSkillsScrollDirection = useCallback(() => {
    setSkillsScrollDirection("");
  }, []);

  const clearSettingsItemId = useCallback(() => {
    setSettingsItemId(null);
  }, []);

  const clearSettingsSearchQuery = useCallback(() => {
    setSettingsSearchQuery("");
  }, []);

  useEffect(() => {
    if (window.innerWidth <= 1366) {
      setMicVal(true);
      setSpeakerVal(true);
      window.evg_mic_val = true;
      window.evg_speaker_val = true;
    } else {
      setMicVal(false);
      setSpeakerVal(false);
      window.evg_mic_val = false;
      window.evg_speaker_val = false;
    }
  }, []);

  useEffect(() => {
    window.evg_assistant = initialize(() => window.evg_assistant_state);
    window.exec_evg_func = exec_evg_func;
    window.add_evg_func = add_evg_func;
    window.get_evg_func = get_evg_func;
    window.evg_color = "white";
    window.add_evg_func("setScreen", setCurrScreen);
    window.add_evg_func("sendAE", sendAE);
    window.add_evg_func("setScreenParams", setCurrScreenParams);
    window.add_evg_func("setInfoType", setCurrInfoType);
    window.add_evg_func("setSortType", setCurrSortType);
    window.add_evg_func("setFilterType", setCurrFilterType);
    window.add_evg_func("setIconState", setIconState);
    window.add_evg_func("showAlert", show_alert);
    window.add_evg_func("closeApp", () => {
      window.evg_assistant.close();
    });
    window.add_evg_func("setMicVal", (e) => {
      setMicVal(e);
      window.evg_mic_val = e;
    });
    window.add_evg_func("setSpeakerVal", (e) => {
      setSpeakerVal(e);
      window.evg_speaker_val = e;
    });
  }, []);

  useEffect(() => {
    let t = {};
    Object.assign(t, currObject);
    let y = [];
    Object.assign(y, inputObjects);
    let r = new Date();
    y.unshift({
      date: r.toISOString(),
      val: JSON.stringify(t),
    });
    setInputObjects(y);

    const clickable_ids = [
      "pressSkills",
      "pressSound",
      "pressLike",
      "pressSkillStart",
      "pressSendComment",
      "pressRecordComment",
      "skillLaunch",
      "pressSettingsRecommendations",
      "pressSettingsSubscriptions",
      "openSettingsField",
      "closeSettingsField",
      "closeCommentReply",
      "goWorldNews",
    ];

    const complex_funcs = [
      {
        name: "showSkills",
        func: () => {
          setIconState(1);
        },
      },
      {
        name: "makeGreen",
        func: () => {
          window.evg_color = "#21a038";
        },
      },
      {
        name: "pressReply",
        func: () => {
          // debugger;
          let arr = document.getElementsByClassName("replyCommandItem");
          if (arr.length >= 0) {
            for (let j = 0; j < arr.length; j++) {
              let i = arr[j];
              if (
                Number(i.attributes.commentid.value) ===
                Number(currObject.commandParams.id)
              )
                i.click();
            }
          }
        },
      },
      {
        name: "hideSkills",
        func: () => {
          setIconState(0);
        },
      },
      {
        name: "showAlert",
        func: () => {
          setAlertParams({
            upperText: currObject.commandParams.upperText,
            lowerText: currObject.commandParams.lowerText,
          });
          window.get_evg_func("showAlert")();
        },
      },
      {
        name: "pingPong",
        func: () => {
          sendAE(
            currObject.commandParams.eventName || "PING",
            currObject.commandParams.eventParams
          );
        },
      },
      {
        name: "closeApp",
        func: () => {
          window.evg_assistant.close();
        },
      },
      {
        name: "showComments",
        func: () => {
          window.get_evg_func("sendAE")("SHOW_COMMENTS", {});
          if (!shownComments) {
            onToggleComments();
          }
        },
      },
      {
        name: "hideComments",
        func: () => {
          window.get_evg_func("sendAE")("HIDE_COMMENTS", {});
          if (shownComments) {
            onToggleComments();
          }
        },
      },
      {
        name: "setComment",
        func: ({ text }) => {
          setVoiceComment(text);
          sendAE("SET_VOICE_COMMENT", { text: text });
          try {
            let r = document.getElementsByClassName("currCommentField");
            if (r && r.length >= 1) {
              r = r[0];
              r = r.getElementsByTagName("input")[0];
              r.focus();
            }
          } catch (e) {}
        },
      },
      {
        name: "updateCommentId",
        func: ({ id }) => setNewCommentId(id),
      },
      {
        name: "showPopularFilter",
        func: () => setFilterTypeCommand("showPopularFilter"),
      },
      {
        name: "showNewFilter",
        func: () => setFilterTypeCommand("showNewFilter"),
      },
      {
        name: "showNew",
        func: () => setFilterItemId(filtersIds[0]),
      },
      {
        name: "showNewTen",
        func: () => setFilterItemId(filtersIds[1]),
      },
      {
        name: "showPopular",
        func: () => setFilterItemId(filtersIds[2]),
      },
      {
        name: "showDay",
        func: () => setFilterItemId(filtersIds[3]),
      },
      {
        name: "showWeek",
        func: () => setFilterItemId(filtersIds[4]),
      },
      {
        name: "showMonth",
        func: () => setFilterItemId(filtersIds[5]),
      },
      {
        name: "showYear",
        func: () => setFilterItemId(filtersIds[6]),
      },
      {
        name: "showAllTime",
        func: () => setFilterItemId(filtersIds[7]),
      },
      {
        name: "skillsScrollNext",
        func: () => setSkillsScrollDirection("next"),
      },
      {
        name: "skillsScrollPrev",
        func: () => setSkillsScrollDirection("prev"),
      },
      {
        name: "showLink",
        func: () => {
          document.getElementById("link_for_a_rainy_day").innerHTML =
            window.location.href;
        },
      },
      {
        name: "updateSettingsPage",
        func: ({ data }) => setCurrScreenParams(data),
      },
      {
        name: "pressAddToSubscriptions",
        func: ({ id }) => setSettingsItemId({ id, type: "add" }),
      },
      {
        name: "pressRemoveFromSubscriptions",
        func: ({ id }) => setSettingsItemId({ id, type: "remove" }),
      },
      {
        name: "settingsSearchQuery",
        func: ({ query }) => setSettingsSearchQuery(query),
      },
      {
        name: "scrollDownNews",
        func: () => {
          let root = document.getElementById("root");
          root.scrollBy(0, root.offsetHeight);
        },
      },
      {
        name: "scrollUpNews",
        func: () => {
          let root = document.getElementById("root");
          root.scrollBy(0, -root.offsetHeight);
        },
      },
      {
        name: "searchNews",
        func: () => {
          let searchButton = document.getElementsByClassName(
            "newsList__searchButton"
          );
          if (
            searchButton &&
            searchButton[0] &&
            window.window.innerWidth <= 1366
          ) {
            searchButton[0].click();
          }
          // debugger;
          let q = currObject.commandParams?.query;

          let elem = document.getElementsByClassName("search__field");
          if (!elem) return;
          elem = elem[0];
          if (q || true) {
            setSearchValue(q);
            elem.value = q;
            //Crude fix that works for now
            if (window.innerWidth > 1366) {
              window.get_evg_func("sendAE")("SEARCH", {
                search: q,
                platforms: "WEB",
              });
            } else {
              window.get_evg_func("sendAE")("SEARCH", {
                search: q,
                platforms: "MOB",
              });
            }
            elem.click();
            elem.focus();
          }
        },
      },
    ];

    if (currObject.commandName) {
      console.log("Trying to execute command " + currObject.commandName);
      console.log("with params");
      console.log(currObject.commandParams);
    }

    let k;
    if (
      (k = clickable_ids.find((i) => i === currObject.commandName)) !==
      undefined
    ) {
      // alert(k);
      press_on_item(k);
    } else if (
      (k = complex_funcs.find((i) => i.name === currObject.commandName)) !==
      undefined
    ) {
      k.func(currObject.commandParams);
    } else if (currObject.commandName === "openScreen") {
      setShownComments(false);
      window.evg_color = "white";
      window.get_evg_func("setScreen")(currObject.commandParams.screenName);

      disable_new_news();

      if (
        currObject.commandParams.params &&
        currObject.commandParams.params.mainNewsData
      ) {
        setMainEvents(currObject.commandParams.params.mainNewsData);
      } else {
        setMainEvents([]);
      }

      if (
        currObject.commandParams.params &&
        currObject.commandParams.params.search
      ) {
        setSearchData(currObject.commandParams.params.search);
      } else {
        setSearchData({});
      }

      //TODO change the contract
      if (
        currObject.commandParams.params &&
        currObject.commandParams.params.searchValue
      ) {
        setSearchValue(currObject.commandParams.params.searchValue);
      } else {
        setSearchValue("");
      }

      if (currObject.commandParams.screenName === "newsList") {
        if (currObject?.commandParams?.params?.data) {
          setCurrNews(currObject.commandParams.params.data);
        } else {
          setCurrNews([]);
        }
        let y = currObject.commandParams.params?.infoType;
        setCurrInfoType(y.infoTypeFirst);
        setCurrSortType(y.infoTypeSecond);
        setCurrFilterType({
          new: currObject.commandParams.params.filterTypeNew,
          popular: currObject.commandParams.params.filterTypePopular,
        });
        trigger_new_news();
        if (currObject.commandParams.params.collapse_or_expand === "collapse") {
          setIconState(0);
        } else {
          setIconState(1);
        }
        let sk = [];
        Object.assign(sk, currObject.commandParams.params.skillsData);
        for (let i = 0; i < sk.length; i++) {
          let j = skills.find((k) => k.name === sk[i].title.trim());
          if (j) sk[i].icon = j.icon;
        }
        setSkl(sk);
      }
      window.get_evg_func("setScreenParams")(currObject.commandParams.params);
    }

    if (currObject.commandName === "appendNews") {
      if (currObject.commandParams.data.length > 0) {
        let r = [];
        Object.assign(r, currNews);

        r = r.concat(currObject.commandParams.data);
        setCurrNews(r);
      } else {
        setShownAllNews(true);
      }
    }
  }, [currObject]);

  useEffect(() => {
    window.evg_assistant.on("data", (input) => {
      // debugger;
      if (input.type === "navigation") {
        let root = document.getElementById("root");
        if (input.navigation.command === "UP")
          root.scrollBy(0, -root.offsetHeight);
        if (
          input.navigation.command === "DOWN" ||
          input.navigation.command === "FORWARD"
        ) {
          root.scrollBy(0, root.offsetHeight);
          sendAE("NEWS_START", {});
        }
      }
      console.log(input.smart_app_data)
      if (input.smart_app_data) setCurrObject(input.smart_app_data);
      // if (input.smart_app_data) setCurrObject({commandName: "openScreen", commandParams: testObj});
    });
  }, []);

  var debug_paraph = <></>;
  function debugModeToggle() {
    if (mode === "debug") setMode("normal");
    else setMode("debug");
  }

  if (process.env.REACT_APP_DEB !== "prod" || true) {
    let db = {
      position: "fixed",
      top: "2em",
      right: "2em",
      padding: "10px",
      borderRadius: "2px",
      zIndex: "20",
      backgroundColor: "#00aa00",
    };
    let st = {
      position: "fixed",
      fontSize: "14px",
      left: "50%",
      top: "2em",
      color: "orange",
      zIndex: "10",
    };

    let al = {
      position: "fixed",
      fontSize: "14px",
      left: "50%",
      top: "5em",
      color: "red",
      zIndex: "10",
    };

    debug_paraph = (
      <div className="app__debug">
        <button onClick={debugModeToggle} style={db}>
          Debug
        </button>
        <p
          style={{
            zIndex: "30",
            left: "10px",
            position: "fixed",
            top: "0.5em",
            color: "red",
            fontSize: "12px",
          }}
        >
          {JSON.stringify("a")}
        </p>
        <div style={st}>
          <Version />
        </div>
        <div id="alert" style={al}></div>
      </div>
    );
  }

  if (mode === "debug") {
    let inner = {
      currNews: currNews,
    };
    return (
      <>
        {debug_paraph}
        <ModalDebug data={inputObjects} inner={inner} />
      </>
    );
  }

  let cont = <Spinner className="app__spinner" />;

  if (currScreen === "default" || currScreen === "newsList") {
    cont = (
      <NewsList
      stateButtonLeftPanel={stateButtonLeftPanel}
      setStateButtonLeftPanel={setStateButtonLeftPanel}
        data={currNews}
        params={currScreenParams}
        iconState={iconState}
        sortType={currSortType}
        infoType={currInfoType}
        filterType={currFilterType}
        skl={skl}
        filterTypeCommand={filterTypeCommand}
        clearFilterTypeCommand={clearFilterTypeCommand}
        filterItemId={filterItemId}
        clearFilterItemId={clearFilterItemId}
        shownAllNews={shownAllNews}
        skillsScrollDirection={skillsScrollDirection}
        clearSkillsScrollDirection={clearSkillsScrollDirection}
        searchData={searchData}
        newSearchValue={searchValue}
        micVal={micVal}
        speakerVal={speakerVal}
      />
    );
  } else if (currScreen === "newsPage" && currScreenParams.newsData) {
    cont = (
      <NewsPage
        data={currScreenParams.newsData}
        shownComments={shownComments}
        onClickComments={onToggleComments}
        voiceComment={voiceComment}
        clearVoiceComment={clearVoiceComment}
        newCommentId={newCommentId}
        newSearchValue={searchValue}
        searchData={searchData}
      />
    );
  } else if (currScreen === "skillsPage") {
    cont = (
      <SkillsPage
        val={5}
        title={currScreenParams.title}
        type={currScreenParams.subtitle}
        subst={currScreenParams.description}
        phrase={currScreenParams.activationPhrase}
        launchSkill={currScreenParams.launchSkill}
        url={currScreenParams.url}
      />
    );
  } else if (currScreen === "alertScreen") {
    cont = <NewScreen />;
  } else if (currScreen === "worldNews") {
    cont = <WorldNews infoType="worldNews" />;
  } else if (currScreen === "settingsPage") {
    cont = (
      <SettingsPage
        data={currScreenParams}
        settingsItemId={settingsItemId}
        clearSettingsItemId={clearSettingsItemId}
        searchQuery={settingsSearchQuery}
        clearSearchQuery={clearSettingsSearchQuery}
      />
    );
  } else if (currScreen === "searchPage") {
    cont = (
      <SearchMob
        newSearchValue={searchValue}
        news={searchData.news}
        newsEvents={searchData.newsEvents}
        communities={searchData.communities}
      />
    );
  }

  return (
    <div className="app">
      <div
        style={{ color: "red", fontSize: "12px" }}
        id="link_for_a_rainy_day"
      />
      {debug_paraph}
      {cont}
      {(currScreen === "default" ||
        currScreen === "worldNews" ||
        currScreen === "skillsPage" ||
        currScreen === "newsPage" ||
        currScreen === "newsList") && (
        <MainEvents
        stateButtonLeftPanel={stateButtonLeftPanel}
        setStateButtonLeftPanel={setStateButtonLeftPanel}
          news={mainEvents?.news}
          communities={mainEvents?.communities}
          className="app__mainEvent"
        />
      )}
      {/*<div id="pad" style={{ height: "150px" }} />*/}
      <AlertItem
        upperText={alertParams.upperText}
        lowerText={alertParams.lowerText}
      />
    </div>
  );
}

export default App;
