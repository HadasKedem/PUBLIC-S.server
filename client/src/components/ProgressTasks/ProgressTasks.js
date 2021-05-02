
import React from "react";
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import styles from "./ProgressTasks.module.scss";

const useStyles = makeStyles(theme => ({

}));

export const ProgressTasks = (props) => {
  const classes = useStyles();
  return (
    <div className={styles.missionscard}>
      <h1>משימות-דרגה</h1>
      <div className={styles.Center}>
        {[
          { name: 'סיים הכשרה במהירות', status: 'מתוך 7', value: '20 נקודות', booln: false },
          { name: 'סיים הכשרה סבב', status: 'מתוך 5', value: '400 נקודות', booln: false },
          { name: 'במהירות', status: 'מתוך 3', value: '2 נקודות', booln: true }
        ].map(v =>
          <div key={v.value} className={styles.rowC}>
            <p className={styles.ProgressName}>
              {v.booln && <CheckIcon />}
              {v.name}
            </p>
            <p className={styles.status}>{v.status}</p>
            <p className={styles.ProgressValue}>{v.value}</p>
          </div>
        )}
      </div>
      <br></br><br></br>
    </div>
  );
};
