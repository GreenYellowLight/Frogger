import { interval, fromEvent, merge  } from "rxjs";
import { map, filter, scan} from "rxjs/operators";
import "./style.css";

/**
 * Function which contains Frogger
 */
function main() {

/**
 * Specific constant numbers used by the program
 */
const teleportFactor = 25; //how far to teleport with each movement of the frog (ribbit)
const tickSpeed = 10; //how often the ticks are refreshed
const gameWidth = 600; //how wide the screen of the game is.
const gameHeight = 600; //how heigh the screen of the game is
const maxObjectWith = 300;  //How wide a log/car should be less than
const difficultyIncreaseDelay = 10000; //time between difficulty increases
const rewardDelay = 40000 //how long it takes for a reward to spawn


/**
 * Types of game transitions
 */
class Tick { constructor(public readonly elapsed:number) {} } //action class has one attribute: how much time has elapsed
class Move { constructor(public readonly xAmount:number,public readonly yAmount: number) {} } //for teleportation moves
class Restart { constructor() {} } //for restarting the game
class DifficultyIncrease { constructor() {} } //for increasing the difficulty
class CreateReward  { constructor() {} } //for creating a reward


/**
 * key inputs to look for - code taken from my week 4 tut
 * Putting inputs streams sepeately and then merging them individual ones easy to edit / remove
 * while keeping everything simple
 */
const keyDown = fromEvent<KeyboardEvent>(document,"keydown")

/**
 * input stream for moving forward
 */
const wDown = keyDown.pipe(
  filter(({key}) => key === 'w'),
  map(() => new Move(0,-teleportFactor)))

/**
 * input stream for moving left
 */
const aDown = keyDown.pipe(
      filter(({key}) => key === 'a'),
      map(() => new Move(-teleportFactor,0)))

/**
 * input stream for moving down
 */
const sDown = keyDown.pipe(
  filter(({key}) => key === 's'),
  map(() => new Move(0,teleportFactor)))

/**
 * input stream for moving right
 */
const dDown = keyDown.pipe(
      filter(({key}) => key === 'd'),
      map(() => new Move(teleportFactor,0)))

    
/**
 *  Combining all of the key inputs into one stream so it is easier to access them all later
 */
const moveOnKey = merge(wDown,aDown,sDown,dDown)


//check for key input for restarting the game
const yDown = keyDown.pipe(
  filter(({key}) => key === 'y'),
  map(() => new Restart))

const restartStream = merge(yDown)




/**
 * Function for creating the frog. All frogs with be treated as the same since they have the same id
 * @returns the frog 
 */
function createfrog():Body {
  return {
    id: "frog", //html id
    x: 275, //frog starting x
    y: 550, //frog starting y
    width: 25, //how wide the frog is (how many flies it ate)
    height: 25, //how tal the frog is
    xspeed: 0, //how fast the frog will move sideways accross the page
    style: "fill:rgb(105, 255, 105)", //what colour (species?) the frog is
    viewLayer: "foregroundLayer" //where on the page the from is sitting. See the hgml file
  }
}

//
/**
 * Function for creating a rectangle generic shape
 * @param id_num the html id of the element
 * @param xpos x position of the rectangle
 * @param ypos y position of the rectangle
 * @param width width of the rectangle
 * @param height height of the rectangle
 * @param xspeed a multiplier for how fast the rectangle is going is the +ve x direction (note: this can be negative)
 * @param viewLayer what level of view this appears on, eg backgroundLayer means it appears behind most everything. 
 * 3 options foregroundLayer, middlegroundLayer, backgroundLayer
 * @param colour what colour the rectangel will appear on the page
 * @returns a new rectangle on the page
 */
function createRectangle(id_num: number|string, xpos: number,ypos: number, width: number, height: number, 
  xspeed: number, viewLayer: string, colour: string):Body { //easy way to create an enemy
   return {
    id: id_num.toString(),
    x: xpos,
    y: ypos,
    width: width,
    height: height,
    xspeed: xspeed,
    style: colour,
    viewLayer: viewLayer
  }
  
}
/**
 * Function that allows me for mass creation of all of enemies so initial state can easily get a list of enemies. 
 * Enemies are rectangles which kill you when you touch them
 * This is not procceduraly generated as I wanted a specifc non uniform pattern of trucks
 * @returns a list of all of the enemies to be on the board
 */
function massCreateEnemies(): ReadonlyArray<Body> { 
  const enemyColour = "fill:rgb(216, 68, 0)"
  return [
    //NOTE: moving rectangles should not be longer than maxObjectWith (300)

    //river background
    createRectangle("river",0,300,gameWidth,100,0,"backgroundLayer", "fill:rgb(0,236,240)"),


    //All of the normal enemies, organised by row
    createRectangle("r1-1",100,500,20,25,0.5,"middlegroundLayer",enemyColour), 
    createRectangle("r1-2",50,500,20,25,0.5,"middlegroundLayer",enemyColour), 
    createRectangle("r1-3",450,500,15,25,0.5,"middlegroundLayer",enemyColour), 
    createRectangle("r1-4",400,500,25,25,0.5,"middlegroundLayer",enemyColour),  
    createRectangle("r1-5",450,500,15,25,0.5,"middlegroundLayer",enemyColour),
    createRectangle("r1-6",400,500,25,25,0.5,"middlegroundLayer",enemyColour),


    createRectangle("r2-1",0,475,45,25,-1,"middlegroundLayer",enemyColour),
    createRectangle("r2-2",200,475,25,25,-1,"middlegroundLayer",enemyColour),

    createRectangle("r3-1",100,450,20,25,0.75,"middlegroundLayer",enemyColour),
    createRectangle("r3-2",50,450,20,25,0.75,"middlegroundLayer",enemyColour),
    createRectangle("r3-3",200,450,20,25,0.75,"middlegroundLayer",enemyColour),
    createRectangle("r3-4",250,450,30,25,0.75,"middlegroundLayer",enemyColour),
    
    createRectangle("r4-1",600,425,5,25,0.9,"middlegroundLayer",enemyColour),
    createRectangle("r4-2",300,425,25,25,0.9,"middlegroundLayer",enemyColour),
    createRectangle("r4-3",800,425,20,25,0.9,"middlegroundLayer",enemyColour),
    createRectangle("r4-4",-100,425,20,25,0.9,"middlegroundLayer",enemyColour),
    createRectangle("r4-5",-170,425,20,25,0.9,"middlegroundLayer",enemyColour),
    createRectangle("r4-6",0,425,30,25,0.9,"middlegroundLayer",enemyColour),
  ]
}
/**
 * Function that allows me for mass creation of all of friends so initial state can easily get a list of friends. 
 * Friends are rectangles which will prevent enemies from killing
 * This is not procceduraly generated as I wanted a specifc non uniform pattern of logs
 * you when you are fully on top of the friend
 * @returns  an array of friends to be put on the canvas
 */
function massCreateFriends(): ReadonlyArray<Body> {
  //does this function exist irl?
  const friendColour = "fill:rgb(26,153,0)"
  return [ 
  createRectangle("rv1-1",-250,375,200,25,0.5,"middlegroundLayer",friendColour),
  createRectangle("rv1-2",50,375,200,25,0.5,"middlegroundLayer",friendColour),
  createRectangle("rv1-3",350,375,200,25,0.5,"middlegroundLayer",friendColour),

  createRectangle("rv2-1",-350,350,150,25,-1,"middlegroundLayer",friendColour),
  createRectangle("rv2-2",0,350,150,25,-1,"middlegroundLayer",friendColour),
  createRectangle("rv2-3",300,350,150,25,-1,"middlegroundLayer",friendColour), 

  createRectangle("rv3-1",-350,325,150,25,2,"middlegroundLayer",friendColour),
  createRectangle("rv3-2",0,325,175,25,2,"middlegroundLayer",friendColour)
  ]
}
/**
 * Function that allows me for mass creation of all of benigns. Benigns are rectangles that won't interact with anything, but will look pretty :)
 * @returns list of benigns to be put on the canvas
 */
function massCreateBenign(): ReadonlyArray<Body> {

  const benignColour = "fill:rgb(86,48,150)"
  return [   //id, xpos, ypos, width, height, xspeed, viewlayer, colour
  createRectangle("road",0,425,gameWidth,100,0.9,"backgroundLayer",benignColour),
  ]
}

/**
 * Function that allows me for mass creation of all of the end positions so initial state can easily get a list of end postions. 
 * End positions are goals that will give a point when reached by
 * the frog and will then teleport the frog back to the start 
 * @returns  a list of end positions
 */
function massCreateEndPositions(): ReadonlyArray<Body> {

  const endPosColour = "fill:rgb(14,69,18)"
  return [  
  createRectangle("endPos1",100,300,75,25,0.9,"middlegroundLayer",endPosColour),
  createRectangle("endPos2",275,300,75,25,0.9,"middlegroundLayer",endPosColour),
  createRectangle("endPos3",425,300,75,25,0.9,"middlegroundLayer",endPosColour),
  // createRectangle("endPos2",270,575,75,25,0.9,"middlegroundLayer",endPosColour),
  // createRectangle("endPos3",500,575,75,25,0.9,"middlegroundLayer",endPosColour),
  ]
}


/**
 * Creates all of the text that will be on the gmae
 * @param id html id of the text element
 * @param x x position of the text
 * @param y y position of the text 
 * @param fill colour of the text
 * @param style font size of the text
 * @param textContext contents of the text eg "Game over noob"
 * @param gameOverText if this text is to be displayed iff the game is over
 * @param viewLayer what level of view this appears on, eg backgroundLayer means it appears behind most everything. 
 * 3 options foregroundLayer, middlegroundLayer, backgroundLayer
 * @returns a new text for the canvas
 */
function createText(id:string,x:number, y:number,fill:string,style:string,textContext:string,gameOverText:boolean,viewLayer:string):PageText{
  return {
    id:id,
    x:x,
    y:y,
    fill:fill,
    style: style,
    textContext:textContext,
    gameOverText:gameOverText,
    viewLayer:viewLayer

  }
}

/**
 * Function that allows me for mass creation of all of the text that goes on the canvas so initial state can easily get a list of this
 * @returns a list of all the texts which will go on the canvas
 */
function massCreateText():ReadonlyArray<PageText> {
  return [
    createText("gameOverText",40,gameHeight/2 - 100,"rgb(255,13,13)","font-size: 50","Game Over. y to restart",true,"foregroundLayer"),
    createText("scoreText",40,50,"rgb(5,153,103)","font-size: 25","Current score: ",false,"foregroundLayer"),
    createText("highScoreText",40,80,"rgb(5,153,103)","font-size: 25","High score: ",false,"foregroundLayer"),
    createText("difficultyText",40,110,"rgb(5,153,103)","font-size: 25","Difficulty: ",false,"foregroundLayer")
  ]
}


/**
 * Type that all text must follow
 */
type PageText = Readonly<{ //all text taht is displayed will be of this type
  id: string
  x: number 
  y: number
  fill: string
  style: string
  textContext: string
  gameOverText: boolean //whether the text is to display only on a game over
  viewLayer: string
}>


/**
 * Type that all bodies (rectangles) must follow
 */
 type Body = Readonly<{ // Body type is something that can be moved around
  id: string //Note: 10.toString() = "10"
  x: number 
  y: number
  width: number
  height: number
  xspeed: number //will be distance to teleport if teleport option is True, otherwise distance to move by per tick
  style: string
  viewLayer: string //where the element will appear
 }>




 /**
  * Game state type. This represents an instance of the game. This will be created and passed into a subscribe function each tick
  * A type here means that I can be sure I haven't unknowingly mucked any type stuff up 
  */
 type State = Readonly<{
    time:number, //time elapsed in the game
    frog:Body, //main character
    enemies:ReadonlyArray<Body>, //the trucks
    friends:ReadonlyArray<Body>,
    benign:ReadonlyArray<Body>,  // a list of rectangels that are just a part of the background
    rewards: ReadonlyArray<Body> // things which give you a point when you collect them
    endPositions: ReadonlyArray<Body>, //those things at the end that the frog has to jump into
    gameOver:boolean, //whether or not the game is over
    endStateReached:boolean, //if the frog lands in one of the end states
    oldGoalStates: ReadonlyArray<Body>, // // an end state the has been reached must now be disposed of
    moveFactor: number, //a multiplies for how fast the pieces moves
    text: ReadonlyArray<PageText>, //all text that will be on the page is stored here
    currentScore: number,
    highScore: number
 }>


/**
 * The starting state of the game. This will be used later to reset the game. Having this here
 * as a constant makes reverting to the start state simple as a copy of this can be called
 */
const initialState:State = { //how the game starts off as
  time: 0,
  frog: createfrog(),
  enemies: massCreateEnemies(),
  friends: massCreateFriends(), 
  benign: massCreateBenign(),
  rewards: [createRectangle("reward",-50,425,25,25,0.5,"middlegroundLayer","fill:rgb(235,231,26)")],
  endPositions: massCreateEndPositions(),
  gameOver: false,
  endStateReached:false,
  oldGoalStates: [],
  moveFactor: 4,
  text: massCreateText(),
  currentScore: 0,
  highScore: 0

}


/**
 * Function for moving a body accross the board according to the body's x speed
 * @param s the current board state 
 * @param teleport if the body is allowed to be teleported back onto the screen after it goes off one end
 * Note: there is a buffer on each side of the screen so objects of different lengths don't move positions relative to each other
 * @returns a new board state that has the body moves by the correct amount
 */
const moveBody = (s:State,teleport=true) => (b:Body):Body => {
  return {
  ...b,
  x: ((b.x > gameWidth) && b.xspeed > 0) && teleport ? 0  - maxObjectWith: //teleport left (obj has gone off right side of screen past limit)
    ((b.x + maxObjectWith < 0) && b.xspeed < 0) && teleport ? gameWidth : //teleport right (obj has gone off left side of screen past limit)
    b.x + (b.xspeed / tickSpeed) * s.moveFactor //no need to teleport object, update its position
  }
}

/**
 * Teleport the frog a certain amount. While moveBody moves based on xspeed, this just moves a specified amount.
 * This is seperatae from the normal move function because it allows functions to focus on what they do best
 * and reduces clutter in functions
 * @param s current game state
 * @param move how much to teleport by
 * @returns a new game state that has the new bodies position updated
 */
const teleportFrog = (s:State, move: Move):State =>{  
  return  {...s,
    frog: { 
      ...s.frog,
      x: s.frog.x + move.xAmount,
      y: s.frog.y + move.yAmount,
      xspeed: 0  //when frog teleports its xspeed is set to 0 (hence it stops moving after jumping off a log)


    }
  }
}

/**
 * Funky "random" number generator
 * @param s current game state
 * @param seed arbitrary number to help with randomness
 * @returns a "random" number between 0 and 1. Number is based off seed and elements of the current game state
 */
function generateRandomNumber(s:State, seed:number):number { //generates a "random" number

  const a = s.frog.x
  const b = s.frog.y
  const c = s.currentScore
  const d = s.time

  const p1 = 178917325597 //prime numbers
  const p2 = 114293050351
  const p3 = 106220220683

  const rand = (p2  * (a * b * c + 1) + p1 * (seed * d + 1 ) ) % p3

  return rand / p3

}

/**
 * Replaces the current award in the state. A reward is a small rectangle that moves slowly across the screen. Will give a point when 
 * touched and the disappear 
 * @param s current game state
 * @returns a new game state that has a reward placed at the start of a semi random row moving left slowly
 */
function createReward(s:State):State { 
  const rand1 = generateRandomNumber(s,42) //random number to decide the position 
  const rand2 = generateRandomNumber(s,rand1) //random number to decide whether or no to actually place the frog


  //get a random row from 1 to 6 to spawn the reward in
  const row_ = parseFloat((rand2 * 6).toFixed(0));  // get a whole number 1 -> 6

  const row = row_ ==  4 ? 7 : row_ //don't let rewards spawn on the empty row. If they are there move them away

  //get the actual value corrosponding to the row
  const row_y = 500 - 25 * row

  return {...s, rewards: [createRectangle("reward",-50,row_y,25,25,0.5,"middlegroundLayer","fill:rgb(235,231,26)")]} //return reward with a random row
}

/**
 * Function to handle the game being over and then restarting. This is outsourced from reduceState to simplify that function
 * @param s current start (which should have a lost game)
 * @param action action passed to the board, eg move something, tick the board...
 * @returns a restarted game if a rstart afction recieved, otherwise the stopped game
 */
const gameOverState = (s:State, action:Tick|Move|Restart):State =>{
  return action instanceof Restart ? { ...initialState, highScore: s.highScore > s.currentScore ? s.highScore : s.currentScore} 
  //some things like high score don't reset on a restart
  // the second if statement on the line above is so dying on the tick you get a point will add the point you get the your high
  : s
}

/**
 * Function which increases the difficulty of the game by increasing the movement speed
 * @param s current state
 * @returns copy of current state but with difficulty increased
 */
const increaseDifficulty =(s:State):State => {
  const newDifficulty = s.moveFactor * 1.1 > 80 ? 80 : s.moveFactor * 1.1 //gmae breaks when things go too fast, so don't let that happen
  return {...s, moveFactor: newDifficulty }
}

/**
 *  Create a new game state with changed properties from any possible action.
 *  Checks for some things about the state before performing the action though. Most of its work is done by sub functions to make
 *  the program easier to work with
 * @param s current game state
 * @param action action which is to be performed on the state
 * @returns new state with the action done on it
 */
const reduceState = (s:State, action:Tick|Move|Restart|DifficultyIncrease|CreateReward):State => {

  //a new point takes priority 
  const placeHolderReward = createRectangle("reward",700,425,25,25,0.5,"middlegroundLayer","fill:rgb(235,231,26)")// stops same place thing sawning
  if (s.endStateReached){

    //if all scoring positions filled reset them all
    if (s.endPositions.length == 0){ 
      return {...initialState, moveFactor: s.moveFactor, currentScore: s.currentScore + 1, highScore: s.highScore, time: s.time, 
        rewards: [placeHolderReward] } 
      //reward given on line above to stop the reward always spawning in the same place at the start of each game
    } else {

      //at least one scoring position left
      return {...initialState,
        oldGoalStates: s.oldGoalStates,
        endPositions: s.endPositions,
        moveFactor: s.moveFactor,
        highScore: s.highScore,
        currentScore: s.currentScore +1,
        rewards: [placeHolderReward],// to stop same place rectangel spawning
        time: s.time
      }
    }
  }
  //game ended takes 2nd priority
  if (s.gameOver) {
    return gameOverState(s,action)
  }

  //normal stream stuff
  return  action instanceof Tick ? tick(s,action.elapsed) 
        : action instanceof Move ? teleportFrog(s,action)
        : action instanceof Restart ? initialState 
        : action instanceof DifficultyIncrease ? increaseDifficulty(s)
        : action instanceof CreateReward ? createReward(s) 
        : s //this base case should never happen... but
       
}

/**
 * Function for working out if the frog is out of bounds (in which case the game is lost)
 * @param b the frog 
 * @returns if the frog is in a valid position
 */
const frogOutOfBounds = (b:Body):boolean =>{ //returns true if frog out of bounds, false if in
  return b.x < 0 || b.y < 0 || b.x + b.width  > gameWidth || b.y  + b.height > gameHeight
}

/**
 * Works out if it is game over time, or if a point has been scored. It does this by checking if the frog is on top of 
 * something else etc. This allows game to end and scores to update
 * @param s current state
 * @returns a new state that possibly includes an updated score or says that the game is now over 
 */
const manageCollisions = (s:State):State =>{

  //Following two functions taken from the week 2 workshop
  
  /**
   * If two rectangles are overlapping each other on one axis (calling it x here but it could be y too)
   * Note: if you are technically touching a rectangle by being underneath it in the row below, this won't 
   * count that as touching
   * @param u min x for first rectangle
   * @param U max x of first rectangle
   * @param v min x of second rectangle
   * @param V max x of second rectangle
   * @returns if two rectangles are overlapping inb
   */
  const overLappingInternvals = (u:number,U:number) => (v:number,V:number):boolean => u < V && v < U; //note : overlap is not counting touching

  /**
   * If two the second rectangle is covering the first are overlapping each other on one axis (calling it x here but it could be y too)
   * eg :
   *    ----    |       -----
   *  --------- |  --------
   *  Covering  | Not covering
   * count that as touching
   * @param u min x for first rectangle
   * @param U max x of first rectangle
   * @param v min x of second rectangle
   * @param V max x of second rectangle
   * @returns if rectangle one is covered by rectangle 2 on this axis
   */
  const coveringIntervals = (u:number,U:number) => (v:number,V:number):boolean =>  v <= u && U <= V 
  //note touching on both side = covering. uU is what is looked to be covered 

  //this functionr eturnsif there isa game ending collison
  /**
   * Like coveringIntervals, but if the first rectangle is coveredby the second rectangel on two axises (frog must be fully on log to survive)
   * @param b1 rectangle to look if covered
   * @param b2 rectangle to look if covering
   * @returns if b2 covers b1 fully
   */
  const fullyOnBody = (b1:Body, b2: Body):boolean => {//whether one body is fully on top of a body 
    return coveringIntervals(b1.x,b1.x + b1.width)(b2.x,b2.x + b2.width) && coveringIntervals(b1.y,b1.y + b1.height)(b2.y,b2.y + b2.height)

  };
  /**
   * If two rectangles are touching eachother on the canvas, this time aware of both axis when checking. frog touches car = splat
   * @param b1 rectangle 1
   * @param b2 rectangle 2
   * @returns if the 2 rectangles touch each other
   */
  const touchingBody = (b1:Body, b2: Body):boolean => {
    return overLappingInternvals(b1.x,b1.x + b1.width)(b2.x,b2.x + b2.width) && overLappingInternvals(b1.y,b1.y + b1.height)(b2.y,b2.y + b2.height)

  }
  /**
   * Works out if the frog is touching a reward
   */
  const touchingReward = s.rewards[0] == null ? 0  //if no rewards exit (ie it was touched) this will be null
    : (touchingBody(s.frog,s.rewards[0]) )? 1 : 0 //add a point if frog is  touching a reward

  /**
   * If frog is touching a reward then this preps the reward to be hidden on view
   */
  const rewardsToDisposeOf = touchingReward ? [...s.rewards]: [] // 
  /**
   * If an enemy (red rectangle) is touching the frog
   */
  const enemiesTouching = s.enemies.filter(b=>touchingBody(s.frog,b)).length > 0
  /**
   * If a friend (log) is in a position to save a position to save the frog from being killed by the enemy
   */
  const friendsFullyTouching = s.friends.filter(b=>fullyOnBody(s.frog,b)).length > 0
  /**
   * A list of end states that the frog is not fully on (ie that the frog can't remove and get a point from)
   */
  const notOnEndStates = s.endPositions.filter(b=>!fullyOnBody(s.frog,b))

  //update the frog speed for the case when riding a friend
  /**
   * If the frog is fully on - saved - by a friend
   */
  const samePosFriends = s.friends.filter(b=>fullyOnBody(s.frog,b))
  /**
   * Updates the sideways speed of the frog to match the firend (log) it is on. Ie so frog moves across screen at
   * the same speed as the log it is on 
   */
  const newFrogXSpeed  = samePosFriends.length == 0 ? s.frog.xspeed : samePosFriends[0].xspeed

  /**
   * Check for frog being on the end state (lily pad). this takes priority as if this is the case frog should 
   * immediately be teleported back to the start
   */
  if (notOnEndStates.length < s.endPositions.length ){
    return {...s, 
      endStateReached:true,
      endPositions: notOnEndStates,
      oldGoalStates: [...s.oldGoalStates, ...s.endPositions.filter(b=>fullyOnBody(s.frog,b)), ...rewardsToDisposeOf  ], //mark the 
      //rewards that you have been to for hiding from view
      
      rewards: touchingReward ? [] : s.rewards, //clear rewards if touching a reward. This line stops uninteractable reward error
      currentScore: touchingReward ? s.currentScore + 1 : s.currentScore
    }
  }
  // element you update the speed to. Although not technically a collison. I also check if frog out of bounds
  /**
   * Check if the frog has collided with something bad or is out of bound
   */
  return {...s, 
    gameOver:(enemiesTouching && !friendsFullyTouching) || frogOutOfBounds(s.frog),
    frog: {
      ...s.frog,
      xspeed: newFrogXSpeed
    },
    highScore: s.currentScore > s.highScore ? s.currentScore : s.highScore,
    oldGoalStates:  [...s.oldGoalStates,  ...rewardsToDisposeOf],
    currentScore: touchingReward ? s.currentScore + 1 : s.currentScore,
    rewards: touchingReward ? [] : s.rewards, //clear rewards if touching a reward. This line stops uninteractable reward error
}
}

/**
 * Performs 1 game tick.  Note: this works out the new state, updateView (impure) puts the new state on the canvas
 * This is exclusively used for updating things based on time (NOT KEYBOARD INPUTS)
 * @param s the state at the start or the tick
 * @param elapsed how long has elapsed between each tick
 * @returns the ticked version of the original state
 */
const tick = (s:State,elapsed:number):State => { //finds the new state after one tick.
  /**
   * Works out all of the collisions in a tick
   */
  const colidedState = manageCollisions(s) // this needs to be here else the collisions wokred out will be overriden
  return {...colidedState, 
    rewards: colidedState.rewards.map(moveBody(s,false)),  //move all of the reward but let them go off the edge of the screen and stay ther
    time: colidedState.time + elapsed, //update to show that time has passed
    frog:moveBody(s)(colidedState.frog),
    enemies: colidedState.enemies.map(moveBody(s)), //updates all enemy postions
    friends: colidedState.friends.map(moveBody(s)), //update all friend positions
    
  }
}


/**
 * Causes game ticks to happen
 */
const gameClock = interval(tickSpeed)
      .pipe(map(elapsed => new Tick(elapsed))) 

/**
 * Causes difficulty to increase
 */
const difficultyIncrease = interval(difficultyIncreaseDelay)
      .pipe(map(() => new DifficultyIncrease()))  

/**
 * Causes rewards to be spawned
 */
const rewardSpawner = interval(rewardDelay)
      .pipe(map(() => new CreateReward())) 

/**
 * Create the main subscription stream. This is the stream gets all of the game updates like ticks and difficulty increases. 
 * Putting everything together makes it all simpler to work with and easier to use
 */
const subscription = merge(gameClock,moveOnKey,restartStream,difficultyIncrease,rewardSpawner).pipe(
  scan(reduceState, initialState)) // create a new game state with changed properties
  .subscribe(updateView) //updateView is a curried function. This passes the new game state into something that can change the html. 
  // This is also the only impure function in the game

/**
 * Changes the canvas to match the state (ie updates everything). It is impure, like most of its sub functions
 * @param s the current state
 */
function updateView(s:State){ 
  const svg = document.getElementById("svgCanvas")!

  /**
   * Function for creating an element if it doesn't exist. Is impure
   * @param e  object to get info from for creating element
   * @param element_type if the element will be a string or a rectangle
   * @returns created element. This element will ahve also been added to the svg page
   */
  function creatElement(e:Body|PageText,element_type:string ){ 
    const new_element = document.createElementNS(svg.namespaceURI, element_type)!; 
    new_element.id = e.id
    const elementLayer = document.getElementById(e.viewLayer)!
    elementLayer.appendChild(new_element)
    return new_element
  }
    /**
     * Updates the contents of text in a state. The text is completely set here which makes all the text simple to read. Is pure
     * @param s current game staet
     * @param element element which contains the text to be updated
     * @param t object containing the current text
     * @returns 
     */
   function updatedTextContent(s:State,element:Element,t:PageText) { 
      switch (element.id){
              case "scoreText": 
                return "Current score: " + s.currentScore

              case "highScoreText":
                return "High score: " +  s.highScore

              case "difficultyText":
                return "Difficulty: " +  (s.moveFactor / 4).toFixed(2) //  divide by 4 so difficulty starts a 1 not 4 

              default:
                return t.textContext
      }

   }
  //do all of the general updating stuff

  /**
   * Both text and rectangles have ids xpos and y pos. This function allows the code to be simplified by setting 
   * all of this generic stuff here in one place.
   * Also creates the element on page it it doesn't exist. Is impure
   * @param e element to update
   * @param element_type type of the element
   * @returns the element which was created/ updated
   */
  function doTheBasics(e:Body|PageText,element_type:string ) { //updates the things that both PageText and bodies have
    const element = document.getElementById(e.id) || creatElement(e, element_type)!;
    
    element.setAttribute("id", e.id)
    element.setAttribute("x", e.x.toString())
    element.setAttribute("y", e.y.toString())
    element.setAttribute("style", e.style);

    return element
  }

  /**
   * Update a text element on the canvas, create it if it doesn't exist. Is impure
   * @param s current state of canvas
   * @param t text element to update
   */
  function updateTextView(s:State)  {  //update how the text on the page looks
    return (t:PageText) => 
    {
      const element = doTheBasics(t,"text")
      element.setAttribute("fill", t.fill);
      element.textContent = updatedTextContent(s,element,t)!;

      ((s.gameOver && t.gameOverText) || !t.gameOverText) == true ? //hide show text element according to game over if requried
          element.setAttribute("visibility","visible") 
        : element.setAttribute("visibility","hidden")
    }
  }


  /**
   * Update a body on the canvas, create it if it doesn't exist. Is impure
   * @param b body on the canvas to update/create
   */
  function updateBodyView(b:Body){
    const element = doTheBasics(b, "rect")
    element.setAttribute("width", b.width.toString()) //nterface contains numbers as they are easier to add to etc, but svg needs string
    element.setAttribute("height", b.height.toString())
  }

  /**
   * Hides a body from view. This function exists as changing an objects visibiltiy is a simple action that
   * is needed quite a lot
   * @param b  object to change visibility of
   */
  function hideFromView(b:Body){ 
    const element = document.getElementById(b.id)!
    element.setAttribute("visibility","hidden")
  }

  /**
   * Makes a body visible to view. This function exists as changing an objects visibiltiy is a simple action that
   * is needed quite a lot
   * @param b  object to change visibility of
   */
  function showToView(b:Body){ //hides an object from view
    const element = document.getElementById(b.id)!
    element.setAttribute("visibility","visible")

  }
  //actually do the updating of view
  updateBodyView(s.frog)

  s.enemies.forEach(updateBodyView)
  s.friends.forEach(updateBodyView)
  s.benign.forEach(updateBodyView)

  s.endPositions.forEach(updateBodyView)
  s.endPositions.forEach(showToView)

  s.oldGoalStates.forEach(hideFromView) //this is a list of goal node and rewards that the frog has been to and now need to be hidden

  s.text.forEach(updateTextView(s))

  s.rewards.forEach(updateBodyView)
  s.rewards.forEach(showToView)


}



} //end of main function :)

// Run the main function on window load.
if (typeof window !== "undefined") {
  window.onload = () => {
    main();
  };
}
