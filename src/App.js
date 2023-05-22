import { useEffect, useState } from "react";
import "./App.css";
import AgoraRTC from "agora-rtc-sdk-ng";

let channelParameters = {
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold the remote user id.
  remoteUid: null,
};

function App() {
  const [channel, setchannel] = useState("");
  const [token, settoken] = useState("");
  const [uid, setuid] = useState(0);
  const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

  async function startBasicCall() {
    // Create an instance of the Agora Engine

    // Listen for the "user-published" event to retrieve an AgoraRTCRemoteUser object.
    agoraEngine.on("user-published", async (user, mediaType) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event.
      await agoraEngine.subscribe(user, mediaType);
      console.log("subscribe success");

      // Subscribe and play the remote audio track.
      if (mediaType == "audio") {
        channelParameters.remoteUid = user.uid;
        // Get the RemoteAudioTrack object from the AgoraRTCRemoteUser object.
        channelParameters.remoteAudioTrack = user.audioTrack;
        // Play the remote audio track.
        channelParameters.remoteAudioTrack.play();
      }

      // Listen for the "user-unpublished" event.
      agoraEngine.on("user-unpublished", (user) => {
        console.log(user.uid + "has left the channel");
      });
    });
  }

  useEffect(() => {
    startBasicCall();
  }, []);

  const joinChannel = async () => {
    let options = {
      // Pass your App ID here.
      appId: "7a15a1b80fd243fdac1324a4b878363b",
      // Set the channel name.
      channel: channel,
      // Pass your temp token here.
      token: token,
      // Set the user ID.
      uid: uid,
    };
    console.log(options);
    await agoraEngine.join(
      options.appId,
      options.channel,
      options.token,
      options.uid
    );
    console.log("join channel");
    channelParameters.localAudioTrack =
      await AgoraRTC.createMicrophoneAudioTrack();
    // Publish the local audio track in the channel.
    await agoraEngine.publish(channelParameters.localAudioTrack);
  };

  const leaveChannel = async () => {
    // Destroy the local audio track.
    await agoraEngine.leave();
    // Destroy the local audio track.
  };

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "column",
        background:'aqua',
        width:'100%',
        maxWidth:'500px',
      }}
      >
        <input type="text" style={{
          margin:'10px',
          padding:'10px', 
          border:"none",
        }} 
        placeholder="channel name"
         onChange={(e) => setchannel(e.target.value)} />
        <input type="text" style={{ 
          margin:'10px',  
          padding:'10px', 
          border:"none",  
        }}
          placeholder="token"
          onChange={(e) => settoken(e.target.value)}  
        />  
        <input type="text" style={{ 
          margin:'10px',  
          padding:'10px', 
          border:"none",  
        }}  
          placeholder="uid"   
          onChange={(e) => setuid(e.target.value)}  
        />  


        <button onClick={joinChannel} style={{
          margin:'10px',
          padding:'10px', 
          border:"none",  
        }}
        >Join Channel</button>
        <button onClick={leaveChannel}>Leave Channel</button>
      </div>
    </>
  );
}

export default App;
