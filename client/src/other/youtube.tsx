import YouTube, {YouTubeProps} from "react-youtube";

function Player({height, width}: {height: number, width: number}) {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    console.log("Player ready!");
  }

  const opts: YouTubeProps["opts"] = {
    height: height,
    width: width,
    playerVars: {
      autoplay: 1
    }
  }

  return (
    <YouTube videoId="kOHB85vDuow" opts={opts} onReady={onPlayerReady} />
  );
}

export default Player;
