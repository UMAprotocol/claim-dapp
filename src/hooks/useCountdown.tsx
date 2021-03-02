import React from "react";

export type Time = string | number | Date;

export function useCountdown(time: Time) {
  const [countdown, setCountdown] = React.useState(timeDifference(time));

  React.useEffect(() => {
    const timer = setTimeout(() => setCountdown(timeDifference(time)), 1000);
    return () => clearTimeout(timer);
  });
  return countdown;
}

type TimeDifferenceOptions = {
  now?: () => number;
};

function timeDifference(time: Time, options: TimeDifferenceOptions = {}) {
  const { now = Date.now } = options;
  let endTimestamp: number;
  if (typeof time === "string") {
    endTimestamp = new Date(time).getTime();
  } else if (typeof time === "number") {
    endTimestamp = time;
  } else if (time instanceof Date) {
    endTimestamp = time.getTime();
  } else {
    throw new Error(
      `You are trying to use timeDifference with an invalid time. You passed ${time}. Time can only be a string a number or a Date.`
    );
  }
  const timeLeft = Math.max(0, endTimestamp - now());

  const totalSeconds = timeLeft / 1000;
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds / 60) % 60);
  const hours = Math.floor((totalSeconds / 3600) % 24);
  const days = Math.floor(totalSeconds / (3600 * 24));

  return {
    timeLeft,
    seconds,
    minutes,
    hours,
    days,
  };
}
