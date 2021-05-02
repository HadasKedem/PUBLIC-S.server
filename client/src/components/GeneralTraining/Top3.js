import styles from "./Top3.module.scss";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";
import LeaderBoardLogo from "../../leaderboard.svg";
import AxiosInstance from "../../services/axios-instance";

export const Top3 = (props) => {
  const [leaders, setLeaders] = useState({ top: [] });

  function LeaderRender(props) {
    return (
      <div key={props.leader.name} className={styles.Leader}>
        <img src="https://picsum.photos/30" />
        <div className={styles.Content}>
          <span className={styles.LeaderName}>{props.leader.name}</span>
          <span className={styles.LeaderPoints}>{props.leader.points} נק'</span>
        </div>
      </div>
    );
  }
  useEffect(() => {
    AxiosInstance.get("users/getBest").then((r) => {
      setLeaders(r.data);
    });
  }, []);

  return (
    <div className={styles.LeadersContent}>
      <h2 className={styles.Title}>הטובים ביותר</h2>

      <div className={styles.Users}>
        <div className={styles.TopLeaders}>
          {leaders.top.length
            ? leaders.top.map((l) => (
                <LeaderRender key={l.name} leader={l}></LeaderRender>
              ))
            : [1, 2, 3].map((k) => <div> error</div>)}
        </div>
      </div>
    </div>
  );
};
