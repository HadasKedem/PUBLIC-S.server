import React from "react";
import styles from "./Tasks.module.scss";
import { DownloadFileButton } from './DownloadFileButton'
import { Player, Video } from '@vime/react';
import '@vime/core/themes/default.css';

export const VideoTask = (props) => {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Player controls>
          <Video crossOrigin="">
            <source data-src={props.link} />
          </Video>
        </Player>
      </div>
      <DownloadFileButton fileLink={props.link} >
      </DownloadFileButton>
    </div>
  );

};
