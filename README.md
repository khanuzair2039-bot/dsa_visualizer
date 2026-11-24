# DSA Visualizer

An interactive web app that visualizes how common sorting and searching algorithms work, step by step.

**Live Demo:** https://khanuzair2039-bot.github.io/dsa_visualizer/

![Screenshot](screenshot.png)

## Features

- Visualizes sorting algorithms: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort
- Visualizes searching algorithms: Linear Search, Binary Search
- Adjustable animation speed and array size
- Highlights comparisons and swaps in real time
- Shows time and space complexity of the selected algorithm
- Responsive design for desktop and mobile

> Edit this list so it matches exactly what your project does.

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)

## Run Locally

No installation needed.

1. Clone the repository:
   ```bash
   git clone https://github.com/khanuzair2039-bot/dsa_visualizer.git
   ```
2. Open the folder:
   ```bash
   cd dsa_visualizer
   ```
3. Open `index.html` in any browser (double-click it), or use the VS Code **Live Server** extension.

## Project Structure

```
dsa_visualizer/
├── index.html
├── style.css
├── script.js
└── README.md
```

## How It Works

1. Generate a random array of bars.
2. Pick an algorithm and click **Start**.
3. Each step (compare, swap, or placement) is animated with a delay controlled by the speed slider.

## Algorithm Complexity

| Algorithm      | Best       | Average    | Worst      | Space    |
|----------------|------------|------------|------------|----------|
| Bubble Sort    | O(n)       | O(n²)      | O(n²)      | O(1)     |
| Selection Sort | O(n²)      | O(n²)      | O(n²)      | O(1)     |
| Insertion Sort | O(n)       | O(n²)      | O(n²)      | O(1)     |
| Merge Sort     | O(n log n) | O(n log n) | O(n log n) | O(n)     |
| Quick Sort     | O(n log n) | O(n log n) | O(n²)      | O(log n) |
| Linear Search  | O(1)       | O(n)       | O(n)       | O(1)     |
| Binary Search  | O(1)       | O(log n)   | O(log n)   | O(1)     |

## Future Improvements

- Add graph algorithms (BFS, DFS, Dijkstra)
- Add pathfinding grid visualizer
- Add sound effects and dark mode

## Author

**Mohd Uzair**
- GitHub: [@khanuzair2039-bot](https://github.com/khanuzair2039-bot)
- LinkedIn: [Mohd Uzair](https://linkedin.com/in/mohd-uzair-6163a0334)
- Email: uzairkhan6390@gmail.com
