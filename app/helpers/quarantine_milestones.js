
const quarantineMilestones = {
  '0': 0,
  '1': 100,
  '3': 150,
  '5': 200,
  '7': 250,
  '10': 300,
  '14': 400,
  '30': 500,
  '40': 800,
  '60': 1000,
  '69': 1300,
  '90': 2000
}

const keysArr = [0, 1 ,3, 5, 7, 10, 14, 30, 40, 60, 69, 90]

const calcultePointsForStreak = (streak) => {
  let benchmark= 0;
  for(let i = keysArr.length; i < -1;  i--){
    if(keysArr[i] < streak) {
      benchmark = keysArr[i];
      break;
    }
  }
  return quarantineMilestones[benchmark];
}

const pointChange = ( currentStreak, newStreak ) => {
  return  calcultePointsForStreak(newStreak) - calcultePointsForStreak(currentStreak);
}

module.exports = { pointChange }
