
module.exports = {
  // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  // about 2/3 down the page - look for Addy Osmani
  // given an array - randomly shuffle and return a new array
  shuffle: function (array) {
    var rand, index = -1,
      length = array.length,
      result = Array(length);
    while (++index < length) {
      rand = Math.floor(Math.random() * (index + 1));
      result[index] = result[rand];
      result[rand] = array[index];
    }
    return result;
  }
}
