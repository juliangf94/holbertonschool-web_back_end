# NoSQL

## Description

This project introduces NoSQL databases with a focus on MongoDB. It covers the differences between SQL and NoSQL, CRUD operations using the MongoDB shell, and Python interaction with MongoDB using the PyMongo library.

## Learning Objectives

- What NoSQL means and how it differs from SQL
- What ACID properties are
- What document storage is
- The different NoSQL types
- The benefits of a NoSQL database
- How to query, insert, update, and delete documents in MongoDB
- How to use PyMongo to interact with MongoDB from Python

## Requirements

- MongoDB 4.4
- Python 3.9
- PyMongo 4.8.0
- Ubuntu 20.04 LTS
- pycodestyle 2.5.*
- All Python functions must be type-annotated
- All modules and functions must have documentation

## Files

| File | Description |
|---|---|
| `0-list_databases` | List all databases |
| `1-use_or_create_database` | Create or use the database `my_db` |
| `2-insert` | Insert a document into the `school` collection |
| `3-all` | List all documents in the `school` collection |
| `4-match` | List all documents with `name="Holberton school"` |
| `5-count` | Count documents in the `school` collection |
| `6-update` | Add attribute `address` to documents with `name="Holberton school"` |
| `7-delete` | Delete all documents with `name="Holberton school"` |
| `8-all.py` | Python function to list all documents in a collection |
| `9-insert_school.py` | Python function to insert a new document |
| `10-update_topics.py` | Python function to update a school's topics |
| `11-schools_by_topic.py` | Python function to return schools by topic |
| `12-log_stats.py` | Script to display stats from Nginx logs stored in MongoDB |

## Usage

### Start MongoDB
```bash
sudo systemctl start mongod
```

### Run shell scripts
```bash
cat <file> | mongo my_db
```

### Run Python scripts
```bash
python3 <file>
```

## Author

Julian Gonzalez Florez
