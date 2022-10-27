const path = require("path");
const { renderMedia } = require("@remotion/renderer");

(async () => {
  try {
    await renderMedia({
      serveUrl: "http://127.0.0.1:8080/",
      outputLocation: path.join(__dirname, "../videos/asake-rendered.mp4"),
      composition: {
        id: "SongURLPlayer",
        width: 640,
        height: 320,
        fps: 60,
        durationInFrames: 60 * 135
      },
      codec: "h264",
      envVariables: {
        REMOTION_FRAMES_PER_SECOND: "60",
        REMOTION_VIDEO_URL:
          "http://localhost:5000/songs/3afbe273-71ec-49a6-92fc-742bd46d65ad",
        REMOTION_VIDEO_DURATION: "135"
      },
      onStart: () => console.log("started"),
      onProgress: ({
        renderedFrames,
        encodedFrames,
        encodedDoneIn,
        renderedDoneIn,
        stitchStage
      }) => {
        if (stitchStage === "encoding") {
          // First pass, parallel rendering of frames and encoding into video
          console.log("Encoding...");
        } else if (stitchStage === "muxing") {
          // Second pass, adding audio to the video
          console.log("Muxing audio...");
        }
        // Amount of frames rendered into images
        console.log(`${renderedFrames} rendered`);
        // Amount of frame encoded into a video
        console.log(`${encodedFrames} encoded`);
        // Time to create images of all frames
        if (renderedDoneIn !== null) {
          console.log(`Rendered in ${renderedDoneIn}ms`);
        }
        // Time to encode video from images
        if (encodedDoneIn !== null) {
          console.log(`Encoded in ${encodedDoneIn}ms`);
        }
      }
    });
  } catch (error) {
    console.error(error);
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
})();
