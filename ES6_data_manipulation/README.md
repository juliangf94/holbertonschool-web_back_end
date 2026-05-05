# ES6 Data Manipulation

## Description

This project covers ES6 array and data structure manipulation in JavaScript. Each task applies methods like `map`, `filter`, `reduce`, and data structures like `Set`, `Map`, and `WeakMap` to work with lists of objects.

## Learning Objectives

- How to use `map`, `filter`, and `reduce` on arrays
- Typed arrays
- The `Set`, `Map`, and `WeakMap` data structures

## Requirements

- NodeJS 20.x
- All files use `.js` extension
- ESLint with airbnb-base config
- Jest for testing

## Setup

```bash
npm install
```

## Run files

```bash
npm run dev <filename>
```

## Test and lint

```bash
npm run test
npm run full-test
```

## Tasks

| File | Description |
|------|-------------|
| `0-get_list_students.js` | Returns an array of student objects with `id`, `firstName`, and `location` |
| `1-get_list_student_ids.js` | Returns an array of student ids using `map`. Returns `[]` if argument is not an array |
| `2-get_students_by_loc.js` | Filters students by city using `filter` |
| `3-get_ids_sum.js` | Returns the sum of all student ids using `reduce` |
| `4-update_grade_by_city.js` | Combines `filter` and `map` to return students of a city with updated grades |
| `5-typed_arrays.js` | Creates an `ArrayBuffer` with an `Int8` value at a specific position using `DataView` |
| `6-set.js` | Returns a `Set` from an array |
| `7-has_array_values.js` | Returns a boolean if all array elements exist in a `Set` using `every` |
| `8-clean_set.js` | Returns a string of `Set` values that start with a given prefix, with the prefix removed |
| `9-groceries_list.js` | Returns a `Map` of groceries with name and quantity |
| `10-update_uniq_items.js` | Updates all `Map` entries with quantity `1` to `100` using `forEach` |

## Author

Julian Gonzalez Fernandez
