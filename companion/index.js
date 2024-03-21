import * as messaging from "messaging";
import {
  isWatchPairedService,
  registerWatchService,
} from "../services/watchService";

let continuePolling = true;

let watchId,
  watchCode = null;

//check if the watch is paired
async function isPaired() {
  if (watchCode) {
    try {
      const data = await isWatchPairedService(watchCode);
      continuePolling = data === "false" ? true : false;
      console.log("continuePolling:", continuePolling);
    } catch (error) {
      console.error("Failed to check watch pairing:", error);
    }
  }
}

// Register the watch with the server
function getCode(deviceName) {
  const watchType = "FITBIT_WATCH";
  registerWatchService(deviceName, watchType)
    .then((data) => {
      console.log("Watch registered successfully");
      watchId = data.watchId;
      watchCode = data.watchCode;
      console.log("watchCode:", watchCode, "watchId:", watchId);

      // Send the watchCode and data to the device
      const sendDataToDevice = () => {
        if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
          messaging.peerSocket.send({
            watchCode: watchCode,
            watchId: watchId,
            isUserIDNull: continuePolling,
          });
        }
      };

      // Poll every 5 seconds for check if the user is registered for the watch
      sendDataToDevice();
      // isPaired();
      const pollingInterval = setInterval(() => {
        if (continuePolling) {
          isPaired();
        } else {
          sendDataToDevice();
          clearInterval(pollingInterval);
        }
      }, 3000);
    })
    .catch((error) => {
      console.error("Failed to register watch:", error);
    });
}

// Listen for the onopen event from the device
messaging.peerSocket.onmessage = function (evt) {
  if (evt.data) {
    getCode(evt.data.deviceModelName);
  } else {
    console.log("No data");
  }
};
