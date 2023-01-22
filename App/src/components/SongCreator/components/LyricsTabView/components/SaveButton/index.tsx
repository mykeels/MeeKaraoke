import classNames from "classnames";
import React, { useRef, useState } from "react";
import saveMp3 from "./save.mp3";

type SaveButtonProps = {
  onClick?: () => any;
};

export const SaveButton = ({ onClick }: SaveButtonProps) => {
  const audioRef = useRef<HTMLAudioElement>();
  const [show, setShow] = useState(false);
  const save = () => {
    audioRef.current?.play();
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 500);
    typeof onClick === "function" && onClick();
  };

  return (
    <div className="relative">
      <audio
        ref={audioRef as React.RefObject<HTMLAudioElement>}
        src={saveMp3}
      ></audio>
      <button
        className={classNames(
          "w-full block text-xs leading-tight uppercase px-2 py-2 hover:bg-purple-100 hover:text-white"
        )}
        onClick={save}
        role="tab"
      >
        💾
      </button>
      {show ? (
        <div
          className="flex absolute top-0 w-full h-8 justify-center items-center 
                bg-pink mt-8 rounded border border-purple-100"
          style={{ left: "0rem" }}
        >
          Saved!
        </div>
      ) : null}
    </div>
  );
};

SaveButton.defaultProps = {};
