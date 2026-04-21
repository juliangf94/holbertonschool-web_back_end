#!/usr/bin/env python3
"""
Module that updates topics of a school document in a MongoDB collection.
"""


def update_topics(mongo_collection, name, topics):
    mongo_collection.update_many(
        {"name": name},
        {"$set": {"topics": topics}}
    )
