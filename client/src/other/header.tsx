import ProfileSVG from "../assets/profile-svg";

function Header() {
  return (
    <>
      <div id="header" className="flex align-center justify-center mt-4 min-w-72">
        <a 
          className="transition hover:scale-110 duration-150 text-red-500 text-4xl h-10 sm:h-12 sm:text-5xl"
          href="https://github.com/timmyvo54/KaraokeTube"
          target="_blank"
        >
          KaraokeTube
        </a>
        <div className="flex self-center transition hover:scale-125 duration-150 absolute end-0 min-[300px]:end-4">
          <ProfileSVG/>
        </div>
      </div>
    </>
  )
}

export default Header;
