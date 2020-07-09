const names = ["Liam", "Emma", "Noah", "Olivia", "William", "Ava", "James", "Isabella", "Oliver", "Sophia", "Benjamin", "Charlotte", "Elijah", "Mia", "Lucas", "Amelia", "Mason", "Harper", "Logan", "Evelyn", "Alexander", "Abigail", "Ethan", "Emily", "Jacob", "Elizabeth", "Michael", "Mila", "Daniel", "Ella", "Henry", "Avery", "Jackson", "Sofia", "Sebastian", "Camila", "Aiden", "Aria", "Matthew", "Scarlett", "Samuel", "Victoria", "David", "Madison", "Joseph", "Luna", "Carter", "Grace", "Owen", "Chloe", "Wyatt", "Penelope", "John", "Layla", "Jack", "Riley", "Luke", "Zoey", "Jayden", "Nora", "Dylan", "Lily", "Grayson", "Eleanor", "Levi", "Hannah", "Isaac", "Lillian", "Gabriel", "Addison", "Julian", "Aubrey", "Mateo", "Ellie", "Anthony", "Stella", "Jaxon", "Natalie", "Lincoln", "Zoe", "Joshua", "Leah", "Christopher", "Hazel", "Andrew", "Violet", "Theodore", "Aurora", "Caleb", "Savannah", "Ryan", "Audrey", "Asher", "Brooklyn", "Nathan", "Bella", "Thomas", "Claire", "Leo", "Skylar", "Isaiah", "Lucy", "Charles", "Paisley", "Josiah", "Everly", "Hudson", "Anna", "Christian", "Caroline", "Hunter", "Nova", "Connor", "Genesis", "Eli", "Emilia", "Ezra", "Kennedy", "Aaron", "Samantha", "Landon", "Maya", "Adrian", "Willow", "Jonathan", "Kinsley", "Nolan", "Naomi", "Jeremiah", "Aaliyah", "Easton", "Elena", "Elias", "Sarah", "Colton", "Ariana", "Cameron", "Allison", "Carson", "Gabriella", "Robert", "Alice", "Angel", "Madelyn", "Maverick", "Cora", "Nicholas", "Ruby", "Dominic", "Eva", "Jaxson", "Serenity", "Greyson", "Autumn", "Adam", "Adeline", "Ian", "Hailey", "Austin", "Gianna", "Santiago", "Valentina", "Jordan", "Isla", "Cooper", "Eliana", "Brayden", "Quinn", "Roman", "Nevaeh", "Evan", "Ivy", "Ezekiel", "Sadie", "Xavier", "Piper", "Jose", "Lydia", "Jace", "Alexa", "Jameson", "Josephine", "Leonardo", "Emery", "Bryson", "Julia", "Axel", "Delilah", "Everett", "Arianna", "Parker", "Vivian", "Kayden", "Kaylee", "Miles", "Sophie", "Sawyer", "Brielle", "Jason", "Madeline"];


const newRandomName = () => {
    let ind = Math.floor(Math.random() * names.length);
    let res = names[ind];
    res += Math.floor(Math.random() * 90 + 10).toString();
    console.log(res);
    return res;
}


module.exports = {
    newRandomName
};