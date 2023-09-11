import React, { useState, useCallback, useEffect, useRef } from 'react';

import "./Skills.scss";
import { IconDisclosureLeft, IconDisclosureRight } from '@salutejs/plasma-icons';

const pics_arr = [
  "antitela.svg",
  "chto_ymeesh.svg",
  "effectivnost.svg",
  "goroskop.svg",
  "help.svg",
  "hotel.svg",
  "kalkulator.svg",
  "komandirovka.svg",
  "konsultacija.svg",
  "lideri.svg",
  "minuta_otdixa.svg",
  "moi_vstrechi.svg",
  "moi_zadachi.svg",
  "news.svg",
  "pcr.svg",
  "pogoda.svg",
  "poisk_kolleg.svg",
  "pozdravlenia.svg",
  "primi_vizov.svg",
  "prodagi.svg",
  "sbor_komandi.svg",
  "siri.svg",
  "sozdanie_zadach.svg",
  "spravochnik.svg",
  "statistika_covid.svg",
  "vakcinacija.svg",
  "vremia_puti.svg",
  "ychetka.svg",
  "ydalenka.svg",
  "1.svg",
  "2.svg",
  "3.svg",
  "4.svg",
  "5.svg",
  "6.svg",
  "7.svg",
  "8.svg",
  "9.svg",
  "10.svg",
  "11.svg",
  "12.svg",
  "13.svg",
  "14.svg",
  "15.svg",
  "16.svg",
  "19.svg",
  "20.svg",
  "21.svg",
  "22.svg",
  "23.svg",
  "24.svg",
  "25.svg",
];


const Skills = ({ skills, skillsNumber }) => {
  return (
    <>
      {skills?.map((i, pos) => {
        // TODO Починят бек убрать условие
        if(i.title) return (
          <div
              className={`skill ${pos % skillsNumber === 0 ? 'skill_scrollPoint' : ''}`}
              key={pos}
              onClick={() => {
                window.get_evg_func("sendAE")("SKILL_PRESS", { id: i.id });
              }}
          >
            {i.icon && (
                <div className="skill__iconWrapper">
                  <img src={i.icon && "./skills/" + i.icon} alt={i.title} />
                </div>
            )}
            <div className="skill__text">{i.title}</div>
          </div>
      )
      return null
      })}
    </>
  );
};

export default React.memo(Skills);
