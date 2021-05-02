
import React from "react";
import { makeStyles, StylesProvider } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { PilotCard } from "../../createTrain/component/pilotCard";
import styles from "./ManagerTrainings.module.scss";
import { Style } from "@material-ui/icons";
import AxiosInstance from '../../services/axios-instance'
import { ToggleButtons } from "./ToggleButton/ToggleButton";

export class ManagerTrainings extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pilots: [],
      sort: "",
    };
  }

  state = {
    pilots: [],
    sort: "",
  }

  componentDidMount() {
    AxiosInstance.get(`users/getUsersProps`)
      .then(res => {
        let pilots = res.data;


        // alert(JSON.stringify(pilots[3].tasks[3],null,2))

        pilots.forEach(pilot => {
          pilot["name"] = pilot.username

          let countCompleted = 0
          let neverDoneCount = 0

          pilot.tasks.forEach(task => {
            if (task.status.recentlyCompleted) {
              countCompleted++;
            } else {
              neverDoneCount++;
            }
          });

          pilot["a"] = countCompleted
          pilot["b"] = neverDoneCount
          pilot["c"] = "?"
        });

        this.setState({ pilots });
      })
  }

  callbackFunction = (childData) => {
    this.setState({ sort: childData });

  }

  render() {
    // const getSortedPilots = function () {

    // }

    const getSortedPilots = () => {
      let sortedPilots = this.state.pilots

      if (this.state.sort === "left") {
        sortedPilots.sort((a, b) => b.a - a.a);
      } else if (this.state.sort === "right") {
        sortedPilots.sort((a, b) => b.b - a.b);
      }

      return sortedPilots
    }

    const Cards = () => {
      return getSortedPilots()
        .map((p, i) => (
          <li key={i}>
            <PilotCard pilot={p} />
          </li>
        ));
    }

    return (
      <div >
        <div className={styles.Toggels}>
          <ToggleButtons Title={"הכשרות"} Left={"סדר עולה"} Right={"סדר יורד"} parentCallback={this.callbackFunction}></ToggleButtons>
          <ToggleButtons Title={"תאריך"} Left={"סדר עולה"} Right={"סדר יורד"} parentCallback={this.callbackFunction}></ToggleButtons>
        </div>
        <ul className={styles.CardList}><Cards></Cards></ul>
      </div>
    );
  }
}


// const pilots = [
//   {name: "גליה", a: 1 , b:2 , c:3},
//   {name: "גילי", a: 1 , b:2 , c:3},
//   {name: "אמיתי", a: 1 , b:2 , c:36},
//   {name: "עומר", a: 1 , b:2 , c:53},
//   {name: "טל", a: 1 , b:2 , c:23},
//   {name: "דור", a: 1 , b:2 , c:31}
// ];



// export const ManagerTrainings = () => {
//   const cards = getSortedPilots()
//     .map((p, i) => (
//       <li key={i}>
//         <PilotCard pilot={p} />
//       </li>
//     ));
//   return (
//     <div>
//       <div className={styles.Toggels}>
//         <ToggleButtons Title={"הכשרות"} Left={"סדר עולה"} Right={"סדר יורד"}/>
//         <ToggleButtons Title={"תאריך"} Left={"סדר עולה"} Right={"סדר יורד"}></ToggleButtons>
//       </div>
//       <ul className={styles.CardList}>{cards}</ul>
//     </div>
//   );
// };
