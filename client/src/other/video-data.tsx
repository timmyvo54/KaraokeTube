import { QueuedVideo } from "../pages/room";

function VideoData({Video}: {Video: QueuedVideo}) {
  return (
    <div className="flex flex-col items-center">
      <img src={Video.thumbnail} alt={Video.title} className="w-1/2"/>
      <span>{`${Video.title}`}</span>
      <span>{`Added by: ${Video.added_by}`}</span>
    </div>
  )
}

export default VideoData;
