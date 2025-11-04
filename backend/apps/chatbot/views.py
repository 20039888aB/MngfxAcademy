from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["POST"])
@permission_classes([AllowAny])
def query_bot(request):
    text = request.data.get("message", "").strip().lower()
    if not text:
        return Response({"reply": "Please send a question."})

    if "course" in text or "lesson" in text:
        reply = "You can view available courses at /api/courses/. Which level do you want? beginner/intermediate/advanced?"
    elif any(greeting in text for greeting in ("hello", "hi")):
        reply = "Hi — I am the MngFX helper. Ask me about course content, indicators, or market data."
    else:
        reply = f"[bot placeholder] I got: {text}. Soon I will query course content and docs."

    return Response({"reply": reply})

