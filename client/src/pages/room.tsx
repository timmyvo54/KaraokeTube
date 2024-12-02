import {useState, useEffect} from "react";
import { QRCodeSVG } from "qrcode.react";
import { RoomData, JoinData } from "./home";
import Player from "../other/youtube";
import VideoData from "../other/video-data";

export interface QueuedVideo extends Video {
  added_by: string;
}

interface Video {
  url: string;
  thumbnail: string;
  title: string;
  artist: string;
}

function Room({CurrentRoomData}: {CurrentRoomData: RoomData | JoinData}) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateDimensions() {
      const width = window.innerWidth * 0.5;
      const height = (width / 16) * 9;  // 16:9 aspect ratio formula
      setDimensions({ width, height });
    };

    // Update on resize
    window.addEventListener('resize', updateDimensions);

    // Initial dimensions calculation
    updateDimensions();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const [queuedVideos, setQueuedVideos] = useState<QueuedVideo[]>([
    {
    url: "https://www.youtube.com/watch?v=kOHB85vDuow",
    thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
    title: "Fancy",
    artist: "Twice",
    added_by: "Tim"
    }, 
    {
    url: "https://www.youtube.com/watch?v=kOHB85vDuow",
    thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
    title: "Fancy",
    artist: "Twice",
    added_by: "Tim"
    },
        {
    url: "https://www.youtube.com/watch?v=kOHB85vDuow",
    thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
    title: "Fancy",
    artist: "Twice",
    added_by: "Tim"
    }, 
    {
    url: "https://www.youtube.com/watch?v=kOHB85vDuow",
    thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
    title: "Fancy",
    artist: "Twice",
    added_by: "Tim"
    },
  ]);
  const [searchedVideos, setSearchedVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video>({
    url: "https://www.youtube.com/watch?v=kOHB85vDuow",
    thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
    title: "Fancy",
    artist: "Twice"
  });
  const room_id = 12345; //CurrentRoomData.room_code;
  const room_url = 'https://karaoketube.io/room/${room_id}';

  return (
    <>
      {window.innerWidth < 640 ?
        <>
          <div id="body" className="flex flex-col mt-4 flex-grow">
            <div className="flex flex-col flex-grow ">
              <div id="queue_title" className="text-2xl self-center mb-2">
                <span>Queue</span>
              </div>
              <div id="queue" className="flex-col flex-grow text-2xl overflow-y-scroll" style={{maxHeight: "400px"}}>
                {queuedVideos.map((video) => {
                  return (
                    <VideoData Video={video} />
                  )
                })}
              </div>
              <div id="search_title" className="text-2xl self-center mb-2">
                <span>Search</span>
              </div>
              <div id="search" className="flex-col flex-grow self-center text-2xl overflow-scroll">
                <span>Search</span>
              </div>
            </div>
            <div id="cur_video" className="flex border-t border-black gap-10 mr-4 ml-4 mt-2 pt-2">
              <div id="thumbnail" className="w-1/3">
                <img src={currentVideo.thumbnail} alt={currentVideo.title}/>
              </div>
              <div id="video_info" className="flex flex-col justify-evenly">
                <span className="text-xl">Fancy by Twice</span>
                <span className="text-xl">Added by Tim</span>
              </div>
            </div>
          </div>
        </>
        :
        <div id="body" className="flex mt-10 flex-row flex-grow justify-evenly sm:gap-10 sm:justify-center mx-8">
          <div className="flex-grow">
            <div className="flex-grow">
              <Player height={dimensions.height} width={dimensions.width} />
            </div>
            <div id = "room_info" className="flex flex-grow items-center sm:gap-10">
              <div id = "room_code" className="flex flex-col items-center">
                <p className="text-xl sm:text-4xl">Room Code: {room_id}</p>
              </div>
              <div id = "qr_code" className="hidden sm:block bg-white p-2 round-md">
                <QRCodeSVG value={room_url} size={126}/>
              </div>
            </div>
          </div>
          <div className="flex justify-evenly flex-grow">
            <div className="self-start text-2xl">
              <span>Queue</span>
              {queuedVideos.map((video) => {
                return (
                  <VideoData Video={video} />
                )
              })}
            </div>
            <div className="self-start text-2xl">Search</div>
          </div>
        </div>
      }
    </>
  )
}

export default Room;
