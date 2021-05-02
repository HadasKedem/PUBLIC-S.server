import { Button, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import React from "react";
import styles from "./TrainingCard.module.scss";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import PanToolIcon from '@material-ui/icons/PanTool';
import axiosInstance from "../../services/axios-instance";
import PanToolOutlinedIcon from '@material-ui/icons/PanToolOutlined';

function Actions(props) {
  if (props.isManager) {
    return <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      {
        !props.task.isActive ? <span style={{ color: "red", fontWeight: "700", marginLeft: "11px" }}>הכשרה מבוטלת</span> : ''
      }
      {/* <Button onClick={() => deleteTask()} size="small" variant="outlined" className={styles.Rounds}>
        <DeleteIcon style={{ height: "20px", color: '#545454' }} ></DeleteIcon>
      </Button> */}
      {/* <Button  size="small" variant="outlined" className={styles.Rounds}> */}
      <PanToolOutlinedIcon onClick={() => stopTask(props)} style={{ height: "20px", color: props.task.isActive ? '#545454' : 'red', cursor: "pointer" }} />
      {/* </Button> */}
      {/* <Button onClick={(event) => (window.location.href = "/Task?id=" + props.task._id)} size="small" variant="outlined" className={styles.Rounds}>
        <EditIcon style={{ height: "20px", color: '#545454' }} />
      </Button> */}
    </div>
  } else {
    if (["expired", "neverDone"].includes(props.status.status)) {
      return <Button onClick={(event) => (window.location.href = "/Task?id=" + props.task._id)} variant="outlined" variant="outlined"
        style={{ color: "darkblue", borderColor: "darkblue", fontWeight: 700, fontSize: "13px", padding: "1px 4px" }}>
        תכשיר אותי
      </Button>
    } else {
      return (
        <div className={styles.TaskDetails} >
          <span>
            <span>בוצע</span>
            <span style={{ cursor: "pointer" }} onClick={(event) => (window.location.href = "/Task?id=" + props.task._id)}>&nbsp;|&nbsp;לצפייה</span>
          </span>
          <span style={{ color: "gray", fontSize: '12px', marginTop: '4px' }}>
            תוקף&nbsp;
          {getValidForDate(props.status.goodForDays)}
          </span>
        </div>
      )
    }
  }

}

function stopTask(props) {
  axiosInstance.post("tasks/toggleTaskActiveness?_id=" + props.task._id).then(r => {
    // TODO
  })
}

function deleteTask() {
  // TODO!
}

function getValidForDate(goodFor) {
  let d = new Date();
  d.setDate(d.getDate() + goodFor);
  return d.getDate() + '.' + (d.getMonth() + 1) + '.' + d.getFullYear().toString().slice(2, 4)
}

function Points(props) {
  if (props.isManager || !["expired", "neverDone"].includes(props.status.status))
    return <div></div>
  else return <Typography className={styles.Points}>{props.task.points} נקודות</Typography>
}

export const TrainingCard = (props) => {

  let { status } = props.task;
  let task = props.task.task || props.task;
  // alert(JSON.stringify(props.task,null,2))
  return (
    <Card className={styles.Card}>
      <img className={styles.Image} src="https://picsum.photos/150" alt="" />
      <div className={styles.Content}>
        <h1 className={styles.Title}>{task && task.name}</h1>
        <div className={styles.Left}>

          {status && status.status === "expired" ? <span className={styles.Expired}>פג תוקף</span> : ''}
          <Actions isManager={props.isManager} status={status} task={task}></Actions>
          <Points isManager={props.isManager} task={task} status={status}></Points>

        </div>
      </div>
    </Card>
  );
};
