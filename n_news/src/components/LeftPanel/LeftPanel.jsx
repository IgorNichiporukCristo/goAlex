import "./LeftPanel.scss";
import { useState } from "react";
import MicButton from "../../MicButton";
import { ReactComponent as Summary } from "../PanelIcons/summaryLeft.svg";
import { ReactComponent as Calendar } from "../PanelIcons/calendarLeft.svg";
import { ReactComponent as UsefulServices } from "../PanelIcons/usefulServicesLeft.svg";
import { ReactComponent as News } from "../PanelIcons/newsLeft.svg";
import { ReactComponent as DoubleArrows } from "../PanelIcons/doubleArrows.svg";

const LeftPanel = ({
  position,
  micVal,
  setMicVal,
  speakerVal,
  setSpeakerVal,
  setStateButtonLeftPanel,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (name, pos) => {
    if (name === "doubleArrows"){
      setStateButtonLeftPanel((prev) => !prev)
      setIsOpen(!isOpen);
    } 

    else if (pos !== 3)
      window.get_evg_func("sendAE")("PRESS_TOP_BAR", { pos: pos });
  };

  const leftObjects = [
    {
      name: "Сводка",
      comp: <Summary />,
    },
    {
      name: "Календарь",
      comp: <Calendar />,
    },

    {
      name: "Подборка",
      comp: <UsefulServices />,
    },
    {
      name: "Новости",
      comp: <News />,
    },
    {
      name: "doubleArrows",
      comp: <DoubleArrows />,
    },
  ];

  const isActive = (pos, name) => {
    if (pos === position) return "inactive";
    if (name === "doubleArrows" && isOpen) return "inactive";
    return "";
  };

  return (
    <div className="leftPanelMain">
      <div
        className="leftPanel"
        style={{
          width: isOpen ? "140px" : "62px",
        }}
      >
        {leftObjects.map((i, pos) => (
          <button onClick={() => handleClick(i.name, pos)} className="leftItem" key={pos}>
            <div
              className={`leftIcon ${isActive(pos, i.name)}`}
              style={
                i.name === "doubleArrows"
                  ? {
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      position: "relative",
                      bottom: isOpen ? "11px" : "0px",
                    }
                  : {}
              }
            >
              {i.comp}
            </div>
            <div
              className="itemName"
              style={{
                width: isOpen ? "200px" : "0px",
              }}
            >
              <div className="itemsNameIns">
                {i.name !== "doubleArrows" && i.name}
              </div>
            </div>
          </button>
        ))}
      </div>
      <MicButton
        micVal={micVal}
        setMicVal={setMicVal}
        speakerVal={speakerVal}
        setSpeakerVal={setSpeakerVal}
      />
    </div>
  );
};

export default LeftPanel; 