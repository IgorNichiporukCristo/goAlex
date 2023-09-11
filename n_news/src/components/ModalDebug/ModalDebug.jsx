import React, { useState } from 'react';

const ModalDebug = (props) => {
  const [mode, setMode] = useState("input");
  let dst = {
    width: "95%",
    marginTop: "30px",
  };

  let btn_style = {
    position: "fixed",
    top: "4em",
  };

  let btns = (
    <div style={btn_style}>
      <button
        style={{ padding: "15px", margin: "5px" }}
        onClick={() => setMode("data")}
      >
        Data
      </button>
      <button
        style={{ padding: "15px", margin: "5px" }}
        onClick={() => setMode("input")}
      >
        Input
      </button>
    </div>
  );

  if (props.inner === undefined) btns = <></>;

  let ret = <></>;
  if (mode === "input") {
    ret = (
      <div style={dst} className="debugField">
        {props.data.map((item) => (
          <div className="debugRow" key={`debugRow${item.date}`}>
            <div style={{ color: "grey" }} className="first">
              {item.date}
            </div>
            <div style={{ color: "white" }} className="second">
              {item.val}
            </div>
          </div>
        ))}
        <div style={{ height: "200px" }} />
      </div>
    );
  } else if (mode === "data") {
    let out = JSON.stringify(props.inner);
    out = out.replaceAll(",", ", ");
    ret = (
      <div style={dst} className="debugField">
        {out}
      </div>
    );
  }

  return (
    <>
      {ret}
      {btns}
    </>
  );
};

export default React.memo(ModalDebug);
