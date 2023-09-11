import {useEffect} from 'react';
import Poll from '../Poll';
import normalizeContent from '../../../../assets/scripts/normalizeContent.jsx';
import {MediaThing} from '../../../../components/MediaThing';

import './NewParser.scss';


const NewParser = ({articleContent, media, urlLink, voting, onClick, description, headImg}) => {

    // useEffect(() => {
    //     let j  =!voting &&
    //         Object.keys(voting).length !== 0 ;
    //     // debugger;
            
    // }, []);

    const getImgById = (id) => {
        let ret = '';
        try {
            ret = media?.find(i => i.id == id);
            if (ret) {
                ret = media.indexOf(ret);
                ret = urlLink[ret];
            }
        }
        catch(e) {
            ret = 'oopsies.png';
        }
        if (typeof(ret) !== 'string')
            ret = '';
        return ret;
    };
    
    return (
        <div className='newParser' onClick={onClick}>
          {
              description &&
              <div
                dangerouslySetInnerHTML={{ __html: normalizeContent(description) }}>
              </div>
          }
          {
              headImg && <div className="articleImg">
                               <img  src={headImg}/>
                               {/* <div className="imgCaption"> */}
                               {/*   {i.caption} */}
                               {/* </div> */}
                             </div>
          }
          {
              articleContent?.entities?.map((i, pos) => {
                  /* debugger; */
                  if (i?.type === "quote") {
                      return <div
                               className="newsPage__quote"
                             >
                               {i.text}
                             </div>;
                  }
                  else if (i?.type === "text") {
                      return <div
                               dangerouslySetInnerHTML={{ __html: normalizeContent(i.textMobile) }}>
                             </div>;
                  }
                  else if (i?.type === "divider") {
                      return <div className="divider">
                               * * *
                             </div>
                  }
                  else if (i?.type === "image") {
                      return <div className="articleImg">
                               <img  src={getImgById(i?.id)}/>
                               <div className="imgCaption">
                                 {i.caption}
                               </div>
                             </div>;
                  }
                  else if (i?.type === "video") {
                      /* return <div>{getImgById(i?.id)}</div>; */
                      return <div className="video">
                               <MediaThing url={getImgById(i?.id)}/>
                             </div>;
                  }
                  else if (i?.type === "poll") {                      
                      return (voting &&
                          Object.keys(voting).length !== 0 &&
                          <Poll questions={voting?.questions} voting={voting}/>);
                  }
                  return <></>;
              })
          }
        </div>
    );
}

export default NewParser;
