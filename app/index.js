import * as messaging from "messaging";
import * as document from "document";
import * as fs from "fs";
import { today } from "user-activity";
import { geolocation } from "geolocation";
import { me as device } from "device";

const myButton = document.getElementById("myButton");
myButton.text = "Pair with App";

function buttonClicked() {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send({
      deviceModelName: deviceModelName,
    });
  }
}

//send true when the button is clicked
myButton.addEventListener("click", (evt) => {
  buttonClicked();
});

const deviceModelName = device.modelName;

// Listen for the onopen event from the companion
messaging.peerSocket.onmessage = function (evt) {
  const buttonGradient = document.getElementById("buttonGradient");
  const codeScreenGradient = document.getElementById("codeScreenGradient");
  const codeShow = document.getElementById("codeShow");
  // const showText = document.getElementById("showText");

  if (evt.data && evt.data.watchCode && evt.data.watchId) {
    buttonGradient.style.display = "none";
    const watchCode = evt.data.watchCode;
    const watchId = evt.data.watchId;
    const isUserIDNull = evt.data.isUserIDNull;

    let json_data = {
      watchCode: watchCode,
      watchId: watchId,
    };

    if (isUserIDNull === true) {
      //show the code and remove the connect button
      codeScreenGradient.style.display = "inline";
      codeShow.text = watchCode;
      myButton.style.display = "none";
    } else {
      //show loading text for 4 seconds and then show connected message
      codeShow.text = "";
      myButton.style.display = "none";

      // setTimeout(() => {
      //   codeShow.style.display = showText.text = "Device Successfully Paired";
      // }, 4000);
    }
    // // save the watchCode and watchId to a file in the device
    fs.writeFileSync("json.txt", json_data, "json");
    // let json_object = fs.readFileSync("json.txt", "json");
    // console.log("Authenticated code from fs: " + json_object.code);

    // // send the step count and location to the server every 5 seconds
    //   setInterval(() => {
    //     const stepCount = today.adjusted.steps;s

    //     // Request location
    //     geolocation.getCurrentPosition(locationSuccess, locationError);

    //     function locationSuccess(position) {
    //       const location = {
    //         latitude: position.coords.latitude,
    //         longitude: position.coords.longitude,
    //       };
    //       const data = {
    //         code: json_object.code,
    //         stepCount: stepCount !== undefined ? stepCount : null,
    //         location: location,
    //       };
    //       if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    //         messaging.peerSocket.send(data);
    //       }
    //       console.log(
    //         "data: " +
    //           data.code +
    //           " " +
    //           data.stepCount +
    //           " " +
    //           data.location.latitude +
    //           " " +
    //           data.location.longitude
    //       );
    //     }
    //     function locationError(error) {
    //       console.log("Error getting location: " + error.code, error.message);
    //     }
    //   }, 5000);
  }
};
