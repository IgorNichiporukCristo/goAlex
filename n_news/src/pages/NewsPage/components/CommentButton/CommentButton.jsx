import React, { useCallback, useEffect, useState } from "react";

import {
  IconMic,
  IconArrowUp,
} from "@sberdevices/plasma-icons";

import "./CommentButton.css";

const CommentButton = ({
  commentText,
  addComment,
  voiceComment = "",
  id = null,
}) => {
  const [buttonColor, setButtonColor] = useState("white");

  const onSendComment = useCallback(() => {
    // const params = id === null ? {
    //   commentText,
    // } : {
    //   commentText,
    //   id,
    // };

    // window.get_evg_func("sendAE")("SEND_COMMENT", params);
      addComment(commentText, id);
  }, [commentText, addComment, id]);

  const onClickMicro = useCallback(() => {
    window.get_evg_func("sendAE")("RECORD_COMMENT", {});
    setButtonColor("#21a038");
    setTimeout(() => setButtonColor("white"), 1000);
  }, []);

  useEffect(() => {
    if (voiceComment !== "") {
      setButtonColor("white");
    }
  }, [voiceComment]);

  return commentText.trim() ? (
    <button
      id="pressSendComment"
      className="commentButton"
      onClick={onSendComment}
    >
      <span>
        <IconArrowUp size="xs" color="white" />
      </span>
    </button>
  ) : (
    <button
      id="pressRecordComment"
      className="commentButton"
      onClick={onClickMicro}
    >
      <IconMic size="s" color={buttonColor} />
    </button>
  );
};

export default React.memo(CommentButton);
