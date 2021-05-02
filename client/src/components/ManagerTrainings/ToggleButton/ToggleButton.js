import React from "react";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import FormatAlignJustifyIcon from "@material-ui/icons/FormatAlignJustify";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { colors, makeStyles } from "@material-ui/core";
import styles from "./ToggleButton.module.scss";

export class ToggleButtons extends React.Component {

  // constructor(props){
  //   super(props);
  // }

  handleAlignment = (event, newAlignment) => {
    // setAlignment(newAlignment);
    // const type = props.type;
    this.props.parentCallback(newAlignment);
  };

  render() {
    return (
      <div className={styles.Content}>
        <h1 style={{ fontSize: "20px" }}>{this.props.Title}</h1>
        <ToggleButtonGroup exclusive onChange={this.handleAlignment}>
          <ToggleButton value="left" >
            {this.props.Left}
          </ToggleButton>
          <ToggleButton value="right">{this.props.Right} </ToggleButton>
        </ToggleButtonGroup>
      </div>
    );
  }
}