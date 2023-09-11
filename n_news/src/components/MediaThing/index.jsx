import {useMemo, useEffect, useRef} from 'react';
import Hls from 'hls.js';

export const MediaThing = ({url}) => {
    const ref = useRef(null);

    useEffect(() => {
        var video = ref.current;

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
                 <video className="video_thing" ref={ref} src={url} controls>
                   {/* <source src="./cats.mp4"/> */}
                 </video>
               </div>;

    return <div className="newsPage__mainImg">
             <img src={url}/>
           </div>;
    
};
