import React, { useEffect } from 'react';
import { typography } from "@sberdevices/plasma-tokens";
import { usePopper } from 'react-popper';

import useClickOutside from 'src/assets/hooks/useClickOutside';

import "./FilteringPopup.scss";

const FilteringPopup = ({ isOpen, onClose, list = [], onClickListItem, activeItem, targetRef }) => {
  const [popperElement, setPopperElement] = React.useState(null);

  useClickOutside(onClose, popperElement);

  useEffect(() => {
    if (isOpen) {
      document.getElementById("root").style.overflow = "hidden";
    } else {
      document.getElementById("root").style.overflow = "auto";
    }
  }, [isOpen]);

  const { styles, attributes } = usePopper(targetRef, popperElement, {
    placement: 'bottom',
    modifiers: [
      {
        name: 'offset',
        options: {
          offset: [0, 8],
        },
      },
    ],
  });

  return (
    <div ref={setPopperElement} className={`filteringPopup ${isOpen ? 'filteringPopup_isOpen' : ''}`} style={styles.popper} {...attributes.popper}>
      <div className={`filteringPopup__list ${isOpen ? 'filteringPopup__list_show' : ''}`}>
        {list.map(({ id, name }) => (
          <div
            id={`popupListItem${id}`}
            key={`popupListItem${id}`}
            className={`filteringPopup__listItem${activeItem === id ? ' filteringPopup__listItem_active' : ''}`}
            style={typography.body1}
            onClick={() => onClickListItem(id)}
          >
            <span>{name}</span>
          </div>
        ))}
      </div>
      <div className="filteringPopup__overlay" onClick={onClose} />
    </div>
  );
};

export default React.memo(FilteringPopup);
