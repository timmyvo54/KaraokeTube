import { ChangeEvent, useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { CreateRoomData, JoinRoomData, User } from "../other/interfaces";
import Player from "../other/youtube";
import VideoData from "../other/video-data";

export interface QueuedVideo extends Video {
  added_by: User;
}

interface Video {
  url: string;
  thumbnail: string;
  title: string;
}

interface YoutubeSearchItem {
  [key: string]: any
}

function Room({CurrentRoomData}: {CurrentRoomData: CreateRoomData | JoinRoomData}) {
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [searchData, setSearchData] = useState<string>("");
  const [searchDataMobile, setSearchDataMobile] = useState<string>("");

  const { id } = useParams<{ id: string }>();

  function handleMobileSearchChange(e: ChangeEvent<HTMLInputElement>): void {
    const { value } = e.target;
    setSearchDataMobile(value);
  }

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>): void {
    const { value } = e.target;
    setSearchData(value);
  }

  async function verifyRoomExists(roomCode: string): Promise<boolean> {
    const response: Response = await fetch(`http://localhost:25565/api/verify-room-exist/?roomCode=${roomCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
    });
    return response.ok;
  }

  useEffect(() => {
    /**
     * @todo Send the cookies to the server to authenticate the user
     * @todo If the user is not authenticated, redirect them to the home page
     * @todo If cookies are present shake their hand
     */
    console.log(id);
    if (!id || id.length !== 4) {
      navigate("/");
    }

    // Check if room with id exists on our database if not redirect to home page
    verifyRoomExists(id!).then((exists: boolean) => {
      if (!exists) {
        navigate("/");
      }
    });

    // Handle the handshake between the client and server
    /**
     * @TODO call handshake endpoint
     * @TODO connect room data from server and populate client with data
     */
  
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

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSubmit(searchData);
    }
  }

  function handleSubmit(data: string) {
    if (data.length != 0) {
      console.log(data);
      searchYoutube(data);
      setSearchData("");
    }
  }

  async function searchYoutube(query: string) {
    const API_KEY = import.meta.env.VITE_YOUTUBE_KEY;
    const BASE_URL = "https://www.googleapis.com/youtube/v3/search";
    const params = new URLSearchParams({
      part: "snippet",
      q: `${query.trim()} karaoke`,
      maxResults: "25",
      type: "video",
      key: API_KEY
    });
    const response: Response = await fetch(`${BASE_URL}?${params}`);
    const data = await response.json();
    setSearchedVideos(data.items.map((item: { id: { videoId: any; }; snippet: { thumbnails: { high: { url: any; }; }; title: any; }; }) => {
      return {
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.high.url,
        title: item.snippet.title
      }
    }));
    // url: string;
    // thumbnail: string;
    // title: string;
    console.log(data);
  }

  const [queuedVideos, setQueuedVideos] = useState<QueuedVideo[]>([
    {
      url: "https://www.youtube.com/watch?v=kOHB85vDuow",
      thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
      title: "Fancy",
      added_by: "Tim"
    }, 
    {
      url: "https://www.youtube.com/watch?v=kOHB85vDuow",
      thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
      title: "Fancy",
      added_by: "Tim"
    },
    {
      url: "https://www.youtube.com/watch?v=kOHB85vDuow",
      thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
      title: "Fancy",
      added_by: "Tim"
    }, 
    {
      url: "https://www.youtube.com/watch?v=kOHB85vDuow",
      thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
      title: "Fancy",
      added_by: "Tim"
    },
    {
      url: "https://www.youtube.com/watch?v=kOHB85vDuow",
      thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
      title: "Fancy",
      added_by: "Tim"
    },
    {
      url: "https://www.youtube.com/watch?v=kOHB85vDuow",
      thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
      title: "Fancy",
      added_by: "Tim"
    },
    {
      url: "https://www.youtube.com/watch?v=kOHB85vDuow",
      thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
      title: "Fancy",
      added_by: "Tim"
    },
    {
      url: "https://www.youtube.com/watch?v=kOHB85vDuow",
      thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
      title: "Fancy",
      added_by: "Tim"
    },
  ]);
  const [searchedVideos, setSearchedVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video>({
    url: "https://www.youtube.com/watch?v=kOHB85vDuow",
    thumbnail: "https://i.ytimg.com/vi/kOHB85vDuow/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAdMUCbv12zLsP3ZZ8F7gn6CcGINA",
    title: "Fancy",
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
              <input id="search_bar_mobile" value={searchDataMobile} onChange={handleMobileSearchChange} className="border-2 border-gray-300 rounded-md self-start text-4xl" placeholder="Search"/>
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
            <div className="flex flex-col justify-center self-start text-2xl">
              <span className="self-center text-4xl">Queue</span>
              <div id="queue" className="flex-col text-2xl overflow-y-scroll" style={{maxHeight: "80vh"}}>
                {queuedVideos.map((video) => {
                  return (
                    <VideoData Video={video} />
                  )
                })}
              </div>
            </div>
            <div className="flex flex-col justify-center self-start text-2xl">
              <input id="search_bar_desktop" onKeyDown={handleEnter} value={searchData} onChange={handleSearchChange} className="border-2 border-gray-300 rounded-md self-start text-4xl" placeholder="Search"/>
              <div id="search" className="flex-col text-2xl overflow-y-scroll" style={{maxHeight: "80vh"}}>
                {searchedVideos.map((video) => {
                  return (
                    <div className="flex flex-col items-center">
                      <img src={video.thumbnail} alt={video.title} className="w-1/2"/>
                      <span>{`${video.title}`}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default Room;
