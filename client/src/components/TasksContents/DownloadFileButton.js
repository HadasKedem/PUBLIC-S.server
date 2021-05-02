import { Button } from "@material-ui/core";
import React from "react";
import styles from "./Tasks.module.scss";
import downloadIcon from '../../downloadIcon.svg'

export const DownloadFileButton = (props) => {
    return (
        <a style={{ textDecoration: "none" }} href={props.link} download>
            <Button className={styles.DownloadButton} variant="outlined">
                <img src={downloadIcon}></img>
            הורד קובץ
        </Button>
        </a>
    );
};
