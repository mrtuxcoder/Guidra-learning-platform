import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

const TimerContext = createContext(null);
const TIMER_STORAGE_KEY = "guidra_timer_state";

const loadTimerState = () => {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    if (!raw) {
      return {
        isActive: false,
        remainingSeconds: 25 * 60,
        selectedMinutes: 25,
        endTimestamp: null,
        hasCompleted: false,
      };
    }

    const parsed = JSON.parse(raw);
    const selectedMinutes = Math.max(1, Number(parsed.selectedMinutes) || 25);
    const maxSeconds = selectedMinutes * 60;
    const remainingSeconds = Math.max(
      0,
      Math.min(maxSeconds, Number(parsed.remainingSeconds) || maxSeconds)
    );

    return {
      isActive: Boolean(parsed.isActive),
      remainingSeconds,
      selectedMinutes,
      endTimestamp:
        typeof parsed.endTimestamp === "number" ? parsed.endTimestamp : null,
      hasCompleted: Boolean(parsed.hasCompleted),
    };
  } catch {
    return {
      isActive: false,
      remainingSeconds: 25 * 60,
      selectedMinutes: 25,
      endTimestamp: null,
      hasCompleted: false,
    };
  }
};

export const TimerProvider = ({ children }) => {
  const [initialState] = useState(loadTimerState);

  const [isActive, setIsActive] = useState(initialState.isActive);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialState.remainingSeconds
  );
  const [selectedMinutes, setSelectedMinutes] = useState(
    initialState.selectedMinutes
  );
  const [endTimestamp, setEndTimestamp] = useState(initialState.endTimestamp);
  const [hasCompleted, setHasCompleted] = useState(initialState.hasCompleted);
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

  const completeTimer = useCallback(() => {
    setIsActive(false);
    setEndTimestamp(null);
    setRemainingSeconds(0);

    if (!completionNotifiedRef.current) {
      completionNotifiedRef.current = true;
      setHasCompleted(true);
      playCompletionSound();
      notifyTimerComplete();

      setTimeout(() => {
        completionNotifiedRef.current = false;
      }, 5000);
    }
  }, []);

  const syncFromTimestamp = useCallback(() => {
    if (!endTimestamp) return;

    const nextSeconds = Math.max(
      0,
      Math.ceil((endTimestamp - Date.now()) / 1000)
    );

    if (nextSeconds <= 0) {
      completeTimer();
      return;
    }

    setRemainingSeconds(nextSeconds);
  }, [endTimestamp, completeTimer]);

  useEffect(() => {
    try {
      localStorage.setItem(
        TIMER_STORAGE_KEY,
        JSON.stringify({
          isActive,
          remainingSeconds,
          selectedMinutes,
          endTimestamp,
          hasCompleted,
        })
      );
    } catch {
      // noop
    }
  }, [isActive, remainingSeconds, selectedMinutes, endTimestamp, hasCompleted]);

  useEffect(() => {
    if (isActive && endTimestamp) {
      syncFromTimestamp();
    }
  }, [isActive, endTimestamp, syncFromTimestamp]);

  // Main timer loop
  useEffect(() => {
    if (!isActive || !endTimestamp) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      syncFromTimestamp();
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, endTimestamp, syncFromTimestamp]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isActive && endTimestamp) {
        syncFromTimestamp();
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, endTimestamp, syncFromTimestamp]);

  const startTimer = (minutes) => {
    const normalizedMinutes = Math.max(1, Number(minutes) || 1);
    const totalSeconds = normalizedMinutes * 60;

    setSelectedMinutes(normalizedMinutes);
    setRemainingSeconds(totalSeconds);
    setEndTimestamp(Date.now() + totalSeconds * 1000);
    setIsActive(true);
    setHasCompleted(false);
    completionNotifiedRef.current = false;
  };

  const pauseTimer = () => {
    if (isActive && endTimestamp) {
      const nextSeconds = Math.max(
        0,
        Math.ceil((endTimestamp - Date.now()) / 1000)
      );
      setRemainingSeconds(nextSeconds);
    }
    setIsActive(false);
    setEndTimestamp(null);
  };

  const resumeTimer = () => {
    if (remainingSeconds > 0) {
      setEndTimestamp(Date.now() + remainingSeconds * 1000);
      setIsActive(true);
      setHasCompleted(false);
      completionNotifiedRef.current = false;
    }
  };

  const resetTimer = (minutes) => {
    const normalizedMinutes = Math.max(1, Number(minutes) || 1);
    setIsActive(false);
    setEndTimestamp(null);
    setSelectedMinutes(normalizedMinutes);
    setRemainingSeconds(normalizedMinutes * 60);
    setHasCompleted(false);
    completionNotifiedRef.current = false;
  };

  const setCustomMinutes = (minutes) => {
    if (!isActive) {
      const normalizedMinutes = Math.max(1, Number(minutes) || 1);
      setSelectedMinutes(normalizedMinutes);
      setRemainingSeconds(normalizedMinutes * 60);
      setEndTimestamp(null);
      setHasCompleted(false);
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
