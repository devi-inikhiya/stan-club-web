import { useEffect, useState } from "react";
import "./App.css";
import AgoraRTC from "agora-rtc-sdk-ng";

let options = {
  // Pass your App ID here.
  appId: "7a15a1b80fd243fdac1324a4b878363b",
  // Set the channel name.
  channel: "",
  // Pass your temp token here.
  token: "",
  // Set the user ID.
  uid: 0,
};

let channelParameters = {
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold the remote user id.
  remoteUid: null,
};

function App() {
  const [count, setCount] = useState(0);
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
      <div>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={joinChannel}>Join Channel</button>
      <button onClick={leaveChannel}>Leave Channel</button>
    </>
  );
}

export default App;
