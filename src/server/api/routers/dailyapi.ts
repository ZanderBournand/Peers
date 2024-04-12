import axios, { AxiosResponse } from "axios";

const DAILY_API_BASE_URL = "https://api.daily.co/v1";
const apiKey = "83beff917fdee3e62e0e84304439b6e61b994251345ee213d27e7fe6c42892e4"; // FIXME: Access API key from environment variable

// Define interface for Participant object
interface Participant {
  user_name: string;
  duration: number;
}

class DailyAPI {
  async createRoomForEvent(eventId: string) {
    try {
      if (!apiKey) {
        throw new Error("DAILY_API_KEY is not defined in the environment variables.");
      }

      const roomName = `${eventId}`;
      const truncatedName = roomName.substring(0, 40); // Room name can only be 40 characters

      // Check if the room already exists
      const existingRoom = await this.getRoomByName(truncatedName);
      if (existingRoom) {
        console.log("Room already exists:", existingRoom);
        return existingRoom.url; // Return the existing room URL
      }

      // Create a new room if it doesn't exist
      const expirationTime = Math.floor(Date.now() / 1000) + 3600; // Current time + 1 hour in seconds
      const response = await axios.post(
        `${DAILY_API_BASE_URL}/rooms`,
        {
          name: truncatedName,
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
        }
      );

      console.log("New room created:", response.data);
      return response.data.url; // Return the new room URL
    } catch (error) {
      console.error("Error creating or retrieving room:", error);
      throw new Error("Failed to create or retrieve room");
    }
  }

  async getRoomByName(truncatedName: string) {
    try {
      const response = await axios.get(`${DAILY_API_BASE_URL}/rooms/${truncatedName}`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log(`Room "${truncatedName}" not found.`);
        return null; // Room does not exist
      }
      throw error; // Propagate other errors
    }
  }

  // Add more methods as needed to interact with api
    //Tracking participant data methods

    async getUserMeetingDurations(): Promise<{ [userName: string]: number }> {
      try {
        const response: AxiosResponse<{ total_count: number; data: any[] }> = await axios.get(
          `${DAILY_API_BASE_URL}/meetings`,
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
  
        const userDurations: { [userName: string]: number } = {};
  
        // Process each meeting
        response.data.data.forEach((meeting) => {
          // Process each participant in the meeting
          meeting.participants.forEach((participant: Participant) => {
            if (!userDurations[participant.user_name]) {
              userDurations[participant.user_name] = 0;
            }
            userDurations[participant.user_name] += participant.duration;
          });
        });
  
        return userDurations;
      } catch (error) {
        console.error("Error fetching meetings:", error);
        throw new Error("Failed to fetch meetings");
      }
    }
}

export default DailyAPI;
