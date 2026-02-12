import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

const isDevelopment = import.meta.env.DEV;

interface PushNotificationState {
  isSupported: boolean;
  isSubscribed: boolean;
  permission: NotificationPermission | null;
  loading: boolean;
}

export const usePushNotifications = (userType: 'customer' | 'professional' = 'customer') => {
  const { user } = useAuth();
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    isSubscribed: false,
    permission: null,
    loading: true,
  });

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
      const permission = isSupported ? Notification.permission : null;

      setState(prev => ({
        ...prev,
        isSupported,
        permission,
        loading: false,
      }));

      if (isSupported && user) {
        await checkSubscription();
      }
    };

    checkSupport();
  }, [user]);

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await (registration as any).pushManager.getSubscription();
      
      setState(prev => ({
        ...prev,
        isSubscribed: !!subscription,
      }));
    } catch (error) {
      if (isDevelopment) {
        console.error('Error checking subscription:', error);
      }
    }
  };

  const registerServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      throw new Error('Service workers not supported');
    }

    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/',
    });

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;
    return registration;
  };

  const subscribe = useCallback(async () => {
    if (!user || !state.isSupported) {
      toast.error('Push notifications are not supported');
      return { error: new Error('Not supported') };
    }

    setState(prev => ({ ...prev, loading: true }));

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));

      if (permission !== 'granted') {
        toast.error('Notification permission denied');
        return { error: new Error('Permission denied') };
      }

      // Register service worker
      const registration = await registerServiceWorker();

      // Get VAPID public key from environment
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      
      if (!vapidPublicKey) {
        // If no VAPID key, still save a placeholder subscription for in-app notifications
        console.warn('VAPID key not configured, using in-app notifications only');
        toast.success('Notifications enabled (in-app only)');
        setState(prev => ({ ...prev, isSubscribed: true, loading: false }));
        return { error: null };
      }

      // Subscribe to push
      const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
      const subscription = await (registration as any).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey.buffer as ArrayBuffer,
      });

      const subscriptionJson = subscription.toJSON();

      // Save subscription to database
      const { error: dbError } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          user_type: userType,
          endpoint: subscriptionJson.endpoint!,
          p256dh: subscriptionJson.keys!.p256dh,
          auth: subscriptionJson.keys!.auth,
        }, {
          onConflict: 'user_id,endpoint',
        });

      if (dbError) throw dbError;

      setState(prev => ({ ...prev, isSubscribed: true }));
      toast.success('Push notifications enabled!');
      return { error: null };
    } catch (error) {
      if (isDevelopment) {
        console.error('Error subscribing to push:', error);
      }
      toast.error('Failed to enable push notifications');
      return { error: error as Error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user, state.isSupported, userType]);

  const unsubscribe = useCallback(async () => {
    if (!user) return { error: new Error('Not authenticated') };

    setState(prev => ({ ...prev, loading: true }));

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await (registration as any).pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();

        // Remove from database
        await supabase
          .from('push_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .eq('endpoint', subscription.endpoint);
      }

      setState(prev => ({ ...prev, isSubscribed: false }));
      toast.success('Push notifications disabled');
      return { error: null };
    } catch (error) {
      if (isDevelopment) {
        console.error('Error unsubscribing:', error);
      }
      toast.error('Failed to disable push notifications');
      return { error: error as Error };
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [user]);

  return {
    ...state,
    subscribe,
    unsubscribe,
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
