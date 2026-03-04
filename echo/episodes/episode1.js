// Episode 1 — 2:17 AM
const episode1 = {
  "start": {
    "text": "Your phone vibrates at 2:17 AM. A message appears: 'If you can read this, you're already involved.' Another message follows: 'Look outside.'",
    "choices": [
      {
        "text": "Open the message thread",
        "next": "message"
      },
      {
        "text": "Ignore it",
        "next": "ignore"
      }
    ]
  },
  "message": {
    "text": "Across the street, a red light blinks on top of a dark building. A message appears: 'Do you see the red light?'",
    "choices": [
      {
        "text": "Go to the window",
        "next": "window"
      },
      {
        "text": "Reply: Who is this?",
        "next": "reply"
      }
    ]
  },
  "ignore": {
    "text": "You lock the phone. It vibrates again. 'Ignoring this will not help you. Look outside.'",
    "choices": [
      {
        "text": "Open the message thread",
        "next": "message"
      }
    ]
  },
  "reply": {
    "text": "Your message deletes itself. A new one appears: 'Don't reply. Just listen.'",
    "choices": [
      {
        "text": "Go to the window",
        "next": "window"
      }
    ]
  },
  "window": {
    "text": "The red light suddenly stops blinking. Your phone vibrates: 'They know you saw it.' At that moment, someone knocks on your door.",
    "choices": []
  }
};