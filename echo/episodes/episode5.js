// Episode 5 — The Signal
const episode5 = {
  "start": {
    "text": "Your phone displays a strange signal meter climbing rapidly.",
    "choices": [
      {
        "text": "Turn airplane mode on",
        "next": "airplane"
      },
      {
        "text": "Trace the signal",
        "next": "trace"
      }
    ]
  },
  "airplane": {
    "text": "The signal disappears\u2026 then slowly returns.",
    "choices": []
  },
  "trace": {
    "text": "The signal source points directly to the building across the street.",
    "choices": []
  }
};