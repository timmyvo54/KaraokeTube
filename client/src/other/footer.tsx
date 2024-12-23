import GitHubSVG from "../assets/github-svg";

function Footer() {
  return (
    <>
      <div id="footer" className="flex justify-center mb-4">
        <a
          id="github"
          className="transition hover:scale-125 duration-150"
          href="https://github.com/timmyvo54/KaraokeTube"
          target="_blank"
        >
          <GitHubSVG/>
        </a>
      </div>
    </>
  )
}
  
export default Footer;
  