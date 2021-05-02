import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { GeneralTraining } from "../../components/GeneralTraining/GeneralTraining";
import { ManagerTrainings } from "../../components/ManagerTrainings/ManagerTrainings";
import { ManagerSideTasks } from "../../components/ManagerSideTasks/ManagerSideTasks";
import styles from "./DashBoard.module.scss";


const useStyles = makeStyles({
  root: {
      flexGrow: 1,
  },
  
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
          <h1>{children}</h1>
      )}
    </div>
  );
}

export const DashBoard = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return <div>
  
  <hr></hr>
  <Tabs
    value={value}
    onChange={handleChange}
    indicatorColor="primary"
    textColor="primary"
    centered
    >
      <Tab label="כללי" />
      <Tab label="מתאמנים" />
      <Tab label="הכשרות" />
  </Tabs>

  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
}}
    >
    <TabPanel value={value} index={0} >
      <GeneralTraining ></GeneralTraining>
    </TabPanel>
    <TabPanel value={value} index={1} >
      <ManagerTrainings></ManagerTrainings>
    </TabPanel>
    <TabPanel value={value} index={2}>
      <ManagerSideTasks></ManagerSideTasks>
    </TabPanel>
  </div>
    
</div>
}
