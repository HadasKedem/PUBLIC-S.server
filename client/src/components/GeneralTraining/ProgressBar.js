import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import styles from "./ProgressBar.module.scss";
import React from "react";


export class ProgressBar extends React.Component {
  
  render() {
    return (
        <div className={styles.Content}> 
        <CircularProgressbar value={this.props.Precent} text={`${this.props.Precent}%`} styles={{path:{
            stroke: 'darkblue'} , text: { fill:'darkblue'}
        }}/>
        <h3 className={styles.h3}>{this.props.Title} </h3>
        </div>
    );
  }
}
