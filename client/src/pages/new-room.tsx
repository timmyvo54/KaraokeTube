import { useState, useEffect } from "react";
import { useParams, NavigateFunction, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

let socket: Socket;

function NewRoom(): JSX.Element {

  const [connected, setConnected] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();

  const navigate: NavigateFunction = useNavigate();

  useEffect((): void => {
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

        /**
         * @TODO Connect to socket.io
         * @TODO Emit join room event
         * @TODO Handle real time updates
         */

        socket = io("http://localhost:25565");

      } catch (error: unknown) {
        console.error(error);
        alert("Unexpected error while joining room.");
        navigate("/");
      }
    }

    enterRoom();

    

  }, [id, navigate]);

  return (
    <>
      { connected ? 
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
