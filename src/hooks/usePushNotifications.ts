// FILE: src/hooks/usePushNotifications.ts

import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { supabase } from "@/integrations/supabase/client"; // Import your Supabase client

/**
 * Call this function AFTER a user successfully signs in.
 * It asks for permission, gets the token, and saves it to Supabase.
 */
export const registerDeviceForNotifications = async (userId: string) => {
  if (Capacitor.getPlatform() === "web") {
    return; // Not on a native app, so we stop.
  }

  try {
    // 1. Ask user for permission
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === "prompt") {
      permStatus = await PushNotifications.requestPermissions();
    }

    // 2. Stop if permission is denied
    if (permStatus.receive !== "granted") {
      console.warn("User denied push permissions.");
      return;
    }

    // 3. Register the device with Apple/Google
    await PushNotifications.register();

    // 4. Listen for the unique token
    PushNotifications.addListener("registration", async (token) => {
      console.log("Push registration success, token:", token.value);

      // 5. Save the token to the user's profile in Supabase
      const { error } = await supabase
        .from("profiles") // ⚠️ IMPORTANT: Change 'profiles' to your user table name!
        .update({ push_token: token.value }) // ⚠️ IMPORTANT: Make sure you have a 'push_token' column
        .eq("id", userId);

      if (error) {
        console.error("Error saving push token to Supabase:", error);
      }
    });

    // Add a listener for errors
    PushNotifications.addListener("registrationError", (err) => {
      console.error("Push registration error:", err);
    });
  } catch (error) {
    console.error("Error registering for push notifications:", error);
  }
};

/**
 * Call this function BEFORE a user signs out.
 * It finds the user's token and deletes it from Supabase.
 */
export const unregisterDeviceForNotifications = async (userId: string) => {
  if (Capacitor.getPlatform() === "web" || !userId) {
    return; // Not on a native app or no user
  }

  try {
    // Set the push_token to null in Supabase
    const { error } = await supabase
      .from("profiles") // ⚠️ IMPORTANT: Change 'profiles' to your user table name!
      .update({ push_token: null })
      .eq("id", userId);

    if (error) {
      console.error("Error deleting push token from Supabase:", error);
    }
  } catch (error) {
    console.error("Error unregistering device:", error);
  }
};
