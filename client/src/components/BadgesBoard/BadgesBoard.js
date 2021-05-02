import React from "react";
import styles from "./BadgesBoard.module.scss";
import BadgeLogo from '../../badge.svg'


const badges = [
  { name: "אליפות מבנה מסוק", icon: "", isActive: true },
  { name: "תותח", icon: "", isActive: true },
  { name: "חבר מרכז ליכוד", icon: "", isActive: true },
  { name: "מלך ההפלות", icon: "", isActive: false },
  { name: "מצטיין רלצד בעתיד", icon: "", isActive: false }
];

function Badge(props) {
  return (
    <div className={`${styles.Badge} ${!props.badge.isActive ? styles.DisabledBadge : ''}`}>
      <img src="https://picsum.photos/22" />
      <span>{props.badge.name}</span>
    </div>
  )
}

export const BadgesBoard = (props) => {

  return (
    <div className={styles.BadgesContent}>
      <h2 className={styles.Title}>
        <img src={BadgeLogo}></img>
        תגים
        </h2>
      <div className={styles.Badges}>
        {badges.map(b => (
          <Badge key={b.name} badge={b}></Badge>
        ))}
      </div>
    </div>
  );

};
