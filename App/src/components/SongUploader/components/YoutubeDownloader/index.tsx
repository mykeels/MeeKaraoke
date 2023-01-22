import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { assert, Spinner } from "../../../../common";

type YoutubeDownloaderSubmission = {
  url: string;
};

type YoutubeDownloaderProps = {
  className?: any;
  getAudioUrl?: (youtubeUrl: string) => Promise<string>;
  onDownload?: (audioUrl: string) => any;
};

export const YoutubeDownloader = ({
  className,
  getAudioUrl,
  onDownload
}: YoutubeDownloaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const download = async (url: string) => {
    if (url) {
      const audioUrl = await assert(
        getAudioUrl,
        "[getAudioUrl] is required"
      )(url);
      typeof onDownload === "function" && onDownload(audioUrl);
    }
  };
  const {
    handleSubmit,
    register,
    errors: formErrors,
    reset
  } = useForm({
    mode: "onChange",
    defaultValues: {
      url: ""
    }
  });

  const onFormSubmit = async (values: YoutubeDownloaderSubmission) => {
    setIsLoading(true);
    return download(values.url).finally(() => {
      setIsLoading(false);
      reset();
    });
  };
  return (
    <div className={className}>
      <div className="py-4">From Youtube</div>
      <div className="block w-full py-4">
        <form className="flex" onSubmit={handleSubmit(onFormSubmit)}>
          <div className="inline-block w-3/4">
            <input
              type="text"
              name="url"
              placeholder="https://www.youtube.com/watch?v=000"
              className="w-full text-xl px-4 py-2 text-purple-200"
              ref={register({
                required: "Please provide a valid Youtube URL"
              })}
            />
            <div className="py-2">
              {formErrors.url ? (
                <div className="block text-center p-2 rounded bg-purple-200 border border-pink text-white">
                  {formErrors.url.message}
                </div>
              ) : null}
            </div>
          </div>
          <div className="inline-block w-1/4">
            <button className="flex bg-lavender-100 px-4 py-2" type="submit">
              {isLoading ? <Spinner size={24} /> : "Fetch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

YoutubeDownloader.defaultProps = {};
