import React, { createContext, useContext, useState, useEffect, useRef } from "react";

const TimerContext = createContext(null);

export const TimerProvider = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(25 * 60);
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [hasCompleted, setHasCompleted] = useState(false);
  const intervalRef = useRef(null);
  const completionNotifiedRef = useRef(false);

  const playCompletionSound = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.value = 0.08;

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.start();
      oscillator.stop(context.currentTime + 0.6);
    } catch (error) {
      console.error("Failed to play timer sound:", error);
    }
  };

  const notifyTimerComplete = () => {
    try {
      const notificationsEnabled =
        localStorage.getItem("timerNotificationsEnabled") === "true";
      if (!notificationsEnabled) return;
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;

      new Notification("Guidra Timer Complete", {
        body: "Your study session is complete.",
        icon: "/icons/icon-192.png",
        badge: "/icons/icon-192.png",
      });
    } catch (error) {
      console.error("Failed to show timer notification:", error);
    }
  };

  // Main timer loop
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsActive(false);
          
          if (!completionNotifiedRef.current) {
            completionNotifiedRef.current = true;
            setHasCompleted(true);
            playCompletionSound();
            notifyTimerComplete();
            
            // Reset notification flag after 5 seconds
            setTimeout(() => {
              completionNotifiedRef.current = false;
            }, 5000);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive]);

  const startTimer = (minutes) => {
    setSelectedMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setIsActive(true);
    setHasCompleted(false);
    completionNotifiedRef.current = false;
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resumeTimer = () => {
    if (remainingSeconds > 0) {
      setIsActive(true);
    }
  };

  const resetTimer = (minutes) => {
    setIsActive(false);
    setSelectedMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setHasCompleted(false);
    completionNotifiedRef.current = false;
  };

  const setCustomMinutes = (minutes) => {
    if (!isActive) {
      setSelectedMinutes(minutes);
      setRemainingSeconds(minutes * 60);
    }
  };

  return (
    <TimerContext.Provider
      value={{
        isActive,
        remainingSeconds,
        selectedMinutes,
        hasCompleted,
        setHasCompleted,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        setCustomMinutes,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within TimerProvider");
  }
  return context;
};
