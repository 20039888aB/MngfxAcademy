from __future__ import annotations

import logging
from typing import Iterable

import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


logger = logging.getLogger(__name__)


def _flatten_related_topics(topics: Iterable[dict]) -> list[dict]:
    results: list[dict] = []
    for topic in topics or []:
        if "Topics" in topic:
            results.extend(_flatten_related_topics(topic.get("Topics") or []))
            continue

        text = topic.get("Text")
        url = topic.get("FirstURL")
        icon = topic.get("Icon", {}).get("URL")
        if text and url:
            results.append(
                {
                    "title": text.split(" - ")[0][:140],
                    "snippet": text,
                    "url": url,
                    "icon": icon,
                }
            )
    return results


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def search(request):
    query = (request.query_params.get("q") or "").strip()
    if not query:
        return Response({"query": query, "results": []})

    params = {
        "q": query,
        "format": "json",
        "no_redirect": 1,
        "no_html": 1,
        "skip_disambig": 1,
    }

    try:
        response = requests.get("https://api.duckduckgo.com/", params=params, timeout=6)
        response.raise_for_status()
        payload = response.json()
    except requests.RequestException as exc:  # pragma: no cover - network failure
        logger.warning("Browser search failed for query '%s': %s", query, exc)
        return Response({"query": query, "results": [], "error": "search_unavailable"}, status=503)

    results = []

    abstract_text = payload.get("AbstractText")
    abstract_url = payload.get("AbstractURL")
    if abstract_text and abstract_url:
        results.append(
            {
                "title": payload.get("Heading") or query,
                "snippet": abstract_text,
                "url": abstract_url,
                "icon": payload.get("Image"),
            }
        )

    related = _flatten_related_topics(payload.get("RelatedTopics") or [])
    results.extend(related)

    if not results and payload.get("Answer"):  # fallback if only answer
        results.append(
            {
                "title": payload.get("Heading") or query,
                "snippet": payload.get("Answer"),
                "url": payload.get("AbstractURL") or "",
                "icon": payload.get("Image"),
            }
        )

    return Response(
        {
            "query": query,
            "results": results[:12],
            "heading": payload.get("Heading"),
        }
    )

