#!/usr/bin/env python3
"""
Module that updates topics of a school document in a MongoDB collection.
"""


def update_topics(mongo_collection, name: str, topics: list) -> None:
    """Change all topics of a school document based on the name."""
    mongo_collection.update_many(
        {"name": name},
        {"$set": {"topics": topics}}
    )
