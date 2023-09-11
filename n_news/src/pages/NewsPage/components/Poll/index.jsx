import {useEffect, useState, useMemo, useCallback} from 'react';
import { Checkbox, Radiobox } from "@sberdevices/plasma-ui";
import './Poll.scss';

const Progress = ({textIns = "", value = 0, max = 1, start, end, isChecked }) => {

    const proc = useMemo(() => {
        let ret = Math.round(value / max * 100);
        if (typeof(ret) === 'number' && ret % 1 === 0 && ret >= 0 && ret <= 100)
            return ret + "%";
        return "0%";
    }, [value, max]);

    const Start = start ?? "#00ff00";
    const End = end ?? "#0000ff";
    
    return <div className="progress"
                style={{
                    background: `linear-gradient(90deg, rgba(217, 217, 217, 0.2) ${proc}, rgba(217, 217, 217, 0.1) ${proc})`
                }}>
             <div className="textIns">
               <div className="lhs">
                 {textIns}
                 <div className="value">
                   {value}
                 </div>
               </div>
               <div className="rhs">
                 {isChecked && <div className="check">
                                 ✓
                               </div>
                 }
                 {proc}
               </div>
             </div>

             
           </div>;
};

const Poll = ({questions, voting}) => {
    const [currQuest, setCurrQuest] = useState(0);
    const [totalAnswer, setTotalAnswer] = useState([]);
    const [pollFinished, setPollFinished] = useState(false);
    const [fixAnswer, setFixAnswer] = useState(true);



    useEffect(() => {
        let ret = [];
        if (!Array.isArray(questions))
            return ;
        for (let i = 0; i < questions.length; i++) {
            ret.push(questions[i]?.myChoices?.map(j => {return {id: j};}));
        }
        setTotalAnswer(ret);
    }, [questions, voting]);

    useEffect(() => {
        setFixAnswer(true);
    }, [currQuest]);


    const currAns = useMemo(() => {
        if (!Array.isArray(totalAnswer)) {
            return [];
        }
        return totalAnswer[currQuest] ?? [];
    }, [totalAnswer, currQuest]);

    const setCurrAns = (arg) => {
        if (!Array.isArray(totalAnswer)) {
            return ;
        }
        let r = JSON.parse(JSON.stringify(totalAnswer));
        r[currQuest] = arg;
        setTotalAnswer(r);
    };


    const name = useMemo(() => {
        return questions[currQuest]?.question;
    }, [currQuest, questions]);

    const data = useMemo(() => {
        return questions[currQuest]?.answerOptions;
    }, [currQuest, questions]);

    const isDead = useMemo(() => {
        if (voting?.expiringDate) {
            let k = new Date(voting.expiringDate);
            let now = new Date();
            if (now > k)
                return true;
        }
        return false;
    }, [voting]);

    const expDate = useMemo(() => {
        let out = voting?.expiringDate;
        if (!out)
            return "";
        let d =  new Date(out);
        const double_digit = (n) => {
            n = String(n);
            if (n.length === 1)
                n = "0" + n;
            return n;
        };

        const NAMEOFMONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июня', 'июля', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        
        let str = `${d.getDate()} ${NAMEOFMONTHS[d.getMonth()]} ${d.getFullYear()} в ${double_digit(d.getHours())}:${double_digit(d.getMinutes())}`;
        return str;
        
    }, [voting]);

    const isAnswer = useMemo(() => {
        if (voting?.expiringDate) {
            let k = new Date(voting.expiringDate);
            let now = new Date();
            if (now > k)
                return true;
        }
        // debugger;
        if (!fixAnswer)
            return false;
        let t = totalAnswer[currQuest];
        // debugger;
        if (totalAnswer[currQuest]?.length)
            return true;
        return false;
    }, [totalAnswer, currQuest, fixAnswer]);

    const fullData = useMemo(() => {
        if (questions[currQuest] === undefined)
            debugger;
        return questions[currQuest];
    }, [currQuest, questions]);

    const fullObj = questions;



    const valuedAnswer = (id) => {
        let ret = 0;
        let prevCount = data?.find(i => i.id === id)?.count;
        if (prevCount !== undefined)
            ret += data.find(i => i.id === id).count;
        totalAnswer[currQuest]?.map(j => ret += (j.id === id ? 1 : 0));
        return ret;
    };

    const totalCount = useMemo(() => {
        let ret = 0;
        data?.map(i => ret += i.count);
        if (totalAnswer[currQuest])
            totalAnswer[currQuest].map(i => ret++);
        return ret;
    }, [currQuest,  totalAnswer, data]);

    const tc = (a) => {
        let ret = 0;
        a.map((i) => ret += i.count);
        return ret;
    };

    const peopleVoted = useMemo(() => {
        let ret = questions[currQuest]?.votersNumber;
        if (totalAnswer[currQuest]?.length > 0) {
            ret++;
        }
        return ret;
    }, [currQuest, questions, totalAnswer]);

    const resText = useMemo(() => {
        if (typeof(peopleVoted) !== "number")
            return "";
        const res_text = (i) => {
            const conj1 = (n) => {
                if (n === 1)
                    return "проголосовал";
                return "проголосовало";
            };
            
            const conj2 = (n) => {
                if ((n % 100 >= 5 && n % 100 <= 20) ||
                    n % 10 === 1 || n % 10 === 0 || n % 10 >= 5) {
                    return "человек";
                }
                return "человека";
            };

            if (i === 0)
                return "проголосуйте первым";

            return `${conj1(i)} ${i} ${conj2(i)}`;
        };
        if (isDead && peopleVoted === 0)
            return "проголосовало 0 человек";
        return res_text(peopleVoted);
    }, [peopleVoted, isDead]);




    const clickAnswer = (e) => {
        // debugger;
        if (currAns.find(j => j.id === e.id)) {
            let r = currAns.filter(j => j.id !== e.id);
            setCurrAns(JSON.parse(JSON.stringify(r)));
            return ;
        }
        if (fullData.isMultiChoice) {
            setCurrAns(JSON.parse(JSON.stringify([...currAns, e])));
            setFixAnswer(false);
        }
        else {
            // setCurrAns(JSON.parse(JSON.stringify([e])));
            sendAnswer(e);
        }
        
    };

    const sendAnswer = (push) => {
        if (isAnswer) {
            if (currQuest !== questions.length - 1) {
                setCurrQuest(currQuest + 1);
            }
            else {
                setPollFinished(true);
            }
            // setIsAnswer(false);
            return;
        }
        if (currQuest < questions?.length && !isAnswer) {
            // if (currQuest !== questions.length - 1) {
            //     setCurrQuest(currQuest + 1);
            // }            
            setFixAnswer(true);
            // setIsAnswer(true);
        }
        else {
            setPollFinished(true);
        }
        window.get_evg_func("sendAE")("POLL_ANSWER", {
            voting: fullObj,
            qObject: fullData,
            pollID: fullData.id,
            answer: push === undefined ? currAns : [push],
        });
        if (push)
            setCurrAns(JSON.parse(JSON.stringify([push])));

    };

    const isChecked = (i) => {
        let r = currAns.find(j => j.id === i.id);
        return !!(r);
    };

    const isAnswered = useMemo(() => {
        let ret = false;
        data?.map(i => {
            if (isChecked(i))
                ret = true;
        });
        return ret;
    }, [data]);


    
    return <div className="poll">
             <div className="pollName">
               {`${name}`}
             </div>
             <div className="smallText">
               {isAnswer ? (isAnswered ? "Выбор сделан!" : "") : "Выберите правильный ответ"}
             </div>
             {
                 isDead && <div className="smallText">
                             опрос завершен {expDate}
                           </div>
             }
             <div>
               {
                   !isAnswer && data?.map((i, pos) =>
                       <div onClick={(e) => {
                           e.preventDefault();
                           e.stopPropagation();
                           clickAnswer(i);
                       }}>
                         {
                             !pollFinished || true ?
                                 <div className="ansBox">
                                   <button className="ansText" >
                                     {`${i.text}`}
                                   </button>
                                   {fullData.isMultiChoice ?
                                    <Checkbox
                                      size="xs"
                                      checked={isChecked(data[pos])}
                                      className="ansButton"
                                      onClick={(e) => {e.stopPropagation(); clickAnswer(i);}}
                                    />
                                    :
                                    <Radiobox
                                      size="xs"
                                      checked={isChecked(data[pos])}
                                      className="ansButton"
                                      onClick={(e) => {
                                          /* debugger; */
                                          e.stopPropagation();
                                          clickAnswer(i);
                                      }}
                                    />}

                                 </div>
                             :
                             <></>
                         }
                       </div>
                   )
               }
               {
                   isAnswer &&
                       <div>
                         <div className="pollRes">
                           <div>
                             {data.map((j, pos) =>
                                 <div className="ans">
                                   <Progress max={totalCount}
                                             value={valuedAnswer(j.id)}
                                             start={voting.backgroundStart} end={voting.backgroundEnd}
                                             isChecked={isChecked(data[pos])}
                                             textIns={j.text}
                                   />
                                 </div>)}
                           </div>
                         </div>
                       </div>
               }
             </div>
             
             {(currQuest !== questions.length - 1 || (fullData.isMultiChoice && currAns.length !== 0 && !isAnswer )) && 
              <button
                style={{
                    color: currAns.length === 0 && false ? "grey" : "white",
                    background: currAns.length === 0 && false ? "#3a3a3a" : ""
                }}
                className="sendButton"
                onClick={(e) => {e.stopPropagation(); sendAnswer();}}
              >
                {isAnswer || (!fullData.isMultiChoice) || (fullData.isMultiChoice && currAns?.length === 0)  ? "Далее" : "Проголосовать"}
              </button>
             }
             {
                 currQuest >= 1 &&
                     <button                       
                       className="sendButton" onClick={(e) => {
                           e.stopPropagation();
                           setCurrQuest(currQuest - 1);
                           /* setIsAnswer(false); */
                       }}>
                       Предыдущий
                     </button>
             }
             {isAnswer && !isDead && <button
       
                                                   className="sendButton"
                                                   onClick={(e) => {
                                                       e.stopPropagation();
                                                       window.get_evg_func("sendAE")("REMOVE_ANSWER", {
                                                           voting: fullObj,
                                                           qObject: fullData,
                                                           pollID: fullData.id,
                                                           answer: [],
                                                       });
                                                       setCurrAns([]);
                                                       setFixAnswer(false);
                                                       /* setIsAnswer(false); */
                                                   }}>
                                       Отменить
                                     </button>}
             {
                 (isAnswer || peopleVoted === 0) && 
                     <div className="smallText">
                       {resText}
                     </div>
             }
             {/* <button onClick={ */}
             {/*     (e) => { */}
             {/*         e.stopPropagation(); */}
             {/*     } */}
             {/* } style={{ */}
             {/*     border: "1px solid black", */}
             {/*     background: "white", */}
             {/*     padding: "10px" */}
             {/* }}> */}
             {/*   Do nothing */}
             {/* </button> */}
           </div>;

};

export default Poll;
