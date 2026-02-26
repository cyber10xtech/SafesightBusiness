import { useState, useEffect, useCallback } from "react";

interface PermissionStatus {
  notifications: "granted" | "denied" | "default" | "unsupported";
  location: "granted" | "denied" | "prompt" | "unsupported";
  camera: "granted" | "denied" | "prompt" | "unsupported";
  allRequested: boolean;
}

const PERMISSIONS_KEY = "safesight_permissions_requested";

export const usePermissions = () => {
  const [status, setStatus] = useState<PermissionStatus>({
    notifications: "default",
    location: "prompt",
    camera: "prompt",
    allRequested: false,
  });

  const checkPermissions = useCallback(async () => {
    const requested = localStorage.getItem(PERMISSIONS_KEY) === "true";

    let notifStatus: PermissionStatus["notifications"] = "unsupported";
    if ("Notification" in window) {
      notifStatus = Notification.permission;
    }

    let locationStatus: PermissionStatus["location"] = "unsupported";
    let cameraStatus: PermissionStatus["camera"] = "unsupported";

    if ("permissions" in navigator) {
      try {
        const geo = await navigator.permissions.query({ name: "geolocation" });
        locationStatus = geo.state;
      } catch {}

      try {
        const cam = await navigator.permissions.query({ name: "camera" as PermissionName });
        cameraStatus = cam.state;
      } catch {}
    }

    setStatus({
      notifications: notifStatus,
      location: locationStatus,
      camera: cameraStatus,
      allRequested: requested,
    });
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const requestAllPermissions = useCallback(async () => {
    // Notifications
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    // Location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {}, { timeout: 5000 });
    }

    // Camera
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
    } catch {}

    localStorage.setItem(PERMISSIONS_KEY, "true");
    await checkPermissions();
  }, [checkPermissions]);

  return { status, requestAllPermissions };
};
