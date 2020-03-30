
defaultAchievements = require('../data/achievements');

const quarantineMilestones = {
  //days: achievemtId
  '1': 3,
  '3': 4,
  '6': 5,
  '28': 7,
  '69': 8,
}

const awardAcvhievementForStreak = (User, streak) => {
  milestone = Object.keys(quarantineMilestones).find(key => key == streak)
  if (!milestone) return null;
  defaultAchievements.filter(achievement =>  achievement.id == quarantineMilestones[milestone]);
  const achievementsArr = Array.from(...User.achievements).map(a => a.toJSON())
  const achievementIndex = achievementsArr.indexOf(unlockedDefaultAchievement)
  if(achievementIndex > -1){
    User.achievements[achievementIndex].progress = 1;
    User.achievements[achievementIndex].completed = true;
    User.points +=  User.achievements[achievementIndex].points
  }
  return User;
}

module.exports = { awardAcvhievementForStreak }
