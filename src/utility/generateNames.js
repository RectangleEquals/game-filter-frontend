export default function generateRandomNames(numNames = 50) {
  const names = [
    "John", "Emma", "Michael", "Olivia", "William", "Ava", "James", "Isabella",
    "Oliver", "Sophia", "Benjamin", "Mia", "Elijah", "Charlotte", "Lucas",
    "Amelia", "Henry", "Harper", "Alexander", "Evelyn", "Sebastian", "Abigail",
    "Jack", "Emily", "Jackson", "Elizabeth", "Aiden", "Sofia", "Owen", "Avery",
    "Samuel", "Ella", "Matthew", "Scarlett", "Joseph", "Grace", "Levi", "Chloe",
    "David", "Victoria", "Daniel", "Riley", "Carter", "Aria", "Luke", "Lily",
    "Wyatt", "Aubrey", "Gabriel", "Zoey"
  ];

  const shuffledNames = names.sort(_ => 0.5 - Math.random());
  const selectedNames = shuffledNames.slice(0, Math.min(numNames, names.length));

  return selectedNames;
}