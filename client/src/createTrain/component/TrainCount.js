import classNames from "classnames";
import React from "react";
import styles from "./TrainCount.module.scss";

export const TrainCount = (props) => {
  const type = props.type;

  const wrapperClass = classNames({
    [styles.Content]: true,
    [styles.Standard]: !type || type === "Standard",
    [styles.Warn]: type === "Warn",
    [styles.Danger]: type === "Danger",
  });

  return (
    <div className={wrapperClass}>
      <h1 className={styles.Numbers}>{props.count}</h1>
      <h2 className={styles.Status}>{props.name}</h2>
    </div>
  );
};
