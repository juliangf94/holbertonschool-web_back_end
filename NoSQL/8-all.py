#!/usr/bin/env python3
"""Module that lists all documents in a MongoDB collection."""


def list_all(mongo_collection):
    """
    Return a list of all documents in the collection.
    """
    documents = list(mongo_collection.find())
    if not documents:
        return []
    return documents
