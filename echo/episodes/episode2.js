// Episode 2 — The Visitor
window.episode2 = {
  "start": {
    "text": "Three slow knocks echo from your door. Your phone shows a message: 'Do NOT open it.'",
    "choices": [
      {
        "text": "Look through the peephole",
        "next": "peephole"
      },
      {
        "text": "Stay silent",
        "next": "silent"
      }
    ]
  },
  "peephole": {
    "text": "Through the peephole you see a tall man in a dark coat standing perfectly still.",
    "choices": [
      {
        "text": "Open the door",
        "next": "door"
      },
      {
        "text": "Step away quietly",
        "next": "silent"
      }
    ]
  },
  "silent": {
    "text": "The knocking stops. Your phone vibrates: 'Good choice.'",
    "choices": []
  },
  "door": {
    "text": "You open the door. The hallway is empty. On the floor is a small black envelope.",
    "choices": [
      {
        "text": "Pick up the envelope",
        "next": "end"
      }
    ]
  },
  "end": {
    "text": "Inside the envelope is a photograph of your building \u2014 with your window circled in red.",
    "choices": []
  }
};