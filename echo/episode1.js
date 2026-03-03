const episode1 = {
    start: {
        text: "Your phone vibrates at 2:17 AM. 'If you can read this, you're already involved.'",
        choices: [
            { text: "Open the message", next: null }, // link after initialized
            { text: "Ignore it", next: null }
        ]
    },
    message: {
        text: "A red light blinks outside. 'Now listen carefully.'",
        choices: [
            { text: "Go to the window", next: null }
        ]
    },
    ignore: {
        text: "The message says 'Bad choice.' You must open it.",
        choices: [
            { text: "Open the message", next: null }
        ]
    },
    window: {
        text: "End of Episode 1. Episode 2 is locked.",
        choices: []
    }
};

// Connect choices dynamically
episode1.start.choices[0].next = episode1.message;
episode1.start.choices[1].next = episode1.ignore;
episode1.message.choices[0].next = episode1.window;
episode1.ignore.choices[0].next = episode1.message;