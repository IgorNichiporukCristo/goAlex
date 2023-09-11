import React, { useCallback, useState, useEffect } from "react";

import { typography } from "@sberdevices/plasma-tokens";

import NewsCommentsItem from "../NewsCommentsItem";
import CommentField from "../CommentField";

import "./NewsComments.css";

const NewsComments = ({
  comments,
  increaseCommentsCount,
  voiceComment,
  clearVoiceComment,
  userData,
  newCommentId,
}) => {
  const [commentsList, setCommentsList] = useState(comments ?? []);
  const [temporaryCommentId, setTemporaryCommentId] = useState("");
  const [activeFieldId, setActiveFieldId] = useState(null);

  const addComment = useCallback(
      (commentText, id) => {
      const now = new Date();
      const temporaryId = Math.random().toString(16).slice(2) +
            Date.now().toString(16).slice(4);
      // debugger;
      const newComment = {
        id: temporaryId,
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


        
      const newCommentsList = commentsList.slice();
      newCommentsList.push({ ...newComment });

      setTemporaryCommentId(temporaryId);
      setCommentsList(newCommentsList);
      increaseCommentsCount();
    },
    [userData, commentsList, increaseCommentsCount]
  );

  useEffect(() => {
    const newCommentsList = commentsList.map((comment) => {
      if (comment.id === temporaryCommentId) {
        return {
          ...comment,
          id: newCommentId,
        }
      }

      return comment;
    });

    setCommentsList(newCommentsList);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCommentId]);

  // alert(JSON.stringify(commentsList))
  return (
    <div className="newsPage__commentsWrapper">
      <div className="newsPage__comments">
        {commentsList.length > 0 ? commentsList.map(({ id, author, text, url_author, answers, date }) => (
          <NewsCommentsItem
            key={`commentItem-${id}`}
            id={id}
            author={author}
            text={text}
            url_author={url_author}
            answers={answers}
            date={date}
            userData={userData}
            increaseCommentsCount={increaseCommentsCount}
            voiceComment={voiceComment}
            clearVoiceComment={clearVoiceComment}
            activeFieldId={activeFieldId}
            setActiveFieldId={setActiveFieldId}
          />
        )) : (
          <div className="newsPage__commentsEmpty" style={typography.body1}>Комментариев еще нет</div>
        )}
      </div>
      
      {activeFieldId === null && (
        <CommentField
          addComment={addComment}
          commentId={null}
          voiceComment={voiceComment}
          clearVoiceComment={clearVoiceComment}
        />
      )}
    </div>
  );
};

export default React.memo(NewsComments);
