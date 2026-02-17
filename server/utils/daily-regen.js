const DAILY_REGEN_LIMIT = 6;

const getNextMidnight = (fromDate = new Date()) => {
  const next = new Date(fromDate);
  next.setHours(24, 0, 0, 0);
  return next;
};

const ensureDailyRegenWindow = (user, now = new Date()) => {
  if (!user.regenDailyResetAt || now >= user.regenDailyResetAt) {
    user.regenDailyCount = 0;
    user.regenDailyResetAt = getNextMidnight(now);
  }

  return user;
};

const getDailyRegenRemaining = (user) => {
  const used = Number(user.regenDailyCount || 0);
  return Math.max(0, DAILY_REGEN_LIMIT - used);
};

module.exports = {
  DAILY_REGEN_LIMIT,
  ensureDailyRegenWindow,
  getDailyRegenRemaining,
  getNextMidnight,
};
