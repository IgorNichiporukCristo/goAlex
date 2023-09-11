import { IconVolumeOff, IconMicOff, IconVolumeUp, IconMic } from '@salutejs/plasma-icons';


import * as St from './styled';

export const TopButtons = () => {
  return (
    <St.VoiceControlButtons>
      <St.HeaderControl
        onClick={
          () => {
            window.get_evg_func("sendAE")("MAIN_MENU_MIC_PRESS", {val: !window?.evg_mic_val});
            window.get_evg_func("setMicVal")(!window?.evg_mic_val);
          }
        }            
      >
        {
          window?.evg_mic_val ? 
            <img src="./assets/icons/funky_mic_on.svg"/>
            :
            <img src="./assets/icons/funky_mic_off.svg"/>
        }
      </St.HeaderControl>
      <St.HeaderControl onClick={
        () => {
          window.get_evg_func("sendAE")("MAIN_MENU_SPEAKER_PRESS", {val: !window?.evg_speaker_val});
          window.get_evg_func("setSpeakerVal")(!window?.evg_speaker_val);
        }} >
        {
          window?.evg_speaker_val ?
            <img src="./assets/icons/funky_speaker_on.svg"/>
            :
            <img src="./assets/icons/funky_speaker_off.svg"/>
        }
      </St.HeaderControl>
      
    </St.VoiceControlButtons>
  );
};
