import {
  Typography
} from "@material-ui/core";
import React from "react";
import AxiosInstance from '../../services/axios-instance'
import {
  Hero
} from "../../components/Hero/Hero";
import {
  TrainingCard
} from "../../components/TrainingCard/TrainingCard";
import {
  LeaderBoard
} from "../../components/LeaderBoard/LeaderBoard";
import {
  BadgesBoard
} from "../../components/BadgesBoard/BadgesBoard";
import {
  ProgressTasks
} from "../../components/ProgressTasks/ProgressTasks";
import styles from "./Home.module.scss";
import { connect } from 'react-redux'
import store from "../../store";

export class Home extends React.Component {

  
  
  constructor() {
    super()

    let user = store.getState()
    let username = user?.user?.user?.username;    

    this.state = {
      user: {a: 1},
      tasks: [],
      username: username,
      badgeCompletedCount: 0,
    }
  }

  // state = {
  // }

  sortTasks(tasks) {
    let statusesOrder = ["neverDone", "expired", "inShape"];
    return tasks.sort((a, b) => {

      let aStatusValue = statusesOrder.indexOf(a.status.status);
      let bStatusValue = statusesOrder.indexOf(b.status.status);

      if (aStatusValue !== bStatusValue) {
        return aStatusValue - bStatusValue;
      }

      return a.name - b.name
    })
  }

  componentDidMount() {
    AxiosInstance.get(`users/getTasksFeed`)
      .then(res => {
        const tasks = this.sortTasks(res.data.tasks);
        this.setState({
          tasks
        });
      })

    let username = this.state.username;

    AxiosInstance.get("users/getUserByUsername?username=" + username)
    .then(res => {
      let badgeCompletedCount = res.data.captainUpDetails.achieved_badges.length
      alert(badgeCompletedCount)
      this.setState({
        badgeCompletedCount
      });
    })
  }

  render() {
    const Cards = () => {
      return Array(this.state.tasks.length)
        .fill(null)
        .map((_, i) => (
          <li >
            <TrainingCard key={i} isManager={false} task={this.state.tasks[i]} />
          </li>
        ));
    }

    const trainings = Array(10).map((_, i) => ({
      id: `training-${i}`,
      name: `Training ${i}`,
      score: i * 10,

    }))

    return (<section className={styles.Wrapper}>
      <Hero />

      <div className={styles.Board} >
        <LeaderBoard />
        <BadgesBoard />
      </div> <ProgressTasks trainings={
        trainings
      }
      /> <      Typography variant="h5" > רוצה להציל את אוגי / ת ? </Typography> 
      <ul className={
            styles.CardList
          } > <Cards > </Cards></ul >
          </section>
    );
  }
}

const mapStateToProps = (store) => {
  return {
      user: store.user
  }
}

export default connect(mapStateToProps)(Home)