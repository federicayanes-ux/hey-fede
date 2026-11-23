/*
  EDIT THIS FILE TO MAKE THE WEBSITE YOURS.

  You can change any text inside quotation marks.
  Keep commas between list items and do not remove the surrounding brackets.
  For each question, correctAnswer starts at 0:
  0 = first answer, 1 = second answer, 2 = third answer, 3 = fourth answer.
*/

window.FEDE_CONTENT = {
  site: {
    intro:
      "Think you know Fede? For Every correct answer you unclock a little more of her story.",
    about:
      "I’m Federica, aka Fede — a collector of good songs, very specific memories and opinions I will happily explain. This little website I created is the fastest way to get to know me a bit.",
    profileImage: "assets/images/fede-quick-guide.jpeg",
    backgroundMusic: "assets/audio/veneka-official-audio.mp3",
    backgroundMusicLabel: "Veneka — Rawayana & Akapellah",
    backgroundMusicVolume: 0.28, // Use a number from 0 (silent) to 1 (full volume).
  },

  questions: [
    {
      category: "Fede 101",
      question: "Which plan would Fede choose without thinking twice?",
      answers: [
        "Night out at Houdinni",
        "A late night Ice Cream run",
        "A spinning class",
        "A trip to the outside of Madrid",
      ],
      correctAnswer: 1,
      fact: "Nothing that has Fede happier than frozen yogurt or a cookies and cream flavored ice cream!",
    },
    {
      category: "Sound check",
      question: "What is most likely playing when Fede has the aux?",
      answers: ["Reggaeton", "Taylor Swift", "Salsa", "Nothing, she's boring"],
      correctAnswer: 0,
      fact: "Although she tends to listen to many genres, 99.9% of the time it'll be old or new reggaeton hits.",
    },
    {
      category: "Snack time!",
      question: "Choose the snack that disappears first.",
      answers: ["Takis", "Pirulin", "Chips", "Rice cakes"],
      correctAnswer: 1,
      fact: "Obviously Pirulin! Best snack in the world!! Especially the Pirulin Bites.",
    },
    {
      category: "Three Truths & A Lie",
      question: "Which one is the lie?",
      answers: ["I once threw my dad an oreo cookie", "I got a nose job", "The hair color I have is not my true color", "My favorite color is black"],
      correctAnswer: 2,
      fact: "I can't wait to see if you unlock the story that comes with one of the answers!",
    },
    {
      category: "Memory lane",
      question: "What is Fede's best way to make a memory worth keeping?",
      answers: [
        "A million videos and pictures",
        "A ridiculous story",
        "Having the specific location",
        "A strict itinerary",
      ],
      correctAnswer: 0,
      fact: "The best memories usually come with several videos filmed on her snapchat camera when no one is noticing.",
    },
    {
      category: "Winner Winner",
      question: "What is the best way to win Fede over?",
      answers: [
        "Going out partying with her",
        "Remembering the little things she says",
        "Sending her roses",
        "Not answering her texts",
      ],
      correctAnswer: 1,
      fact: "The devil's in the details :)",
    },
    {
      category: "Family ties",
      question: "What is my mother's name?",
      answers: ["Andrea", "Gisela", "Mariana", "Isabella"],
      correctAnswer: 1,
      fact: "Gisela is my mom! If you've had the pleasure of meeting her, you'd know she is the best!",
    },
    {
      category: "Venezuelan vocabulary",
      question: "What is my favorite Venezuelan phrase?",
      answers: ["Zapegato", "Que ladilla", "Chevere", "Pata caliente"],
      correctAnswer: 1,
      fact: "'Que ladilla' this, 'Que ladilla' that, 'Que ladilla' everything",
    },
    {
      category: "Future plans",
      question: "Which of these names would I most likely name my child?",
      answers: ["Lorenzo", "Andres", "Lucas", "Rodrigo"],
      correctAnswer: 3,
      fact: "Can't wait to have a boy and name him Rodrigo.",
    },
  ],

  memories: [
    {
      title: "Sevilla with Miss Universe",
      caption: "",
      image: "assets/images/scrapbook-photo-01.jpg",
      details: "After only 7 months of knowing each other, we decided to venture on our first trip to Sevilla for the famous \"Feria de Abril.\" There are no words to describe the immense amounts of fun we had those 4 days of nonstop dancing and drinking. We are hoping to do it all over again next year! What will be Miss Universe's next destination?",
      gallery: [
        { type: "video", src: "assets/videos/trip-memory.mp4" },
        "assets/images/trip-extra-01.jpg",
        "assets/images/trip-extra-02.jpg",
      ],
      unlockAt: 1,
      color: "coral",
    },
    {
      title: "Main-character moment",
      caption: "A photo deserves the story behind it, not just a caption.",
      image: "assets/images/scrapbook-main-character.jpg",
      details: "The following pictures are just me in my maximum expression. On my 5th birthday, blowing the candles with my birthday crown and my 'My Little Pony' cake, which I was obsessed with and talked about it like crazy to all my classmates. Also, me with food, something that will never change, and an iconic picture of me in Boston, one of my favorite places ever!",
      gallery: [
        "assets/images/main-character-extra-01.jpg",
        "assets/images/main-character-extra-02.jpg",
      ],
      wideGallery: true,
      unlockAt: 2,
      color: "yellow",
    },
    {
      title: "The people section",
      caption: "",
      image: "assets/images/people-extra-02.jpg",
      details: "Next to me are the most special people in my life: My mom and my sister. They really are those people that bring the best out of you and are my inspiration for every single thing in my life. Living this without them hasn't been easy, but getting back together with them after a long time is always worth it.",
      gallery: [
        "assets/images/people-main.jpg",
        "assets/images/people-extra-01.jpg",
      ],
      wideGallery: true,
      unlockAt: 3,
      color: "violet",
    },
    {
      title: "Fede AKA Foodie",
      caption: "",
      image: "assets/images/fede-detail-main.jpg",
      details: "There is nothing that I enjoy most in the world than eating, and I think that everyone that knows me... knows that as well. Whenever I travel somewhere new, what I'm most likely searching for is \"Top places to eat in...\" Along my favorite foods are Smash Burgers, Ice Cream, and Pasta!",
      gallery: [
        "assets/images/fede-detail-extra-01.jpg",
        "assets/images/fede-detail-extra-02.jpg",
        "assets/images/fede-detail-extra-03.jpg",
        "assets/images/fede-detail-extra-04.jpg",
      ],
      wideGallery: true,
      hasDetailPage: true,
      unlockAt: 5,
      color: "lime",
    },
    {
      title: "Core memory unlocked",
      caption: "The Bad Bunny concert: Highlight of my year!",
      image: "assets/images/core-memory-main.jpg",
      details: "I had lost all of my hopes and accepted defeat that I wasn't going to this concert, but there is a light at the end of the tunnel! An old friend invited me for a coffee and after an hour of talking, I suddenly had just bought a Bad Bunny ticket for 70 euros! I know right??? What a steal! Even though I was pretty far up, the energy Bad Bunny transmitted, along with the whole crowd, made the experience one that I will never forget.",
      gallery: [
        { type: "video", src: "assets/videos/core-memory-01.mp4" },
        { type: "video", src: "assets/videos/core-memory-02.mp4" },
        "assets/images/core-memory-extra.jpg",
      ],
      wideGallery: true,
      unlockAt: 7,
      color: "blue",
    },
    {
      title: "The vault",
      caption: "The final reward for a perfect or almost-perfect score.",
      image: "assets/images/scrapbook-photo-06.jpg",
      details: "Although it is surprising to many, I did get a nose job and got an implant on my chin! It was mainly due to a very serious breathing issue, so I just took the chance to get my ugly nose out of the way and the tucked chin I used to have. Recovery was really harsh, but to this day and for the rest of my life I will never regret this choice.",
      gallery: [
        "assets/images/vault-extra-01.jpg",
        "assets/images/vault-extra-02.jpg",
      ],
      wideGallery: true,
      unlockAt: 9,
      color: "pink",
    },
  ],

  stories: [
    {
      number: "01",
      title: "The story behind my favorite photo",
      listLabel: "THE SOFT ONE",
      listTitle: "The photo that feels like home",
      teaser: "Los Roques at 6 a.m., my mom, and a memory I would step back into in a second.",
      image: "assets/images/story-favorite-photo.jpg",
      imageAlt: "Federica hugging her mother, Gisela, beneath the Venezuelan flag in Los Roques",
      text: `This picture might be one of my favorite pictures ever. It's with my favorite person in the world, also known as my mom, Gisela. It was really early in the morning, it couldn't have been more than 6 a.m. It was a beautiful morning in our favorite place in the world called Los Roques in my home country Venezuela. However, you could say it was a sad day because we were leaving our favorite place, but it still is our happy place at the end of the day. It just shows, so many things: the beautiful sky, my mom and me, hugging each other so tight and the Venezuelan flag waving strong at the back. This image transmits so much warmth to me, and it makes me miss so much those old days where, you know, I had so much innocence and I was really happy. Those vacations were always my favorite.`,
      unlockAt: 2,
    },
    {
      number: "02",
      title: "An opinion I will defend forever",
      listLabel: "UNPOPULAR OPINION",
      listTitle: "Picky eaters, hear me out",
      teaser: "My completely serious case for saying yes to one bite before deciding it is a no.",
      text: `An opinion I will defend forever is going to be 100% that those who are picky eaters will never get to taste what real life is. It goes further than just trying different foods or different flavors, but you're limiting yourself from so many experiences. I am a believer that food unites people, and being a picky eater is just a way of, like, limiting yourself, limiting yourself with others, and also showing the extent of conformism your are in. Maybe you try it and you don't like it, but at least you tried it, there's nothing wrong with not liking it. It really gives a bad look when you're somewhere with your friends or at an important dinner and you suddenly say, "no I don't like that," "I only eat this and that..." Sorry, unpopular opinion, but that is the truth.`,
      unlockAt: 4,
    },
    {
      number: "03",
      title: "The one only real friends know",
      listLabel: "THE OREO FILES",
      listTitle: "Two Oreos and a six-year-old grudge",
      teaser: "A kitchen trip, a very reasonable dessert boundary, and the argument that followed.",
      text: `Okay, so the story goes like this. One day I just went to get a few Oreo cookies from down in the kitchen. I had already eaten lunch and everything so I went to eat them at my parents' room with the TV, and suddenly my dad comes inside and asks me if I could give him some Oreo cookies. So I was like, "No, I literally just came from downstairs, and I only have two Oreo cookies, like, they're my dessert, you can go get some, but, go downstairs." He's like, "Go get me some," I'm like, "No, I just came from downstairs." Then we began fighting, and mind you I was around six years old. We began fighting, and then I got so angry that I was like, "Okay, Dad," and I threw my dad the Oreo cookie, and that was... I thought it was gonna be the end of my days.`,
      unlockAt: 6,
    },
  ],

  tastes: [
    { label: "On repeat", value: "Anything by Lucho RK, Carita Linda :) by Alleh, J Cole" },
    { label: "Comfort watch", value: "The Parent Trap!" },
    { label: "Perfect plan", value: "Going shopping, going for burgers, later froyo ;)" },
    { label: "Current obsession", value: "Probably anything on my favorite sports team" },
  ],
};
