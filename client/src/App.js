import { Container } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import clsx from "clsx";
import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import styles from "./App.module.scss";
import { Routes } from "./components/Routes";
import { authService } from "./services/authService";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AxiosInstance from '../src/services/axios-instance'
import store from "./store";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

const UserDetails = (props) => {
  const NavDetails = props.type === "NavDetails" ? "NavDetails" : "";
  const MainDetails = props.type === "MainDetails" ? "MainDetails" : "";
  const [points, setPoints] = useState('0');

  if (props.user) {

    AxiosInstance.get("users/getUserByUsername?username=" + props.user.username)
      .then(res => {
        let points = res.data.captainUpDetails.currencies.points
        setPoints(points)
    })

    return (
      <span className={`UserDetails ${NavDetails} ${MainDetails}`}>
        <div
          style={{
            display: "flex",
            fontWeight: "600",
            flexDirection: "column",
          }}
          onClick={(event) => (window.location.href = "/")}
        >
          <span className="UserName">{props.user.name}</span>
          {NavDetails.length ? (
            <span className="NavUserDetails">
              <span className="UserPoints">
                מצב נקודות עדכני {props.user.score}
              </span>
              <span className="UserRank">דרגה: {props.user.level}</span>
            </span>
          ) : (
            <span className="UserPoints">{points} נקודות </span>
          )}
        </div>
        <img src="https://picsum.photos/35" />
      </span>
    );
  }
  return null;
};

function App() {
  const classes = useStyles();
  const [state, setState] = useState({ left: false })
  let user = useSelector((state) => state.user.user);

  const mapStateToProps = state => ({
    counter: state.counter
  });

  // alert(JSON.stringify(user,null,2))

  
  

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      style={{ background: "#292929", height: "100%", color: "#f2f2f2" }}
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      {user && <UserDetails type={"NavDetails"} />}

      <Divider />
      <List>

        <ListItem
          button
          onClick={(event) => (window.location.href = "/howToWin")}
        >
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"איך מנצחים"} />
        </ListItem>

        <ListItem
          button
          onClick={(event) => authService.logout()}
        >
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText primary={"יציאה מהמערכת"} />
        </ListItem>

      </List>
      <Divider />
      <List>

        <ListItem
          button
          onClick={(event) => (window.location.href = "/DashBoard")}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"דשבורד"} />
        </ListItem>

        <ListItem
          button
          onClick={(event) => (window.location.href = "/ManageTasks")}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={"ניהול הכשרות"} />
        </ListItem>

      </List>
    </div>
  );

  return (
    <div className={styles.Wrapper}>
      <div className={styles.navbar}>
        {["left"].map((anchor) => (
          <React.Fragment key={anchor}>
            {user && <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(anchor, true)}
            >
              <MenuIcon />
            </IconButton>}
            <Drawer
              //drawerPosition="right"
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
            {user && <UserDetails type={"main"} user={user}></UserDetails>}
          </React.Fragment>
        ))}
      </div>
      <Container className={styles.Content} component="main" maxWidth="lg">
        <Router>
          <Routes />
        </Router>
      </Container>
    </div>
  );
}

export default App;
