
import {
  ListOrdered,
  Network,
  GitGraph,
  Users,
  Maximize2,
  Layers,
  SearchCode,
  LinkIcon,
  Brain,
  ArrowUpNarrowWide,
  Undo2,
  Waypoints,
  LineChart,
  AppWindow,
  Sparkles,
  StretchHorizontal,
  Binary,
  Calculator,
  FileText,
} from 'lucide-react';
import type { Category, TopicDifficulty } from './types';

// Add iconName to initial data for proper serialization and dynamic icon loading
export const initialCategoriesData: Omit<Category, 'icon'>[] & { iconName: string }[] = [
  {
    id: 'arrays-hashing',
    name: 'Arrays & Hashing',
    iconName: 'ListOrdered',
    topics: [
      { id: 'ah-1', name: 'Contains Duplicate', description: 'Check for duplicates in an array.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'ah-2', name: 'Valid Anagram', description: 'Determine if two strings are anagrams.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'ah-3', name: 'Two Sum', description: 'Find two numbers that sum to a target.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'ah-4', name: 'Group Anagrams', description: 'Group anagrams together from a list of strings.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    iconName: 'Users',
    topics: [
      { id: 'tp-1', name: 'Valid Palindrome', description: 'Check if a string is a palindrome.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'tp-2', name: '3Sum', description: 'Find triplets that sum to zero.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'tp-3', name: 'Container With Most Water', description: 'Find container with most water.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    iconName: 'Maximize2',
    topics: [
      { id: 'sw-1', name: 'Best Time to Buy and Sell Stock', description: 'Maximize profit from stock sales.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'sw-2', name: 'Longest Substring Without Repeating Characters', description: 'Find the longest substring without repeats.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'stack',
    name: 'Stack',
    iconName: 'Layers',
    topics: [
      { id: 'st-1', name: 'Valid Parentheses', description: 'Check for valid parentheses.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'st-2', name: 'Min Stack', description: 'Design a stack supporting min operation.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'binary-search',
    name: 'Binary Search',
    iconName: 'SearchCode',
    topics: [
      { id: 'bs-1', name: 'Search a 2D Matrix', description: 'Search in a sorted 2D matrix.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'bs-2', name: 'Koko Eating Bananas', description: 'Find minimum eating speed.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    iconName: 'LinkIcon',
    topics: [
      { id: 'll-1', name: 'Reverse Linked List', description: 'Reverse a singly linked list.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'll-2', name: 'Merge Two Sorted Lists', description: 'Merge two sorted linked lists.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'trees',
    name: 'Trees',
    iconName: 'Network',
    topics: [
      { id: 'tr-1', name: 'Invert Binary Tree', description: 'Invert a binary tree.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'tr-2', name: 'Maximum Depth of Binary Tree', description: 'Find the max depth of a binary tree.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'tr-3', name: 'Binary Tree Level Order Traversal', description: 'Traverse tree level by level.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'tries',
    name: 'Tries',
    iconName: 'Brain',
    topics: [
      { id: 'tries-1', name: 'Implement Trie (Prefix Tree)', description: 'Implement a Trie data structure.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'tries-2', name: 'Design Add and Search Words Data Structure', description: 'Design a word dictionary.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'heap-priority-queue',
    name: 'Heap / Priority Queue',
    iconName: 'ArrowUpNarrowWide',
    topics: [
      { id: 'hpq-1', name: 'Kth Largest Element in a Stream', description: 'Find Kth largest element.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'hpq-2', name: 'Find Median from Data Stream', description: 'Find median from a stream of numbers.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Hard' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    iconName: 'Undo2',
    topics: [
      { id: 'bt-1', name: 'Subsets', description: 'Generate all subsets of a set.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'bt-2', name: 'Combination Sum', description: 'Find combinations that sum to target.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'graphs',
    name: 'Graphs',
    iconName: 'GitGraph',
    topics: [
      { id: 'gr-1', name: 'Number of Islands', description: 'Count islands in a grid.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'gr-2', name: 'Clone Graph', description: 'Clone an undirected graph.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'gr-3', name: 'Course Schedule', description: 'Check if courses can be finished.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
   {
    id: 'advanced-graphs',
    name: 'Advanced Graphs',
    iconName: 'Waypoints',
    topics: [
      { id: 'ag-1', name: 'Network Delay Time', description: 'Calculate network delay time (Dijkstra).', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'ag-2', name: 'Min Cost to Connect All Points', description: 'Find min cost using MST (Prim/Kruskal).', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Hard' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: '1d-dp',
    name: '1-D Dynamic Programming',
    iconName: 'LineChart',
    topics: [
      { id: '1dp-1', name: 'Climbing Stairs', description: 'Count ways to climb stairs.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: '1dp-2', name: 'House Robber', description: 'Maximize loot from robbing houses.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: '2d-dp',
    name: '2-D Dynamic Programming',
    iconName: 'AppWindow',
    topics: [
      { id: '2dp-1', name: 'Unique Paths', description: 'Count unique paths in a grid.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: '2dp-2', name: 'Longest Common Subsequence', description: 'Find the LCS of two strings.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'greedy',
    name: 'Greedy',
    iconName: 'Sparkles',
    topics: [
      { id: 'greedy-1', name: 'Jump Game', description: 'Determine if you can reach the end.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'greedy-2', name: 'Gas Station', description: 'Find if a circular tour is possible.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'intervals',
    name: 'Intervals',
    iconName: 'StretchHorizontal',
    topics: [
      { id: 'int-1', name: 'Merge Intervals', description: 'Merge overlapping intervals.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'int-2', name: 'Insert Interval', description: 'Insert a new interval and merge.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'bit-manipulation',
    name: 'Bit Manipulation',
    iconName: 'Binary',
    topics: [
      { id: 'bm-1', name: 'Counting Bits', description: 'Count set bits for numbers up to n.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
      { id: 'bm-2', name: 'Reverse Bits', description: 'Reverse bits of an integer.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Easy' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
  {
    id: 'math-geometry',
    name: 'Math & Geometry',
    iconName: 'Calculator',
    topics: [
      { id: 'mg-1', name: 'Rotate Image', description: 'Rotate an N x N matrix by 90 degrees.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
      { id: 'mg-2', name: 'Spiral Matrix', description: 'Traverse matrix in spiral order.', completed: false, markedForRevision: false, iconName: 'FileText', solutionCode: '', difficulty: 'Medium' as TopicDifficulty, notes: '', companies: [] },
    ],
  },
];

