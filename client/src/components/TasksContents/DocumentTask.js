import React from "react";
import styles from "./Tasks.module.scss";
import wordIcon from '../../wordIcon.svg'
import { DownloadFileButton } from './DownloadFileButton'

export const DocumentTask = (props) => {
  return (
    <div className={styles.DocumentTask}>

      <div className={styles.DocumentDataWrapper}>
        <img src={wordIcon}></img>
        <p className={styles.DocumentName}>{props.documentDetails.documentName}</p>
        <p className={styles.DocumentDetails}>
          {/* נוצר ע"י {props.documentDetails.createdBy}  */}
        נוצר בתאריך {props.documentDetails.createdAt.toLocaleDateString()}
        </p>
      </div>
      <div className={styles.DownloadDocumentButtonWrapper}>
        <DownloadFileButton link={props.link} >
        </DownloadFileButton>

        {/* TODO maybe iframe */}

      </div>

    </div>
  );

};
