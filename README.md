# Frogger

The aim of Frogger is to score the most points. A tally of how many points have been scored this game is kept beside the text "Current score". "High score" keeps track of your best game until you reload the page. "Difficulty" keeps tracks of the difficulty (which is a multiplier of piece movement speed).

Made for a [FIT2102](https://handbook.monash.edu/2022/units/FIT2102?year=2022) Assigment at Monash University

Online version available [here](https://greenyellowlight.github.io/).

![Example of the game](/GAME_IMAGE.png)

**Movement:** You are the frog, the light green square at the bottom of the game. w = up, a = left, s = down, d = right.

**Scoring:** There are two ways to score in this game. Each is worth 1 point

1. Jump on one of the dark green lily pads at the top of the game. Doing so will teleport you back to the start. After you jump on all three lily pads they will reset so you can score again!
2. Touch one of the gold coins that will occasionally go across the screen. Be quick as they disappear!

**Obstacles:** there are two main sections with obstacles that the frog has to be wary of. The road and the river.

The road is the first obstacle. It is the purple strip. On the road there are a lot of red cars. Cars kill frogs when they touch them! When you go accross the road make sure not to touch any cars.

The river is the second obstacle. Do not touch the water! Jump from green mossy log to green mossy log. Frogs have bad balance, so if you are partly off a log you will slip and drown!

---

## How it works


All of the functions are pure, with the exception of the functions for updating the webpage. A gamestate is passed around, a copy of the gamestate is made with changes each time a function needs to change the gamestate.

---


## Running the code

There are two ways to run the code:

1. Build the code and then open the web page

- Run `npm install`
- Run `npm run build`
- Open the html file dist/index.html (NOT src/index.html)

2. Use the development server

- Run `npm install`
- Run `npm run dev`, this will automatically open a web page at localhost:4000
- Open localhost:4000 in your browser if it didn't already


