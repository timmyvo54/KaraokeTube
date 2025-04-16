import { ChangeEvent, useState, useEffect, useRef } from "react";
import { useParams, NavigateFunction, useNavigate, useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { QueuedVideo, SearchedVideo } from "../other/interfaces";

function NewRoom(): JSX.Element {

  const location = useLocation();
  const { isHost, name } = location.state || {};

  const socketRef = useRef<Socket | null>(null);

  const connectedRef = useRef<boolean>(false);

  const [isConnected, setIsConnected] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();

  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    async function connectSocket(id: string): Promise<Socket> {

      const socket: Socket = io("http://localhost:25565", {
        withCredentials: true,
        auth: { roomCode: id }
      });

      socketRef.current = socket;

      return new Promise((resolve, reject) => {

        socket.on("connect", () => {
          console.log("Connected to WebSocket server.");
          socket.emit("join-room", { roomCode: id });
          setIsConnected(true);
          resolve(socket);
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection failed: ", error);
          reject(error);
        });
      });
    }

    async function enterRoom(): Promise<void> {
      try {
        const response: Response = await fetch("http://localhost:25565/api/handshake", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ roomCode: id })
        });

        if (!response.ok) {
          const data = await response.json();
          alert(data.message);
          navigate("/");
        }

        const socket: Socket = await connectSocket(id!);
        socketRef.current = socket;

      } catch (error: unknown) {
        console.error(error);
        alert("Unexpected error while joining room.");
        navigate("/");
      }
    }

    function handleUnload(): void {
      console.log("Unload event triggered.");
      if (socketRef.current) {
        socketRef.current.emit("leave-room", { roomCode: id });
        socketRef.current.disconnect();
        console.log("Socket disconnected.");
      }
    }

    function handleVisibilityChange(): void {
      console.log("Visibility change event triggered.");
      if (socketRef.current) {
        socketRef.current.emit("leave-room", { roomCode: id });
        socketRef.current.disconnect();
        console.log("Socket disconnected.");
      }
    }

    function handlePageHide(): void {
      console.log("Page hide event triggered.");
      if (socketRef.current) {
        socketRef.current.emit("leave-room", { roomCode: id });
        socketRef.current.disconnect();
        console.log("Socket disconnected.");
      }
    }

    if (connectedRef.current) return;
    connectedRef.current = true;

    window.addEventListener("unload", handleUnload);
    document.addEventListener("visibilityChange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    enterRoom();

    return () => {
      console.log("Cleaning up room...");
      if (socketRef.current) {
        console.log("Socket still exists, disconnecting...");
        socketRef.current.disconnect();
        console.log("Socket disconnected.");
      } else {
        console.warn("No socket found on cleanup.");
      }
      window.removeEventListener("unload", handleUnload);
      document.removeEventListener("visibilityChange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    }

  }, [id, navigate]);

  useEffect(() => {
    console.log("Room component mounted");
    return () => {
      socketRef.current?.disconnect();
      console.log("Room component unmounted");
    };
  }, []);

  const [searchData, setSearchData] = useState<string>("");
  const [searchDataMobile, setSearchDataMobile] = useState<string>("");

  function handleSearchChange(e: ChangeEvent<HTMLInputElement>): void {
    const { value } = e.target;
    setSearchData(value);
  }

  function handleEnter(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSubmit(searchData);
    }
  }

  const [searchedVideos, setSearchedVideos] = useState<SearchedVideo[]>([]);

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
        title: item.snippet.title,
        id: item.id.videoId
      }
    }));
    // url: string;
    // thumbnail: string;
    // title: string;
    console.log(data);
  }

  const [hoveredSearchedVideo, setHoveredSearchedVideo] = useState<string | null>(null);
  const [queuedVideos, setQueuedVideos] = useState<QueuedVideo[]>([]);
  const [hoveredQueuedVideo, setHoveredQueuedVideo] = useState<string | null>(null);

  // const [curVideo, setCurVideo] = useState< | null>(null);

  return (
    <>
      { isConnected && isHost ? 
          <div className="flex flex-grow w-full justify-evenly my-4">
            <div id="video" className="flex flex-col flex-[2] max-w-[50%]">
              <span className="text-xl self-center">Video</span>
            </div>
            <div id="queue" className="flex flex-col max-w-[25%] flex-1" >
              <span className="text-xl self-center">Queue</span>
              <div id="queued" className="flex-col text-xl overflow-y-scroll m-4" style={{maxHeight: "80vh"}}>
                {queuedVideos.map((video) => {
                    return (
                      <div
                        className="flex flex-col"
                        key={video.id}
                        onMouseEnter={() => setHoveredQueuedVideo(video.id)}
                        onMouseLeave={() => setHoveredQueuedVideo(null)}
                      >
                        <img src={video.thumbnail} alt={video.title} />
                        <span className={hoveredQueuedVideo === video.id ? "" : "truncate"}>
                          {`${video.title}\nAdded by: ${video.added_by}`}
                        </span>
                      </div>
                    )
                  })}
              </div>
            </div>
            <div id="search" className="flex flex-1 flex-col max-w-[25%]">
              <input id="search_bar_desktop"
                onKeyDown={handleEnter}
                value={searchData}
                onChange={handleSearchChange}
                className="border-2 border-gray-300 rounded-md self-start text-xl self-center pl-2"
                placeholder="Search"
              />
              <div id="search" className="flex-col text-xl overflow-y-scroll m-4" style={{maxHeight: "80vh"}}>
                {searchedVideos.map((video) => {
                  return (
                    <div
                      className="flex flex-col"
                      key={video.id}
                      onMouseEnter={() => setHoveredSearchedVideo(video.id)}
                      onMouseLeave={() => setHoveredSearchedVideo(null)}
                      onMouseDown={() => setQueuedVideos([...queuedVideos, {
                        url: video.url,
                        thumbnail: video.thumbnail,
                        title: video.title,
                        id: video.id,
                        added_by: name
                      }])}
                    >
                      <img src={video.thumbnail} alt={video.title} />
                      <span className={hoveredSearchedVideo === video.id ? "" : "truncate"}>
                        {`${video.title}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        :
          <>
            <div className="flex flex-grow"></div>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          </>
      }
    </>
  );
}

export default NewRoom;
