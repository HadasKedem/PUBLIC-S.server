import { Typography } from "@material-ui/core";
import React from "react";
import styles from "./Hero.module.scss";
import batIcon from "../../batIcon.svg";

export const Hero = () => {
  return (
    <div className={styles.Hero}>
      <Typography variant="h3" component="h1" className={styles.Title}>
        היי, אני אוגי/ת
      </Typography>
      <img
        className={styles.Logo}
        src={batIcon}
        alt="Oggy Logo"
      />
      <Typography component="p" align="center">
        <span style={{ fontWeight: 600 }}>
          רוצה לשמור על הכשירות שלי?
        </span>
        <br />
        בואו נסיים את ההכשרות בהקדם האפשרי
      </Typography>
    </div>
  );
};
