import Skeleton from "@material-ui/lab/Skeleton";
import React, { useEffect, useState } from "react";
import LeaderBoardLogo from "../../leaderboard.svg";
import AxiosInstance from "../../services/axios-instance";
import styles from "./LeaderBoard.module.scss";

export const LeaderBoard = (props) => {

  const [leaders, setLeaders] = useState({ top: [], currentUser: {} });

  function LeaderRender(props) {
    return (
      <div
        key={props.leader.name}
        className={`${styles.Leader} ${props.leader.isCurrentUser ? styles.CurrentUser : ""
          }`}
      >
        <img src="https://picsum.photos/30" />
        <span className={styles.LeaderName}>{props.leader.name}</span>
        <span className={styles.LeaderPoints}>
          {props.leader.points} נקודות
        </span>
      </div>
    );
  }

  function LeaderSkeleton(props) {
    return (
      <div className={styles.LeaderSkeleton} key={props.k}>
        <Skeleton variant="circle" width={30} height={30} />
        <Skeleton variant="rect" width={180} height={18} />
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
      <h2 className={styles.Title}>
        <img src={LeaderBoardLogo}></img>
        לוח מקלענות
      </h2>

      <div className={styles.Users}>
        <div className={styles.TopLeaders}>
          {leaders.top.length
            ? leaders.top.map((l) => (
              <LeaderRender key={l.name} leader={l}></LeaderRender>
            ))
            : [1, 2, 3].map((k) => <LeaderSkeleton key={k}></LeaderSkeleton>)}
        </div>

        {leaders.currentUser || leaders.top.length === 0 ? (
          <div>
            <div className={styles.DashedDivider}>
              {leaders.top.length ? (
                <span>{leaders.currentUser.rank - 3} +</span>
              ) : (
                ""
              )}
            </div>
            {leaders.top.length ? (
              <LeaderRender
                key={leaders.currentUser.name}
                leader={leaders.currentUser}
              ></LeaderRender>
            ) : (
              <LeaderSkeleton></LeaderSkeleton>
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
