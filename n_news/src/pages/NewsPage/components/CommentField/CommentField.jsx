import React, { useCallback, useEffect, useState } from "react";

import { TextField } from "@sberdevices/plasma-ui";

import CommentButton from "../CommentButton";

const CommentField = ({
  voiceComment,
  clearVoiceComment,
  addComment,
  commentId,
  autoFocus = false,
}) => {
  const [comment, setComment] = useState("");

  const onInputComment = useCallback(
    ({ target }) => setComment(target.value),
    []
  );

    const sendComment = useCallback(() => {
        const params = commentId ? {
            commentText: comment,
        } : {
            commentText: comment,
            id: commentId,
        };

        window.get_evg_func("sendAE")("SEND_COMMENT", params);
      addComment(comment);
      setComment("");
    }, [addComment, comment, commentId]);

  useEffect(() => {
    if (voiceComment !== "") {
      setComment(voiceComment);
      clearVoiceComment();
    }
  }, [voiceComment, clearVoiceComment]);

  return (
    <TextField
      label="Оставить комментарий"
      className="currCommentField"
      contentRight={
        <CommentButton
          commentText={comment}
          addComment={sendComment}
          voiceComment={voiceComment}
          id={commentId}
        />
      }
      value={comment}
      onChange={onInputComment}
      onKeyDown={(e) => {
        if(e?.key === 'Enter') {
          sendComment();
        }
      }}
      autoFocus={autoFocus}
    />
  );
};

export default React.memo(CommentField);
