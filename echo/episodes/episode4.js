// Episode 4 — The Camera
window.episode4 = {
  "start": {
    "text": "Your phone camera turns on by itself and points at the window.",
    "choices": [
      {
        "text": "Close the curtains",
        "next": "curtains"
      },
      {
        "text": "Watch the camera feed",
        "next": "feed"
      }
    ]
  },
  "curtains": {
    "text": "The camera shuts off instantly.",
    "choices": []
  },
  "feed": {
    "text": "In the camera feed you see a silhouette standing on the rooftop across the street.",
    "choices": []
  }
};