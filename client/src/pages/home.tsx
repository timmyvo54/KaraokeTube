import { ChangeEvent, useState, useEffect } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { RoomData, JoinData } from "../other/interfaces";

function Home(): JSX.Element {
  const navigate: NavigateFunction = useNavigate();

  const [createRoomData, setCreateRoomData] = useState<RoomData>({
    room_name: "",
    host_name: "",
    create_room_password: "",
  });

  const [joinData, setJoinData] = useState<JoinData>({
    user_name: "",
    room_code: "",
    join_room_password: "",
  });

  const [createRoomDataIsFilled, setCreateRoomDataIsFilled] = useState<boolean>(false);
  const [joinRoomDataIsFilled, setJoinRoomDataIsFilled] = useState<boolean>(false);

  function handleCreateRoomChange(e: ChangeEvent<HTMLInputElement>): void {
    const { id, value } = e.target; // Captures the element being changed
    setCreateRoomData({
      ...createRoomData, // Keeps the previous data
      [id]: value // Sets the field to the new data
    });
  }

  useEffect(() => {
    setCreateRoomDataIsFilled(checkRoomData(createRoomData));
  }, [createRoomData]);

  function checkRoomData(data: RoomData): boolean {
    return data.room_name !== "" && data.host_name !== "" && data.create_room_password !== "";
  }

  function handleJoinRoomChange(e: ChangeEvent<HTMLInputElement>): void {
    const { id, value } = e.target; // Captures the element being changed
    setJoinData({
      ...joinData, // Keeps the previous data
      [id]: value // Sets the field to the new data
    });
  }

  useEffect(() => {
    setJoinRoomDataIsFilled(checkJoinData(joinData));
  }, [joinData]);

  function checkJoinData(data: JoinData): boolean {
    return data.user_name !== "" && data.room_code !== "" && data.join_room_password !== "";
  }

  async function handleCreateRoom() {
    if (createRoomDataIsFilled) {
      try {
        const response: Response = await fetch("http://localhost:25565/api/create-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            roomName: createRoomData.room_name,
            hostName: createRoomData.host_name,
            password: createRoomData.create_room_password})
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`Room created with ID: ${data.roomDetails.roomId}`);
          // Implement navigation
          // navigate(`/rooms/${data.roomDetails.roomId}`);
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error: unknown) {
        console.error("Error while creating room:", error);
        alert("An unexpected error has occurred.");
      }
    }
  }

  async function handleJoinRoom() {
    if (joinRoomDataIsFilled) {
      try {
        const response: Response = await fetch("http://localhost:25565/api/join-room", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: joinData.user_name,
            roomCode: joinData.room_code,
            password: joinData.join_room_password})
        });

        if (response.ok) {
          const data = await response.json();
          console.log(`Room joined with ID: ${data.roomDetails.roomId}`);
          // Implement navigation
          // navigate(`/rooms/${data.roomDetails.roomId}`);
        } else {
          const error = await response.json();
          alert(`Error: ${error.message}`);
        }
      } catch (error: unknown) {
        console.error("Error while creating room:", error);
        alert("An unexpected error has occurred.");
      }
    }
  }

  return (
    <>
      <div
        id="body"
        className="flex flex-col sm:flex-row flex-grow justify-evenly sm:gap-10 sm:justify-center
          sm:items-center my-4 min-w-72 sm:text-xl"
      >
        <div
          id="create_room"
          className="flex flex-col sm:flex-grow max-w-screen-sm text-screen-md sm:gap-2"
        >
          <input
            id="room_name"
            value={createRoomData.room_name}
            onChange={handleCreateRoomChange}
            type="text"
            placeholder="Room Name"
            className="border-2 border-gray-300 rounded-md p-2 m-1"
          />
          <input
            id="host_name"
            value={createRoomData.host_name}
            onChange={handleCreateRoomChange}
            type="text"
            placeholder="Host Name"
            className="border-2 border-gray-300 rounded-md p-2 m-1" 
          />
          <input
            id="create_room_password"
            value={createRoomData.create_room_password}
            onChange={handleCreateRoomChange}
            type="text"
            placeholder="Room Password"
            className="border-2 border-gray-300 rounded-md p-2 m-1"
          />
          <button
            id="create_button"
            onClick={handleCreateRoom}
            className={`${createRoomDataIsFilled ? "bg-red-500" : "cursor-not-allowed"}
              border-2 border-gray-300 rounded-md p-2 m-1`}
          >
            Create Room
          </button>
        </div>
        <div
          id="join_room"
          className="flex flex-col sm:flex-grow max-w-screen-sm text-screen-md sm:mt-0 mt-4 sm:gap-2"
        >
          <input
            id="user_name"
            value={joinData.user_name}
            onChange={handleJoinRoomChange}
            type="text"
            placeholder="Your Name"
            className="border-2 border-gray-300 rounded-md p-2 m-1" 
          />
          <input
            id="room_code"
            value={joinData.room_code}
            onChange={handleJoinRoomChange}
            type="text"
            placeholder="Room Code"
            className="border-2 border-gray-300 rounded-md p-2 m-1"
          />
          <input
            id="join_room_password"
            value={joinData.join_room_password}
            onChange={handleJoinRoomChange}
            type="text"
            placeholder="Room Password"
            className="border-2 border-gray-300 rounded-md p-2 m-1"
          />
          <button
            id="join_button"
            onClick={handleJoinRoom}
            className={`${joinRoomDataIsFilled ? "bg-red-500" : "cursor-not-allowed"}
              border-2 border-gray-300 rounded-md p-2 m-1`}
          >
            Join Room
          </button>
        </div>
      </div>
    </>
  )
}

export default Home;
