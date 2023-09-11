import React from 'react';

import cn from 'classnames';
import { Tabs, TabItem } from "@sberdevices/plasma-ui";
import {IconDisclosureDown} from "@sberdevices/plasma-icons";
import { typography } from "@sberdevices/plasma-tokens";

import "./Switch.scss";

const Switch = ({ onClick, items = [], activeItem }) => {
  return (
    <Tabs
      id="my-tabs"
      size="s"
      stretch={true}
      pilled={true}
      style={typography.button2}
    >
      {items.map(({ id, name, web }) => (
        <TabItem
          onClick={(e) => {
            onClick(id)
            e.preventDefault();
            e.stopPropagation();
          }}
          isActive={activeItem === id}
          aria-controls="my-tabs"
          key={`tab-${id}`}
          id={`tab-${id}`}
          className={cn('switch', web && 'switch__disable')}
        >
          <div>{name}</div>
          {activeItem === id && activeItem !== 'recommendations' && (
            <IconDisclosureDown size="s" color="white" className="tabIcon" />
          )}
        </TabItem>
      ))}
    </Tabs>
  );
};

export default React.memo(Switch);
