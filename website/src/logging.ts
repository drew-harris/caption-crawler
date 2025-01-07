import pino from "pino";
export const logger = pino();
import { env } from "./env";

const webhookUrl = env.DISCORD_WEBHOOK;

interface PlaylistSubmission {
  title: string;
  description: string;
  userId: string;
  playlistUrl: string; // YouTube playlist URL
  imageUrl: string; // Playlist thumbnail or image URL
}

export async function alertPlaylistSubmission(
  submission: PlaylistSubmission,
): Promise<void> {
  try {
    const payload = {
      embeds: [
        {
          title: submission.title,
          description: submission.description,
          url: submission.playlistUrl, // Make the embed title clickable with the YouTube playlist URL
          color: 5814783, // Purple shade in decimal format
          fields: [
            {
              name: "User ID",
              value: submission.userId,
              inline: true,
            },
            {
              name: "Date",
              value: new Date().toISOString(),
              inline: true,
            },
          ],
          image: {
            url: submission.imageUrl, // Add the image to the embed
          },
          footer: {
            text: "Playlist Submission Alert",
          },
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log("Webhook alert sent successfully.");
    } else {
      console.warn(
        "Failed to send webhook alert:",
        response.status,
        response.statusText,
      );
    }
  } catch (error) {
    console.error("Error sending webhook alert:", error);
  }
}
