import { ChangeEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface RoomData {
  room_name: string;
  host_name: string;
  create_room_password: string;
}

interface JoinData {
  user_name: string;
  room_code: string;
  join_room_password: string;
}

function Home() {
  const navigate = useNavigate();

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

  const [createDataIsFilled, setCreateDataIsFilled] = useState<boolean>(false);
  const [joinDataIsFilled, setJoinDataIsFilled] = useState<boolean>(false);

  function handleCreateRoomChange(e: ChangeEvent<HTMLInputElement>): void {
    const { id, value } = e.target; // Captures the element being changed
    setCreateRoomData({
      ...createRoomData, // Keeps the previous data
      [id]: value // Sets the field to the new data
    });
  }

  useEffect(() => {
    setCreateDataIsFilled(checkRoomData(createRoomData));
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
    setJoinDataIsFilled(checkJoinData(joinData));
  }, [joinData]);

  function checkJoinData(data: JoinData): boolean {
    return data.user_name !== "" && data.room_code !== "" && data.join_room_password !== "";
  }

  function handleCreateRoom() {
    if (createDataIsFilled) {
      navigate("/room");
    }
  }

  function handleJoinRoom() {
    if (joinDataIsFilled) {
      navigate("/room");
    }
  }

  return (
    <>
      <div id="body" className="flex flex-col sm:flex-row flex-grow justify-evenly sm:gap-10 sm:justify-center sm:items-center mx-8">
        <div id="create_room" className="flex flex-col sm:flex-grow max-w-screen-md text-screen-md">
          <input id="room_name" value={createRoomData.room_name} onChange={handleCreateRoomChange} className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Room Name"/>
          <input id="host_name" value={createRoomData.host_name} onChange={handleCreateRoomChange} className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Host Name"/>
          <input id="create_room_password" value={createRoomData.create_room_password} onChange={handleCreateRoomChange} className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Room Password"/>
          <button id="create_button" onClick={handleCreateRoom} className={`${createDataIsFilled ? "bg-red-500" : "cursor-not-allowed"} border-2 border-gray-300 rounded-md p-2 m-1`}>Create Room</button>
        </div>
        <div id="join_room" className="flex flex-col sm:flex-grow max-w-screen-md text-screen-md">
          <input id="user_name" value={joinData.user_name} onChange={handleJoinRoomChange} className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Your Name"/>
          <input id="room_code" value={joinData.room_code} onChange={handleJoinRoomChange} className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Room Code"/>
          <input id="join_room_password" value={joinData.join_room_password} onChange={handleJoinRoomChange} className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Room Password"/>
          <button id="join_button" onClick={handleJoinRoom} className={`${joinDataIsFilled ? "bg-red-500" : "cursor-not-allowed"} border-2 border-gray-300 rounded-md p-2 m-1`}>Join Room</button>
        </div>
      </div>
    </>
  )
}

export default Home;
