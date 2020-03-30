
defaultAchievements = require('../data/achievements');

const quarantineMilestones = {
  //days: achievemtId
  '1': 2,
  '2': 3,
  '4': 4,
  '7': 5,
  '29': 7,
  '70': 8,
}

const breachesMilestones = {
  '1': 10,
  '5': 24,
}

const awardAchievementForStreak = (User, streak) => {
  milestone = Object.keys(quarantineMilestones).find(key => key == streak)
  if (!milestone) return null;
  const achievementId = quarantineMilestones[milestone];
  for(let i = 0; i < User.achievements.length; i++){
    if(User.achievements[i].id == achievementId && User.achievements[i].completed == false){
      User.achievements[i].progress = 1;
      User.achievements[i].completed = true;
      User.points +=  User.achievements[i].points;
      User.markModified('achievements');
      break;
    }
  }
}

const awardAchievementForBreaches = (user) => {
  milestone = Object.keys(breachesMilestones).find(key => key == user.numBreachesDismissed)
  if (!milestone) return null;
  const achievementId = breachesMilestones[milestone];
  for (let i = 0; i < user.achievements.length; i++) {
    if (user.achievements[i].id == achievementId && user.achievements[i].completed == false) {
      user.achievements[i].progress = 1;
      user.achievements[i].completed = true;
      user.points +=  user.achievements[i].points;
      user.markModified('achievements');
      break;
    }
  }
}

module.exports = { awardAchievementForStreak, awardAchievementForBreaches }
