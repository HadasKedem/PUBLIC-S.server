import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LeaderBoard } from "../components/LeaderBoard/LeaderBoard";
import { BadgesBoard } from "../components/BadgesBoard/BadgesBoard";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250,
  },
}));

export const HowToWin = () => {
  const classes = useStyles();

  const handleChange = event => {
    setValues(oldValues => ({
      ...oldValues,
      [event.target.name]: event.target.value,
    }));
  };

  const [values, setValues] = React.useState({
    age: '',
    name: 'hai',
  });

  const getRankAndTags = () => {
    return [
      `דרגות לא מתאפסות לעולם ומחושבות כך לדוגמא:`,
      `דרגה 2 תתקבל לאחר 40 נק׳.`,
      `דרגה 3 לאחר 100 נק׳ .`,
      `דרגה 4 לאחר 180 נק׳.`,
      `את הדרגה ניתן לראות בתפריט הצד.`,
      ``, ``, ``, ``,
      `כדאי לשים לב לתגים, השלמה של כל ההדרכות הרלוונטיות יעניקו תג. תפוגה של אחת ההדרכות הקשורות תבטל את התג ויש לחדשו בהקדם.`
    ];
  }


  const getBody = () => {
    return [`לכל הדרכה יש משקל ניקוד משלה בין 10-50 נקודות.`,
      `בנוסף עמידה במשימות מעניקות בונוס נוסף.`,
      `כשההדרכה פגה יש לחדשה מיידית.`,
      `כ 30 יום לפני שהדרכה פגה אפשר לחדש אותה ולזכות שוב בנקודות.`,
      `הנקודות מתאפסות אחת לשנה לכלל המתאמנים.`
    ]
  }

  return <div style={{ display: "flex", flexDirection: "column" }}>

    <h1 style={{ textAlign: "center", color: "#1b1b1b", marginBottom: "40px" }}>איך מנצחים</h1>

    {getBody().map((p, i) => (
      <span style={{ fontWeight: "600", color: "#292929", marginBottom: "5px" }} key={i} > { p}</span>
    ))}

    <div style={{ padding: "0px 14px 16px 20px", margin: "20px 0", overflow: "hidden", maxHeight: "290px", boxShadow: "#808080 0px 0px 2px", background: "white" }}>
      <LeaderBoard />
    </div>

    {
      getRankAndTags().map((p, i) => (
        <span style={{ fontWeight: "600", color: "#292929", marginBottom: "5px" }} key={i} > { p}</span>
      ))
    }

    <div style={{ boxShadow: "#808080 0px 0px 2px", background: "white", display: "flex", justifyContent: "flex-end", margin: "30px 0" }}>
      <BadgesBoard />
    </div>

  </div >
}
