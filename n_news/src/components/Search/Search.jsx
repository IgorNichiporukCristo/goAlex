import React, { useCallback, useState, useRef, useEffect } from "react";

import cn from 'classnames';

import { typography } from "@sberdevices/plasma-tokens";
import { IconSearch, IconMic } from "@sberdevices/plasma-icons";

import "./Search.scss";

const Search = ({
    value,
    onChange,
    onSend,
    openId,
    closeId,
  // openSearchEvent,
  // closeSearchEvent,
    className,
    setPopperElement
}) => {
  const input = useRef(null);

  React.useEffect(() => {
      input.current.focus()
  });

  const onHandlerChange = useCallback(({ target }) => {
    // debugger;
    onChange(target.value);
  }, [onChange]);

  const onHandlerSend = useCallback((e, phone) => {
    if(e?.key === 'Enter' || phone) {
      if (e.target.value?.length !== 0) {
        onChange(e.target.value);
        onSend();
      }
    }
  }, [value, onSend]);

  const onHandlerSendButton = useCallback((e, phone) => {
    // debugger;
    if(e?.key === 'Enter' || phone) {
      if (e?.length !== 0) {
        onChange(e);
        onSend();
      }
    }
  }, [value, onSend]);


  const onClickWrapper = useCallback(() => {
    if (input && input.current) {
      input.current.focus();
    }
  }, []);

  return (
      <div ref={setPopperElement} className={cn("search", className)}>
          <button
              id={openId}
              className="search__icon search__icon_search"
              onClick={onClickWrapper}
          >
              <IconSearch size="s" />
          </button>
          <button
              id={openId}
              className="search__icon search__icon_mic"
              onClick={() => window.get_evg_func("sendAE")("SEACH_VOISE", {})}
          >
              <IconMic size="s" />
          </button>

          <input
            ref={input}
              className="search__field"
            style={typography.button2}
            type="text"
            placeholder="Поиск"
            value={value}
            onChange={(e) => onHandlerChange(e)}
            onKeyDown={(e) => onHandlerSend(e)}
            /* onClick={(e) => onHandlerSend(e, true)} */
          />
          <button
              id={openId}
              className="search__icon search__icon_send"
              onClick={() => onHandlerSendButton(value, true)}
          >
              <img src='send.svg' />
          </button>
      </div>
  );
};

export default React.memo(Search);
