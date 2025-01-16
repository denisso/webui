const binarySearch = (array, callback, firstRight = true) => {
  let left = 0;
  let right = array.length - 1;
  let result = -1;
  let counter = 0;
  while (left <= right) {
    counter++;
    const mid = Math.floor((left + right) / 2);
    if (callback(array, mid)) {
      result = mid;
      if (firstRight) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    } else {
      if (firstRight) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
  }
  console.log(`bs did ${counter} calculations in array length ${array.length}`);
  return result;
};

{
  const array = Array.from({ length: 15 }, (_, i) => -5 + i); //[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const index = binarySearch(array, (a, e) => a[e] > 1); // bs did 4 calculations in array length 15
  console.log(array[index]); // 2
}

{
  const array = Array.from({ length: 15 }, (_, i) => -5 + i); //[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const index = binarySearch(array, (a, e) => a[e] < 8, false); // bs did 4 calculations in array length 15
  console.log(array[index]); // 7
}

{
  const array = Array.from({ length: 7 }, (_, i) => (i << 1) | (i < 4 ? 1 : 0)); // [1, 3, 5, 7, 8, 10, 12];
  const index = binarySearch(array, (a, e) => a[e] % 2 === 0); // bs did 3 calculations in array length 7
  console.log(array[index]); // 8
}
