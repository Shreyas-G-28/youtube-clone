import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { YOUTUBE_VIDEO_API } from "../utils/constants";
import { addVideos, saveVidoes } from "../utils/videoSlice";
import ButtonList from "./ButtonList";
import VideoCard from "./VideoCard";
import Shimmer from "./Shimmer";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [y, setY] = useState(0);
  
  const savedVideos = useSelector((store) => store.video.videos);
  const dispatch = useDispatch();

  useEffect(() => {
    getVideos();
  }, []);

  const handleNavigation = useCallback(() => {

    if (y < window.scrollY) {
      // scrolling down
      dispatch(addVideos(videos))
    }
    setY(window.scrollY)

  }, [y]);

  useEffect(() => {

    window.addEventListener("scroll", handleNavigation);

    return () => {
      window.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation]);


  const getVideos = async () => {
    const data = await fetch(YOUTUBE_VIDEO_API);
    const jsonData = await data.json();
    const responsePresent =
      jsonData.items.length > 0
        ? true
        : false;
    responsePresent && dispatch(saveVidoes(jsonData.items))
    responsePresent && setVideos(jsonData.items)
  }

  if (savedVideos.length === 0) return <Shimmer />

  return (
    <div data-testid="video-container">
      <ButtonList />
      <div data-testid="video-result" className="flex flex-wrap justify-center">
        {savedVideos.map((video, index) => {
          return (
            <Link key={video.id + index} to={'watch?v=' + video.id}>
              <VideoCard info={video} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default VideoContainer;