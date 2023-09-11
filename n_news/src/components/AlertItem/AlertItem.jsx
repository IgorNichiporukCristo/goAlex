import React from 'react';

import { typography } from "@sberdevices/plasma-tokens";

import "./Alert.css";

const AlertItem = (props) => {
  return (
    <div className="alertItem">
      <div className="img">
        <img src="./err.svg" alt="none" />
      </div>
      <div style={typography.headline3} className="altxt upper">
        {props.upperText}
      </div>
      <div style={typography.footnote1} className="altxt lower">
        {props.lowerText}
      </div>
    </div>
  );
}

export default React.memo(AlertItem);
