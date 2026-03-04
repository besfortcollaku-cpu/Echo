// Episode 3 — The Envelope
const episode3 = {
  "start": {
    "text": "The photograph shows your apartment window circled in red ink.",
    "choices": [
      {
        "text": "Look outside",
        "next": "outside"
      },
      {
        "text": "Turn on the TV",
        "next": "tv"
      }
    ]
  },
  "outside": {
    "text": "The red light across the street starts blinking again.",
    "choices": [
      {
        "text": "Watch carefully",
        "next": "watch"
      }
    ]
  },
  "watch": {
    "text": "You think you see someone standing on the rooftop.",
    "choices": []
  },
  "tv": {
    "text": "Static fills the screen. A whisper repeats: 'Too late\u2026 too late\u2026'",
    "choices": []
  }
};