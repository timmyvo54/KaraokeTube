import { useEffect } from "react";
import { useParams, NavigateFunction, useNavigate } from "react-router-dom";

function NewRoom(): JSX.Element {

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
      <div>
        <span>This is new room</span>
      </div>
    </>
  );
}

export default NewRoom;
