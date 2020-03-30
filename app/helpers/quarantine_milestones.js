
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

const awardAcvhievementForStreak = (User, streak) => {
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

module.exports = { awardAcvhievementForStreak }
