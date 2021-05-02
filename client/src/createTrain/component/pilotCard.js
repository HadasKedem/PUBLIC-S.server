
import styles from "./pilotCard.module.scss";
import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { Button, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import { TrainCount } from "./TrainCount";
import { Divider } from "@material-ui/core"

export const PilotCard = (props) => {

  return (
    <Card className={styles.Card}>
      <div className={styles.Right}>
        <img className={styles.Image} src="https://picsum.photos/100" alt="" />
        <h1 className={styles.Title}>{props.pilot.name}</h1>
      </div>
      <div className={styles.Left}>
        <TrainCount count={props.pilot.a} name={"פגו"} />
        <Divider orientation="vertical" flexItem style={{ height: "40px", margin: "auto 0" }} />
        <TrainCount count={props.pilot.b} type="Danger" name={"בקרוב פג"} />
        <Divider orientation="vertical" flexItem style={{ height: "40px", margin: "auto 0" }} />
        <TrainCount count={props.pilot.c} type="Warn" name={"הכשרות בתוקף"} />
      </div>
    </Card>
  );
};
