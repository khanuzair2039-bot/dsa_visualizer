// ===== DOM references =====
const barsEl = document.getElementById("bars");
const algoEl = document.getElementById("algo");
const sizeEl = document.getElementById("size");
const speedEl = document.getElementById("speed");
const targetEl = document.getElementById("target");
const targetWrap = document.getElementById("targetWrap");
const generateBtn = document.getElementById("generate");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const statusEl = document.getElementById("status");
const complexityEl = document.getElementById("complexity");

// ===== Algorithm info (shown to the user) =====
const INFO = {
  bubble:    { name: "Bubble Sort",    best: "O(n)",       avg: "O(n²)",      worst: "O(n²)",      space: "O(1)" },
  selection: { name: "Selection Sort", best: "O(n²)",      avg: "O(n²)",      worst: "O(n²)",      space: "O(1)" },
  insertion: { name: "Insertion Sort", best: "O(n)",       avg: "O(n²)",      worst: "O(n²)",      space: "O(1)" },
  merge:     { name: "Merge Sort",     best: "O(n log n)", avg: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
  quick:     { name: "Quick Sort",     best: "O(n log n)", avg: "O(n log n)", worst: "O(n²)",      space: "O(log n)" },
  linear:    { name: "Linear Search",  best: "O(1)",       avg: "O(n)",       worst: "O(n)",       space: "O(1)" },
  binary:    { name: "Binary Search",  best: "O(1)",       avg: "O(log n)",   worst: "O(log n)",   space: "O(1)" },
};
const SEARCHES = ["linear", "binary"];

// ===== State =====
let arr = [];
let stopFlag = false;

class Stopped extends Error {}

// ===== Helpers =====
const bar = (i) => barsEl.children[i];

function sleep() {
  // speed slider: 1 (slow) .. 100 (fast)
  const ms = 405 - Number(speedEl.value) * 4;
  return new Promise((resolve) => setTimeout(resolve, ms)).then(() => {
    if (stopFlag) throw new Stopped();
  });
}

function setValue(i, v) {
  arr[i] = v;
  bar(i).style.height = v + "%";
  bar(i).dataset.v = v;
}

function mark(indices, cls) {
  indices.forEach((i) => bar(i).classList.add(cls));
}

function unmark(indices, cls) {
  indices.forEach((i) => bar(i).classList.remove(cls));
}

async function flash(indices, cls = "compare") {
  mark(indices, cls);
  await sleep();
  unmark(indices, cls);
}

async function swap(i, j) {
  const a = arr[i];
  const b = arr[j];
  setValue(i, b);
  setValue(j, a);
  await flash([i, j], "swap");
}

// ===== Render / generate =====
function render() {
  barsEl.innerHTML = "";
  barsEl.classList.toggle("numbers", arr.length <= 25);
  arr.forEach((v) => {
    const d = document.createElement("div");
    d.className = "bar";
    d.style.height = v + "%";
    d.dataset.v = v;
    barsEl.appendChild(d);
  });
}

function generate() {
  const n = Number(sizeEl.value);
  arr = Array.from({ length: n }, () => Math.floor(Math.random() * 95) + 5);
  render();
  // Pick a value that exists, so the search demo works by default
  targetEl.value = arr[Math.floor(Math.random() * arr.length)];
  statusEl.textContent = "Ready. Pick an algorithm and press Start.";
}

function showInfo() {
  const a = INFO[algoEl.value];
  complexityEl.innerHTML =
    `<b>${a.name}</b> · Best: ${a.best} · Average: ${a.avg} · Worst: ${a.worst} · Space: ${a.space}`;
  targetWrap.classList.toggle("hidden", !SEARCHES.includes(algoEl.value));
}

function setRunning(running) {
  startBtn.disabled = running;
  generateBtn.disabled = running;
  sizeEl.disabled = running;
  algoEl.disabled = running;
  targetEl.disabled = running;
  stopBtn.disabled = !running;
}

// ===== Sorting algorithms =====
async function bubbleSort() {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      await flash([j, j + 1], "compare");
      if (arr[j] > arr[j + 1]) {
        await swap(j, j + 1);
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}

async function selectionSort() {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let min = i;
    for (let j = i + 1; j < n; j++) {
      await flash([j, min], "compare");
      if (arr[j] < arr[min]) min = j;
    }
    if (min !== i) await swap(i, min);
  }
}

async function insertionSort() {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      await flash([j, j + 1], "compare");
      setValue(j + 1, arr[j]);
      j--;
    }
    setValue(j + 1, key);
    await flash([j + 1], "swap");
  }
}

async function mergeSort(l, r) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  await mergeSort(l, m);
  await mergeSort(m + 1, r);

  const left = arr.slice(l, m + 1);
  const right = arr.slice(m + 1, r + 1);
  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) setValue(k++, left[i++]);
    else setValue(k++, right[j++]);
    await flash([k - 1], "swap");
  }
  while (i < left.length) {
    setValue(k++, left[i++]);
    await flash([k - 1], "swap");
  }
  while (j < right.length) {
    setValue(k++, right[j++]);
    await flash([k - 1], "swap");
  }
}

async function quickSort(lo, hi) {
  if (lo >= hi) return;
  const pivot = arr[hi];
  mark([hi], "pivot");
  let i = lo;
  for (let j = lo; j < hi; j++) {
    await flash([j], "compare");
    if (arr[j] < pivot) {
      if (i !== j) await swap(i, j);
      i++;
    }
  }
  if (i !== hi) await swap(i, hi);
  unmark([hi], "pivot");
  await quickSort(lo, i - 1);
  await quickSort(i + 1, hi);
}

// ===== Searching algorithms =====
async function linearSearch(t) {
  for (let i = 0; i < arr.length; i++) {
    await flash([i], "compare");
    if (arr[i] === t) {
      mark([i], "found");
      return i;
    }
  }
  return -1;
}

async function binarySearch(t) {
  let lo = 0;
  let hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    for (let i = 0; i < arr.length; i++) {
      bar(i).classList.toggle("dim", i < lo || i > hi);
    }
    await flash([mid], "compare");
    if (arr[mid] === t) {
      mark([mid], "found");
      return mid;
    }
    if (arr[mid] < t) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

async function finishSweep() {
  for (let i = 0; i < arr.length; i++) {
    bar(i).classList.add("sorted");
    await new Promise((r) => setTimeout(r, 15));
  }
}

// ===== Start button =====
async function start() {
  const algo = algoEl.value;
  const isSearch = SEARCHES.includes(algo);
  const t = Number(targetEl.value);

  if (isSearch && (!Number.isInteger(t) || t < 1 || t > 100)) {
    statusEl.textContent = "Enter a whole-number target between 1 and 100.";
    return;
  }

  stopFlag = false;
  setRunning(true);
  [...barsEl.children].forEach((b) => (b.className = "bar"));

  try {
    if (algo === "binary") {
      arr.sort((a, b) => a - b);
      render();
      statusEl.textContent = "Binary Search needs a sorted array, so the array was sorted first. Searching...";
    } else {
      statusEl.textContent = `Running ${INFO[algo].name}...`;
    }

    if (algo === "bubble") await bubbleSort();
    else if (algo === "selection") await selectionSort();
    else if (algo === "insertion") await insertionSort();
    else if (algo === "merge") await mergeSort(0, arr.length - 1);
    else if (algo === "quick") await quickSort(0, arr.length - 1);
    else if (algo === "linear" || algo === "binary") {
      const idx = algo === "linear" ? await linearSearch(t) : await binarySearch(t);
      statusEl.textContent =
        idx >= 0 ? `Found ${t} at index ${idx}.` : `${t} is not in the array.`;
      return;
    }

    await finishSweep();
    statusEl.textContent = `${INFO[algo].name} complete.`;
  } catch (e) {
    if (e instanceof Stopped) statusEl.textContent = "Stopped.";
    else throw e;
  } finally {
    setRunning(false);
  }
}

// ===== Events =====
generateBtn.addEventListener("click", generate);
sizeEl.addEventListener("input", generate);
algoEl.addEventListener("change", showInfo);
startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", () => (stopFlag = true));

// ===== Init =====
generate();
showInfo();
