import ProfileSVG from "../assets/profile-svg";

function Header() {
  return (
    <>
      <div id="header" className="flex align-center mt-4 mx-4">
        <a className="transition hover:scale-110 duration-150 text-red-500 text-4xl h-10 mx-auto" href="https://github.com/timmyvo54/KaraokeTube" target="_blank">KaraokeTube</a>
        <div className="flex self-center transition hover:scale-125 duration-150">
          <ProfileSVG/>
        </div>
      </div>
    </>
  )
}

export default Header;
