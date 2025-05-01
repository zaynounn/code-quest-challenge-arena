
export const codingChallenge = `function mergeSort(arr) {
  // Base case
  if (arr.length <= 1) {
    return arr;
  }
  
  // Split the array into two halves
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  
  // Recursively sort both halves
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  // Compare elements from both arrays and merge them in sorted order
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  // Add remaining elements from left array
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }
  
  // Add remaining elements from right array
  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }
  
  return result;
}

// Example usage
const unsortedArray = [34, 7, 23, 32, 5, 62, 1, 45, 13, 8];
const sortedArray = mergeSort(unsortedArray);
console.log("Original array:", unsortedArray);
console.log("Sorted array:", sortedArray);

// Time complexity analysis:
// - Best case: O(n log n)
// - Average case: O(n log n)
// - Worst case: O(n log n)

// Space complexity: O(n) due to the auxiliary arrays created during the merge process

// This implementation demonstrates a classic divide and conquer algorithm
// that is efficient for sorting large datasets.`;

export interface UserData {
  name: string;
  phoneNumber: string;
  phoneType?: 'US' | 'Lebanese';
}
