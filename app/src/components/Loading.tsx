import React from "react";

import styles from "./Loading.scss";

const Loading: React.FunctionComponent = function(props) {
  const text = React.useRef("Loading");
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <i></i><i></i><i></i><i></i>
      </div>
      <div className={styles.text}>
        {text.current.split("").map((el, i) => {
          return (
            <span key={i} style={{ animationDelay: `${0.2 * i}s` }}>{el}</span>
          );
        })}
      </div>
    </div>
  );
};

export default Loading;
