window.romance1_ep1 = {

start:{
text:"Your phone vibrates at 11:48 PM. A message from an unknown number appears: 'Hey… are you still awake?'",
choices:[
{ text:"Reply: Who is this?", next:"who" },
{ text:"Ignore the message", next:"ignore" }
]
},

who:{
text:"The reply comes instantly. 'Sorry! I think I texted the wrong person… but since you're here, how was your day?'",
choices:[
{ text:"Tell them about your day", next:"talk" },
{ text:"Ask their name", next:"name" }
]
},

ignore:{
text:"You try to ignore it, but another message appears: 'Okay… maybe wrong number. But I hope whoever reads this had a good day.'",
choices:[
{ text:"Reply anyway", next:"who" }
]
},

name:{
text:"They reply: 'My name is Alex. And you?'",
choices:[
{ text:"Tell them your name", next:"talk" }
]
},

talk:{
text:"You end up texting for an hour. At the end Alex writes: 'This might sound weird… but I feel like we should meet someday.'",
choices:[]
}

};

window.romance1_ep2 = {

start:{
text:"The next morning Alex sends another message: 'There's a small café downtown. Want to meet there tonight?'",
choices:[
{ text:"Accept the invitation", next:"accept" },
{ text:"Ask for a video call first", next:"call" }
]
},

accept:{
text:"Alex replies with a smiling emoji. '7 PM then. I'll be the one with a blue jacket.'",
choices:[
{ text:"Go to the café", next:"cafe" }
]
},

call:{
text:"You start a video call. Alex smiles nervously. 'See? I'm real.'",
choices:[
{ text:"Agree to meet", next:"cafe" }
]
},

cafe:{
text:"At the café, Alex looks exactly like the person from the call. 'I'm glad you came.'",
choices:[
{ text:"Sit down and talk", next:"talk" }
]
},

talk:{
text:"You talk for hours. Before leaving Alex says: 'Can I see you again?'",
choices:[]
}

};

window.romance1_ep3 = {

start:{
text:"A week later you and Alex walk through a quiet park at sunset.",
choices:[
{ text:"Hold Alex's hand", next:"hand" },
{ text:"Make a joke", next:"joke" }
]
},

hand:{
text:"Alex smiles and squeezes your hand gently.",
choices:[
{ text:"Ask about the future", next:"future" }
]
},

joke:{
text:"Alex laughs. 'You're even funnier in person.'",
choices:[
{ text:"Walk closer", next:"future" }
]
},

future:{
text:"Alex looks at you seriously. 'Funny how a wrong number brought us here.'",
choices:[
{ text:"Kiss Alex", next:"end" },
{ text:"Smile quietly", next:"end" }
]
},

end:{
text:"Sometimes the best love stories begin with a mistake.",
choices:[]
}

};