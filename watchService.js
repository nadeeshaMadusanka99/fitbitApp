import { BACKEND_URL } from "./env";

export async function registerWatch(deviceName, watchType) {
  const url = `${BACKEND_URL}/watch/register-watch`;

  const requestBody = {
    modelName: deviceName,
    watchType: watchType,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    // console.log("response", await response.json());
    if (!response.ok) {
      throw new Error("Failed to register watch");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error registering watch:", error);
    throw error;
  }
}

export async function isPaired(watchCode) {
  const url = `${BACKEND_URL}/watch/is-ready?watchCode=${watchCode}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to check watch readiness");
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error checking watch readiness:", error);
    throw error;
  }
}
