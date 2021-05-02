import React from "react";
import { makeStyles, StylesProvider } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import styles from "./GeneralTraining.module.scss";
import ReactDOM from "react-dom";
import { TrainData } from "./TrainData.js";
import { ProgressBar } from "./ProgressBar.js";
import Button from "@material-ui/core/Button";
import { Top3 } from "./Top3";
import { Worst3 } from "./Worst3";
import axiosInstance from "../../services/axios-instance";

const useStyles = makeStyles((theme) => ({}));

export class GeneralTraining extends React.Component {

  constructor(props) {
    super();

  }
  state = {
    taskStats: [],
    numOfUsers: 1
  }

  componentDidMount() {
    axiosInstance.get('tasks/getTasksStats').then(taskStatsa => {
      let taskStats = taskStatsa.data.tasks;
      let numOfUsers = taskStatsa.data.numOfUsers;
      this.setState({ taskStats });
      this.setState({ numOfUsers });
    })
  }


  render() {
    return (
      <div className={styles.Content}>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
          {
            this.state.taskStats.map(ts => {
              return <div key={ts._id} style={{ margin: "0 10px" }}>
                <ProgressBar Precent={((ts.usersDone / this.state.numOfUsers) * 100).toString().slice(0, 3)} Title={ts.name} />
              </div>
            })
          }
        </div>
        {/* 
        <TrainData
          className={styles.TrainData}
          a={5}
          b={7}
          c={8}
          d={9}
        ></TrainData>
        <h5>ביצועי הכשרות</h5>
 */}



        {/* <br></br>
        <br></br>
        <br></br> */}

        <div className={styles.Ranks}>
          <div>
            {/* <Top3> </Top3> */}
          </div>
          <div>
            {/* <Worst3> </Worst3> */}
          </div>
        </div>
      </div>
    );
  }
}
