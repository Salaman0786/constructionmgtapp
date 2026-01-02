let notificationAudio: HTMLAudioElement | null = null;

export const playNotificationSound = () => {
  if (!notificationAudio) {
    notificationAudio = new Audio("/sounds/notification.mp3");
    notificationAudio.volume = 0.6;
  }

  notificationAudio.play().catch(() => {
    // ignored (browser may block without user interaction)
  });
};
