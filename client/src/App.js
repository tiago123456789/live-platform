import { useState } from "react";
import "./assets/style.css"
import Chat from "./components/Chat";
import Header from "./components/Header";
import VideoLive from "./components/VideoLive";


function App() {
  let [viewers, setViewer] = useState([])

  const incrementViewer = (totalViewers) => {
    setViewer(totalViewers)
  }

  return (
    <>
      <Header />
      <section className="container-fluid mt-2">
        <div className="row">
          <VideoLive viewer={viewers} />
          <Chat incrementViewer={incrementViewer} />
        </div>
      </section>
    </>

  );
}

export default App;
