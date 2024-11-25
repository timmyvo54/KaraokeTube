import ProfileSVG from "./assets/profile-svg"
import GitHubSVG from "./assets/github-svg"

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <div id="header" className="flex align-center mt-4 mx-4">
          <a className="transition hover:scale-110 duration-150 text-red-500 text-4xl h-10 mx-auto" href="https://github.com/timmyvo54/KaraokeTube" target="_blank">KaraokeTube </a>
          <div className="flex self-center transition hover:scale-125 duration-150">
            <ProfileSVG/>
          </div>
        </div>
        <div id="body" className="flex flex-col sm:flex-row flex-grow justify-evenly sm:gap-10 sm:justify-center sm:items-center mx-8">
          <div id="create_room" className="flex flex-col sm:flex-grow max-w-screen-md text-screen-md">
            <input id="room_name" className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Room Name"/>
            <input id="host_name" className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Host Name"/>
            <input id="create_room_password" className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Room Password"/>
            <button id="create_button" className="border-2 border-gray-300 rounded-md p-2 m-1">Create Room</button>
          </div>
          <div id="join_room" className="flex flex-col sm:flex-grow max-w-screen-md text-screen-md">
            <input id="your_name" className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Your Name"/>
            <input id="room_code" className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Room Code"/>
            <input id="join_room_password" className="border-2 border-gray-300 rounded-md p-2 m-1" type="text" placeholder="Room Password"/>
            <button id="join_button" className="border-2 border-gray-300 rounded-md p-2 m-1">Join Room</button>
          </div>
        </div>
        <div id="footer" className="flex justify-center mb-4">
          <a id="github" className="transition hover:scale-125 duration-150" href="https://github.com/timmyvo54/KaraokeTube" target="_blank">
            <GitHubSVG/>
          </a>
        </div>
      </div>
    </>
  )
}

export default App
