import React from "react";
import { makeStyles, StylesProvider } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import styles from "./TrainData.module.scss";
import ReactDOM from "react-dom";

const useStyles = makeStyles((theme) => ({}));

export class TrainData extends React.Component {
  render() {
    return (
      <div>
        <div className={styles.Papers}>
          <Paper className={styles.Paper}>
            <h4> {this.props.a}</h4>
            <h6>הכשרות</h6>
          </Paper>

          <Paper className={styles.Paper}>
            <h4> {this.props.d}</h4>
            <h6>הכשרות שיפוגו תוקף</h6>
          </Paper>

          <Paper className={styles.Paper}>
            <h4> {this.props.b}</h4>
            <h6>הכשרות שפגו תוקף</h6>
          </Paper>

          <Paper className={styles.Paper}>
            <h4> {this.props.c}</h4>
            <h6>עדכון שבועי</h6>
          </Paper>
        </div>
      </div>
    );
  }
}
