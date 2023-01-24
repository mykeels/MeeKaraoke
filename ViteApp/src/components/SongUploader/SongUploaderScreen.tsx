import React from "react";
import { useNavigate } from "react-router-dom";
import { setDefaultProps } from "../../common";
import { SongUploader } from "./SongUploader";

type SongUploaderScreenProps = {
  className?: any;
  onAudioFileReceived: (blobUrl: string) => any;
  SongUploader?: React.FC<any>;
};

export const SongUploaderScreen = ({
  SongUploader,
  onAudioFileReceived
}: SongUploaderScreenProps) => {
  const navigate = useNavigate();
  return typeof SongUploader === "function" ? (
    <SongUploader
      onAudioFileReceived={(audioUrl: string) => {
        if (typeof onAudioFileReceived === "function") {
          navigate("/create");
          onAudioFileReceived(audioUrl);
        }
      }}
    />
  ) : null;
};

setDefaultProps(SongUploaderScreen, {
  SongUploader: (props) => <SongUploader {...props} />
});
