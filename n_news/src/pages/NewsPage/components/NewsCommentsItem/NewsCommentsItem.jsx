import React, { useState, useCallback } from "react";

import { typography } from "@sberdevices/plasma-tokens";
import { IconCross } from "@sberdevices/plasma-icons";

import CommentField from "../CommentField";

import { formattingParamsDate } from "../../../utils";

import "./NewsCommentsItem.css";

const CommentContent = ({ author, text, urlAuthor, date, shownButton, onClick, commentID }) => (
  <>
    <div className="newsComment__content">
      <img className="newsComment__avatar" src={urlAuthor ? urlAuthor : './avatar.svg'} alt="avatar" />
      <div className="newsComment__text">
        <div style={typography.footnote1} className="newsComment__name">
          {author}
        </div>
        <div style={typography.body1} className="newsComment__text">
          {text}
        </div>
      </div>
    </div>
    <div className="newsComment__footer">
      <div
        style={typography.caption}
        className="newsComment__date"
      >
        {formattingParamsDate(date)}
      </div>
      {shownButton && (
        <button
          className="newsComment__button"
          onClick={onClick}
        >
          <div
            style={typography.caption}
            className="newsComment__buttonText replyCommandItem"
            id="pressReply"
            onClick={
              () => {
                window.get_evg_func("sendAE")("PRESS_REPLY", {id: commentID});
              }
            }
            commentid={commentID}
          >Ответить</div>
        </button>
      )}
    </div>
  </>
);

const NewsCommentsItem = ({
  id,
  author,
  text,
  url_author,
  answers,
  date,
  userData,
  increaseCommentsCount,
  voiceComment,
  clearVoiceComment,
  activeFieldId,
  setActiveFieldId,
}) => {
  // alert(url_author);
  const [replyList, setReplyList] = useState(answers ?? []);

  const addReply = useCallback(
    (commentText) => {
      const now = new Date();
      const newReply = {
        id:
          Math.random().toString(16).slice(2) +
          Date.now().toString(16).slice(4),
        author: userData.userName,
        text: commentText,
        url_author: userData.userPhoto,
        date: {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          date: now.getDate(),
          hours: now.getHours(),
          minutes: now.getMinutes(),
        },
      };

      const newReplyList = replyList.slice();
      newReplyList.push({ ...newReply });

      setReplyList(newReplyList);
      increaseCommentsCount();
        setActiveFieldId(null);
    },
    [increaseCommentsCount, replyList, userData, setActiveFieldId]
  );

  return (
    <div className="newsComment" key={`comment${id}`}>
      <CommentContent
        author={author}
        text={text}
        urlAuthor={url_author}
        date={date}
        shownButton={activeFieldId !== id}
        commentID={id}
        onClick={() => setActiveFieldId(id)}
      />

      {replyList && replyList.length > 0 && (
        <div className="newsComment__answers">
          {replyList.map((answer) => (
            <div key={`commentAnswer${answer.id}`}>
              <CommentContent
                id={answer.id}
                author={answer.author}
                text={answer.text}
                urlAuthor={answer.url_author}
                date={answer.date}
                hideButton={true}
              />
            </div>
          ))}
        </div>
      )}

      {activeFieldId === id && (
        <div className="newsComment__input">
          <div className="newsComment__inputHeader">
            <div style={typography.caption}>ответ на комментарий</div>
            <button
              className="newsComment__inputClose"
              id="closeCommentReply"
              onClick={() => {setActiveFieldId(null); window.get_evg_func("sendAE")("CLOSE_COMMENT_REPLY", {});} }
            >
              <IconCross
                size="xs"
                color="white"
              />
            </button>
          </div>

          <CommentField
            addComment={addReply}
            commentId={id}
            voiceComment={voiceComment}
            clearVoiceComment={clearVoiceComment}
            autoFocus={true}
          />
        </div>
      )}
    </div>
  );
};

export default React.memo(NewsCommentsItem);
