import React from 'react';
// import {sendAE} from '../utils.jsx';
import { Tabs, TabItem } from '@salutejs/plasma-ui';
import cn from 'classnames';
import ArrowLeft from 'src/arroyLeft.svg'

import './CanvasTabs.scss';

export const CANVAS_APPS = [
  {
    id: 'PressSummaryTopbar',
    name: 'Сводка',
    icon: './pie.svg',
  },
  {
    id: 'calendar',
    name: 'Календарь',
    icon: './calendar.svg',
  },
  {
    id: 'PressSelectionTopbar',
    name: 'Подборка',
    icon: './cube.svg',
  },
  {
    id: 'PressNewsTopbar',
    name: 'Новости',
    icon: './megafon.svg',
  },
];

const CanvasTabs = ({ activeIndex, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  if(window.screen.availWidth < 1366) {
    return (
        <Tabs
            className={cn('canvasTabs__tabs', className)}
            stretch
            animated
            pilled
            index={activeIndex}
            view="secondary"
            size="s"
        >
          {CANVAS_APPS.map((el, i) => (
              <TabItem
                  onClick={() => window.get_evg_func("sendAE")("PRESS_TOP_BAR", {pos: i})}
                  key={el.id}
                  pilled={false}
                  className={cn('canvasTabs__tab', el.disabled && 'canvasTabs__tab_disabled', i === activeIndex && 'canvasTabs__tab_current')}
              >
                {el.name}
              </TabItem>
          ))}
        </Tabs>
    );
  }
  return(
      <div className={cn("canvasTabs__iconsWrapper", isOpen && "canvasTabs__iconsWrapper_active")}>
          {CANVAS_APPS.map((el, i) => (
              <button className="canvasTabs__iconWrapper" onClick={() => window.get_evg_func("sendAE")("PRESS_TOP_BAR", {pos: i})}>
                  <div className="canvasTabs__icon">
                      <img src={el.icon} />
                  </div>
                  <div className={cn("canvasTabs__iconText", "canvasTabs__iconText_active")}>{el.name}</div>
              </button>
          ))}
          <button onClick={() => setIsOpen(!isOpen)} className={cn("canvasTabs__icon", isOpen && "canvasTabs__icon_arroyActive")}>
              <img src='./arroy.svg' />
          </button>
      </div>
  )
};

export default React.memo(CanvasTabs);
