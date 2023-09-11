import {useState} from 'react';
import { IconVolumeOff, IconMicOff, IconVolumeUp, IconMic } from '@salutejs/plasma-icons';
import * as St from './styled';

const MicButton = () => {

  // useState(micVal)
  
  return <St.MicButton>
           <St.MicIcon onClick={
               () => {
                   window.get_evg_func("sendAE")("MAIN_MENU_SPEAKER_PRESS", {val: !window?.evg_mic_val});
                   window.get_evg_func("setSpeakerVal")(!window?.evg_speaker_val);
             }
           }>
             {
                 window?.evg_speaker_val ? 

                     <IconVolumeUp size="xs" color="#24B23E" />
                     :
                     <IconVolumeOff size="xs" color="#24B23E" />
             }
           </St.MicIcon>
           <St.MicIcon onClick={
             () => {
                 window.get_evg_func("sendAE")("MAIN_MENU_MIC_PRESS", {val: !window?.evg_speaker_val});
                 window.get_evg_func("setMicVal")(!window?.evg_mic_val);

             }
           }>
             {
                 window?.evg_mic_val ?
                     <IconMic size="xs" color="#24B23E" />
                     :
                     <IconMicOff size="xs" color="#24B23E" />
             }
           </St.MicIcon>
         </St.MicButton>;
};

export default MicButton;
