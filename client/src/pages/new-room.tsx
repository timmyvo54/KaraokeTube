import { useState, useEffect, useRef } from "react";
import { useParams, NavigateFunction, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

function NewRoom(): JSX.Element {

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

  return (
    <>
      { isConnected ? 
          <div>
            <span>This is new room</span>
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
