import React from 'react';

import { Tabs, TabItem } from '@salutejs/plasma-ui';
import cn from 'classnames';

import styles from './CanvasTabs.module.scss';

function sendAE(act, stf) {
    console.log("SEND EVENT " + act + " with parameters");
    console.log(stf);
    window.evg_assistant.sendData({
	action: { action_id: act, parameters: stf },
    });
}

export const CANVAS_APPS = [
  {
    id: 'PressSummaryTopbar',
    name: 'Сводка',
  },
  {
    id: 'calendar',
    name: 'Календарь',
  },
  {
    id: 'PressSelectionTopbar',
    name: 'Подборка',
  },
  {
    id: 'PressNewsTopbar',
    name: 'Новости',
  },
];

const CanvasTabs = ({ onChange, activeIndex, className, spinnerSet }) => {
  return (
    <Tabs
      className={cn(styles.canvasTabs__tabs, className)}
      stretch
      animated
      pilled
      index={activeIndex}
      view="secondary"
      size="s"
    >
      {CANVAS_APPS.map((el, i) => (
        <TabItem
          onClick={() => {
            sendAE("PRESS_TOP_BAR", {pos: i});
            // spinnerSet();
          }
          }
          key={el.id}
          pilled={false}
          className={cn(styles.canvasTabs__tab, {
            [styles.canvasTabs__tab_disabled]: el.disabled,
            [styles.canvasTabs__tab_current]: i === activeIndex,
          })}
        >
          {el.name}
        </TabItem>
      ))}
    </Tabs>
  );
};

export default React.memo(CanvasTabs);
