import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { TrainingCard } from "../../components/TrainingCard/TrainingCard";
import styles from "./ManagerSideTasks.module.scss";

import AxiosInstance from '../../services/axios-instance'

export class ManagerSideTasks extends React.Component {
  state = {
    tasks: []
  }

  componentDidMount() {
    AxiosInstance.get(`tasks/getAll`)
      .then(res => {
        const tasks = res.data.tasks;
        this.setState({ tasks });
      })
  }

  render() {
    const TaskListItem = (props) => {
      // alert(props.task.name)
      if (props.task.name) {
        return (<li>
          <TrainingCard isManager={true} task={props.task} />
        </li>)
      } else {
        return (<div></div>)
      }
    }

    const Cards = () => {
      return Array(this.state.tasks.length)
        .fill(null)
        .map((_, i) => (
          <TaskListItem key={i} task={this.state.tasks[i]}></TaskListItem>
        ));
    }

    return (<div>
      <hr></hr>
      <ul className={styles.CardList}><Cards></Cards></ul>
    </div>)
  }
}
