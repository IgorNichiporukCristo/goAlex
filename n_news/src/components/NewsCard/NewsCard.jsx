import React, {useEffect, useState, useMemo, useRef} from "react";

import cn from 'classnames'

import { formatDate, formattedText } from '../../pages/utils';
import normalizeContent from 'src/assets/scripts/normalizeContent';
import Poll from 'src/pages/NewsPage/components/Poll';

import Hls from 'hls.js';

import "./NewsCard.scss";

const rand_string = () => {
  const alpha = "qwertyuiopasdfghjklzxcvbnm1234567890";
  let ret = "";
  for (let i = 0; i < 5; i++) {
    ret += alpha[Math.round(Math.random() * alpha.length)];
  }
  return ret;
};


const NewsCard = ({
  id,
  community,
  data,
  time,
  title,
  description,
  url,
  repost,
  parentPostCommunity,
  type,
    isSearch,
    className,
    voting
}) => {
  const ref = useRef(null);
  const [timerId, setTimerId] = React.useState();
  const [int, setInt] = React.useState(false);
  const [formattedTitle, setFormattedTitle] = useState("");
  const [formattedВDescription, setFormattedВDescription] = useState("");


    React.useEffect(() => {
	try {
	    document.getElementById('root').addEventListener('scroll', function() {
		try {
		    if(ref.current?.getBoundingClientRect().top + ref.current.clientHeight <= window.innerHeight && ref.current?.getBoundingClientRect().top >= 0 && !int) {
			// console.log('++++++++++++++++++++enter', timerId)
			setInt(true)
			setTimerId(
			    // setInterval(() => console.log(title), 1000)
			);
		    } else {
			clearInterval(timerId);
			
		    }
		}
		catch(e) {
		}
		

    })


    return () => {
      clearInterval(timerId);
    };
	}
	catch(e) {
	    // console.log("Something is wrng with the scroll listener");
	}
  }, [timerId, int, title])

  // useEffect(() => console.log(timerId, title), [timerId, title])

  useEffect(() => {
    if(title) {
      setFormattedTitle(type === 'article' ? normalizeContent(title) : normalizeContent(title));
    }
  }, [title]);

  useEffect(() => {
    if(description) {
      setFormattedВDescription(normalizeContent(description));
    }
  }, [description]);

  const iid = useMemo(() => rand_string(), []);
  
  useEffect(() => {
    // return ;
    // debugger;
    var video = document.getElementById(iid);

    if (!video)
      return ;

    var videoSrc = url;
    var notAppleFlag = ! window.clientInformation.userAgent.search('Safari') >= 0 &&
        ! window.clientInformation.userAgent.search('safari') >= 0;
    if (Hls.isSupported() && notAppleFlag) {
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    }
    else {
      video.src = videoSrc;
    }
    
  }, [url]);


  return (
      <div
          className={cn("newsCard", className)}
          onClick={() => {
            isSearch ? window.get_evg_func("sendAE")("GET_NEWS_SEARCH", { id }) : window.get_evg_func("sendAE")("GET_NEWS", {id});
          }}
          ref={ref}
      >
        <div className="newsCard__head">
          <div className="newsCard__sberLogo">
            <img src="./sber_logo.svg" alt={community}/>
          </div>
          <div className="newsCard__communityWrapper">
            <div className="newsCard__community">
              {community}
            </div>
            {repost && <div className="newsCard__repost">
              <div className="newsCard__sberLogo">
                <img src="./repost.svg" alt={community}/>
              </div>
              <div className="newsCard__repostWrapper">
                <div className="newsCard__sberLogo">
                  <img src="./sber_logo.svg" alt={parentPostCommunity}/>
                </div>
                <div className="newsCard__repostContent">
                  {parentPostCommunity}
                </div>
              </div>
            </div>}
          </div>
          <div className="newsCard__date">
            {formatDate(data, time)}
          </div>
        </div>
        <div className="newsCard__headline" dangerouslySetInnerHTML={{ __html: formattedTitle }} />
        {!(title) && voting && Object.keys(voting).length !== 0 && <Poll questions={voting?.questions} voting={voting}/>}
        {formattedВDescription && type === 'article' ?
            <div className="newsCard__description" dangerouslySetInnerHTML={{ __html: formattedВDescription }} />
              :
            <div className="newsCard__description" dangerouslySetInnerHTML={{ __html: formattedTitle }} />
        }
        {
          !Array.isArray(url) && url?.search("m3u8") >= 0 &&
          <div className="newsCard__img">
            <video style={{width: "100%", borderRadius: "20px"}} alt={title} controls id={iid} />
          </div>
        }
        {
          !Array.isArray(url) && url !== "" && url?.search("m3u8") < 0 && (
              <div className="newsCard__img">
                <img src={url} alt={title} />
              </div>
          )}
        {
          Array.isArray(url) && url[0]?.search("m3u8") >= 0 &&
          <div className="newsCard__img">
            <video style={{width: "100%", borderRadius: "20px"}} alt={title} controls id={iid}/>
          </div>
        }
        {
          Array.isArray(url) && url[0] !== "" && url[0]?.search("m3u8") < 0 && (
              <div className="newsCard__img">
                <img src={url[0]} alt={title}/>
              </div>
          )}
      </div>
  );
}

export default React.memo(NewsCard);
