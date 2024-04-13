import axios, { AxiosResponse } from "axios";

const DAILY_API_BASE_URL = "https://api.daily.co/v1";
const apiKey = process.env.DAILY_API_KEY;

// Interface for Participant object
interface Participant {
  user_name: string;
  duration: number;
}

class DailyAPI {
  async createRoomForEvent(eventId: string): Promise<string> {
    try {
      if (!apiKey) {
        throw new Error(
          "DAILY_API_KEY is not defined in the environment variables.",
        );
      }

      const roomName = eventId.substring(0, 40); // Room name can only be 40 characters

      // Check if the room already exists
      const existingRoom = await this.getRoomByName(roomName);
      if (existingRoom) {
        console.log("Room already exists:", existingRoom);
        return existingRoom.url; // Return the existing room URL
      }

      // Create a new room if it doesn't exist
      const expirationTime = Math.floor(Date.now() / 1000) + 10800; // Current time + 3 hours in seconds
      const response: AxiosResponse<any> = await axios.post(
        `${DAILY_API_BASE_URL}/rooms`,
        {
          name: roomName,
          privacy: "public",
          properties: {
            exp: expirationTime,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      console.log("New room created:", response.data);
      return response.data.url; // new room URL
    } catch (error) {
      console.error("Error creating or retrieving room:", error);
      throw new Error("Failed to create or retrieve room");
    }
  }

  async getRoomByName(truncatedName: string): Promise<any | null> {
    try {
      const response: AxiosResponse<any> = await axios.get(
        `${DAILY_API_BASE_URL}/rooms/${truncatedName}`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(`Room "${truncatedName}" not found.`);
        return null; // Room does not exist
      }
      throw error; // Propagate other errors
    }
  }

  async getUserMeetingDurations(): Promise<{ [userName: string]: number }> {
    try {
      const response: AxiosResponse<any> = await axios.get(
        `${DAILY_API_BASE_URL}/meetings`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        },
      );

      const userDurations: { [userName: string]: number } = {};

      // Process each meeting and calculate total duration for each user
      response.data.data.forEach((meeting: any) => {
        meeting.participants.forEach((participant: Participant) => {
          const { user_name, duration } = participant;
          if (!userDurations[user_name]) {
            userDurations[user_name] = 0;
          }
          userDurations[user_name] += duration;
        });
      });

      console.log("Meeting Info Response:", userDurations);
      return userDurations;
    } catch (error) {
      console.error("Error fetching meeting durations:", error);
      throw new Error("Failed to fetch meeting durations");
    }
  }
}

export default DailyAPI;