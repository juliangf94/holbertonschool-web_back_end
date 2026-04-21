#!/usr/bin/env python3
"""Module that returns schools having a specific topic."""


def schools_by_topic(mongo_collection, topic):
    return list(mongo_collection.find({"topics": topic}))
