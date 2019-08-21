function characterGenerator() {
  const characterRanges = [[65, 65 + 25], [97, 97 + 25], [48, 48 + 9]];
  return characterRanges.reduce((acc, rangeArray) => {
    const characters = [];
    for (let index = rangeArray[0]; index <= rangeArray[1]; index++) {
      characters.push(String.fromCharCode(index));
    }
    return [...acc, ...characters];
  }, []);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function otpGenerator(length) {
  const characters = characterGenerator();
  const randomChars = [];
  for (let index = 0; index < length; index++) {
    const randomInt = getRandomInt(0, characters.length - 1);
    randomChars.push(characters[randomInt]);
  }
  return randomChars.join('');
}

module.exports = otpGenerator;
