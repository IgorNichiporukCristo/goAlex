import React, {useState, useCallback, useEffect, useMemo, useRef} from "react";
import { IconChevronLeft, IconHeartStroke, IconHeart } from "@sberdevices/plasma-icons";
import normalizeContent from 'src/assets/scripts/normalizeContent';

import Hls from 'hls.js';

import NewsComments from "./components/NewsComments";
import Carousel from "../../components/Carousel";
import Search from "../../components/Search";

import { formatDate } from "../utils";

import "./NewsPage.scss";
import cn from "classnames";
import Popper from "../../components/Popper/Popper";
import SearchResultWeb from "../../components/SearchResultWeb/SearchResultWeb";
import useDebounce from "../../assets/hooks/useDebounce";
import ift_data from './obj.js';

import NewParser from './components/NewParser';
import Poll from './components/Poll';


const rand_string = () => {
    const alpha = "qwertyuiopasdfghjklzxcvbnm1234567890";
    let ret = "";
    for (let i = 0; i < 5; i++) {
        ret += alpha[Math.round(Math.random() * alpha.length)];
    }
    return ret;
};

const MediaThing = ({url}) => {
    const iid = useMemo(() => rand_string(), []);

    useEffect(() => {
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

    if(url.length === 0) return null;


    if (url?.indexOf('m3u8') > 0 || url?.indexOf('mp4') > 0)
        return <div className="newsPage__mainImg">
                 <video className="video_thing" id={iid} controls>
                   {/* <source src="./cats.mp4"/> */}
                 </video>
               </div>;

    return <div className="newsPage__mainImg">
             <img src={url}/>
           </div>;
    
};

const NewsPage = ({
    data,
    shownComments,
    onClickComments,
    voiceComment,
    clearVoiceComment,
    newCommentId,
    newSearchValue,
    searchData
}) => {
    // const data = ift_data.newsData;
    
    const [isSpeak, setIsSpeak] = useState(false);
    const [isLiked, setIsLiked] = useState(!!data?.isLiked);
    const [likesCount, setLikesCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(data?.comments ?? 0);
    const [formattedText, setFormattedText] = useState("");
    const [formattedTitle, setFormattedTitle] = useState("");
    const [images, setImages] = useState([]);
    const [searchValue, setSearchValue] = useState(newSearchValue);
    const [searchRef, setSearchRef] = useState(null);
    const debounceSearch = useDebounce(1000);

    useEffect(() => {
        // debugger;
    }, []);


    useEffect(() => {
        let elem = document.getElementById("root");
        // debugger;
        // let k = 
        elem.style.scrollBehavior = "auto";
        document.getElementById("root").scrollTo({
            top: 0,
        });
        if(data?.clickPlay) {
            window.get_evg_func("sendAE")("PRESS_SOUND_ON", {});
            setTimeout( () => setIsSpeak(false), 1000);
        }
    }, []);

    useEffect(() => {
        if(data?.title) {
            setFormattedTitle(normalizeContent(data?.title));
        }
    }, [data?.title]);

    useEffect(() => {
        setFormattedText(data?.type === 'article' ?
                         normalizeContent(data?.full_description).join("<br /><br />")
                         :
                         normalizeContent(data?.title + '\n\n' + data?.full_description).join("<br /><br />")
                        );
    }, [data?.full_description]);

    useEffect(() => {
        setLikesCount(data?.likes);
        setImages(Array.isArray(data?.url) ? data.url.concat(data?.urlList) : [data?.url, ...data?.urlList].filter((item, pos) => {
            return Array.isArray(data?.url) ? data.url.concat(data?.urlList) : [data?.url, ...data?.urlList].indexOf(item) === pos;
        }));
    }, [data]);

    const onToggleSound = useCallback(() => {
        if (isSpeak) {
            window.get_evg_func("sendAE")("PRESS_SOUND_OFF", {});
            setIsSpeak(false);
        } else {
            window.get_evg_func("sendAE")("PRESS_SOUND_ON", {});
            setIsSpeak(true);
            setTimeout( () => setIsSpeak(false), 1000);
        }
    }, [isSpeak]);

    const onToggleLike = useCallback(() => {
        if (isLiked) {
            window.get_evg_func("sendAE")("REMOVE_LIKE", {});
            setIsLiked(false);
            setLikesCount(likesCount > 0 ? likesCount - 1 : 0);
        } else {
            window.get_evg_func("sendAE")("LIKE", {});
            setIsLiked(true);
            setLikesCount(likesCount + 1);
        }
    }, [isLiked, likesCount]);

    const onHandlerLinkClick = useCallback((e) => {
        let linkUrl = e.target.getAttribute('key');
        if (linkUrl) {
            window.get_evg_func("sendAE")("LINK_CLICK", { linkUrl });
        }
    }, []);

    const onHandlerSearchChange = useCallback( (newValue) => {
        setSearchValue(newValue);
    }, []);

    const onHandlerSend = useCallback(() => {
        window.get_evg_func("sendAE")("SEARCH", {search: searchValue, platforms: "WEB"});
    }, [searchValue]);

    return (
        <div className="newsPage">
          <Search
            className='newsPage__search'
            value={searchValue}
            onChange={onHandlerSearchChange}
            onSend={onHandlerSend}
            setPopperElement={setSearchRef}
          />
          {searchValue.length > 0 && <Popper autoMaxWidth targetRef={searchRef}>
                               <SearchResultWeb
                                 searchData={searchData}
                               />
                             </Popper>}
          <div className="newsPage__head">
            <div className="newsPage__headLeft" onClick={() => {window.get_evg_func("sendAE")("GO_BACK_ONE_NEWS", {});}}>
              <div className="newsPage__chev">
                <IconChevronLeft size="s" color="white" />
              </div>
              <div className='newsPage__headContent'>
                <div className='newsPage__headTitle'dangerouslySetInnerHTML={{ __html: formattedTitle }} />
                <div className="newsPage__repost">
                  <div className="newsPage__repostImage">
                    <img src="./sber_logo.svg" alt={data?.community} />
                  </div>
                  <div className="newsPage__community">
                    {data?.community}
                  </div>
                  {data?.repost && <div className="newsPage__repostPostCommunityWrapper">
                                    <div className="newsPage__repostImage">
                                      <img src="./repost.svg" alt="repost" />
                                    </div>
                                    <div className="newsPage__repostImage">
                                      <img src="./sber_logo.svg" alt={data?.parentPostCommunity} />
                                    </div>
                                    <div className="newsCard__repostContent">
                                      {data?.parentPostCommunity}
                                    </div>
                                  </div>}
                  <div className="newsPage__date">{formatDate(data?.data, data?.time)}</div>
                </div>
              </div>
            </div>
          </div>
          {!data?.articleContent && images.length > 0 && <Carousel
                                                                                     length={images.length}
                                                                                     withArrows
                                                                                     className="newsPage__carusel"
                                                                            >
                                                                              {images.map((i) => {
                                                                                  return (
                                                                                      <MediaThing url={i}/>
                                                                                  )
                                                                              })}
                                                                            </Carousel>}
          {data?.type === 'article' && <div className="newsPage__title" onClick={onHandlerLinkClick} dangerouslySetInnerHTML={{ __html: formattedTitle }} />}
          {
              (data?.articleContent ) ?
                  <div className="newsPage__mainTxt">
                    <NewParser
                      description={data?.description}
                      headImg={data?.url[0]}
                      articleContent={data?.articleContent}
                      media={data?.media}
                      urlLink={data?.urlList}
                      voting={data?.voting}
                      onClick={onHandlerLinkClick}
                    />
                  </div>
                  :               
                  <div
                    className="newsPage__mainTxt"
                    onClick={onHandlerLinkClick}
                    dangerouslySetInnerHTML={{ __html: formattedText }}
                  />
          }
          
          {
          
              Object?.keys(data?.articleContent)?.length === 0
                  && data?.voting &&
                  Object.keys(data?.voting).length !== 0 &&
                  <Poll questions={data?.voting?.questions} voting={data?.voting}/>
          }
          <div className="newsPage__under">
            <div className="newsPage__lhs">
              <div className="newsPage__speaker" id="pressSound" onClick={onToggleSound}>
                <div className="newsPage__speakerImage">
                  <img
                    className="newsPage__svg newsPage__svg_speaker"
                    src={isSpeak ? "./speaker_on.svg" : "./speaker_off.svg"}
                    alt="none"
                  />
                  <img
                    className="newsPage__svg newsPage__svg_play"
                    src="./play.svg"
                    alt="none"
                  />
                </div>
                <div className="newsPage__speakerTitle">Воспроизвести</div>
              </div>
              <div className="newsPage__under_item" id="pressLike" onClick={onToggleLike}>
                <div className="newsPage__txt">{likesCount}</div>
                <img
                  src={isLiked ? "./heart_en.svg" : "./heart_dis.svg"}
                  alt="heart"
                />
                {/*{isLiked ? <IconHeart /> : <IconHeartStroke />}*/}
              </div>
              <div
                className="newsPage__under_item"
                id="pressComment"
                onClick={onClickComments}
              >
                <div className="newsPage__txt">{commentsCount}</div>
                <img className='newsPage__commentsImg' src="./comment.svg" alt="comment" />
              </div>
              <div className="newsPage__under_item newsPage__under_item_views">
                <div className="newsPage__txt_l">{data?.view}</div>
                <img src="./eye.svg" alt="eye" />
              </div>
            </div>
          </div>
          
          {shownComments && (
              <NewsComments
                comments={data?.commentsList}
                increaseCommentsCount={() => setCommentsCount(commentsCount + 1)}
                voiceComment={voiceComment}
                clearVoiceComment={clearVoiceComment}
                userData={data?.userData}
                newCommentId={newCommentId}
              />
          )}
          
        </div>
    );
};

export default React.memo(NewsPage);
