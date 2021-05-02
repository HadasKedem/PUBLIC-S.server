import React from "react";
import { Route, Switch } from "react-router-dom";
import { NoMatch } from "../pages/404";
import { Home } from "../pages/Home/Home";
import { CreateTrainPage } from "../createTrain/createTrainPage"
import { Task } from "../pages/Task";
import { HowToWin } from "../pages/HowToWin";
import { ManageTasks } from "../pages/ManageTasks";
import { DashBoard } from "../pages/DashBoard/DashBoard";
import { Login } from "../pages/Login/Login";


export const Routes = () => {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Home />
      </Route>

      <Route exact={true} path="/create">
        <CreateTrainPage />
      </Route>
      <Route exact={true} path="/task">
        <Task />
      </Route>
      <Route exact={true} path="/login">
        <Login />
      </Route>
      <Route exact={true} path="/HowToWin">
        <HowToWin />
      </Route>
      <Route exact={true} path="/ManageTasks">
        <ManageTasks />
      </Route>
      <Route exact={true} path="/DashBoard">
        <DashBoard />
      </Route>
      <Route path="*">
        <NoMatch />
      </Route>
    </Switch>
  );
};
