// Declarations
const INIT_X = 202;
const INIT_Y = 373.5;
const popUp = document.querySelector('.pop-up-modal');
const displayLevel = document.querySelector('.level');
const displayScore = document.querySelector('.score');

// Returns a random value for the Enemy X Position
const randomX = () => Math.floor((Math.random() * 504) + -90);
// Returns a random value from an Array Passed in
const randomArrayVal = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Returns a random value for the Enemy Zoom
const randomZ = () => Math.floor((Math.random() * 30) + 10) * player.level;
// Resets Enemies
const resetEnemies = () => {
  allEnemies = [new Enemy(), new Enemy(), new Enemy()];
};
// Resets Rewards Level, Score
const resetRewards = () => {
  player.level = 1;
  player.score = 0;
  allRewards = [new Reward()];
};
// Returns the Player to initial position
const resetPlayer = () => {
  player.x = INIT_X;
  player.y = INIT_Y;
};
// Displays A Message
const displayModal = (message, sub_message) => {
  if(sub_message.length === 0){
    popUp.innerHTML =
      `<p>${message}</p>
      <p>${sub_message}</p>`;
    }
  else { 
    popUp.innerHTML =
    `<h2>${message}</h2>
    <h3>${sub_message}</h3>`;
  }
};
// Displays Controller Instructions
const instructions = () => {
  const message = 'Use the arrow keys on your keyboard, or use the buttons provided to move your character.';
  displayModal(message, '');
  popUp.style.display = 'inline';
  setTimeout(() => {
    popUp.style.display = 'none';
  }, 3000);
};
// Alerts the player of a win, increments level and score, potentially adds new rewards, and resets the players position
const roundWin = () => {
  const message = 'Great Work!';
  const sub_message = 'Next Level!';
  displayModal(message, sub_message);
  popUp.style.display = 'inline';
  setTimeout(() => {
    popUp.style.display = 'none';
  }, 2000);
  // Player Level Increases
  player.level++;
  // Player Score Increases
  player.score += 50;
  if (player.level % 2 === 0) {
    allEnemies.push(new Enemy());
  }
  allRewards = [];
  allRewards.push(new Reward());
  resetPlayer();
};
// Alerts the player of a loss,
const gameOver = () => {
  const message = 'GAME OVER!';
  const sub_message = 'You were hit!';
  displayModal(message, sub_message);
  popUp.style.display = 'inline';
  setTimeout(() => {
    popUp.style.display = 'none';
  }, 2000);
  resetRewards();
  resetPlayer();
  resetEnemies();
};

/************** START ENEMY CLASS ******************/
// Enemies will start with a random X Position, a random Y Position, and a random Zoom factor
class Enemy {
  constructor() {
    // Possible Enemy Y Positions
    this.yArr = [41.5, 124.5, 207.5];
    this.x = randomX();
    this.y = randomArrayVal(this.yArr);
    this.zoom = randomZ(player.level);
    // Sets the enemies image
    this.sprite = 'images/enemy-bug.png';
  }

  update(dt) {
    // Ensures the game runs at the same speed for all computers
    this.x += (this.zoom * dt);
    // Resets an enemy when it reaches the end of the canvas
    if (this.x > 504) {
      this.x = -90;
      this.y = randomArrayVal(this.yArr);
      this.zoom = randomZ(player.level);
    }
    // Checks if an enemy hit the player
    // A hit occurs when the enemy position is at the same spot as the player position
    if ((this.x > player.x - 75 && this.x < player.x + 75) && (this.y > player.y - 75 && this.y < player.y + 75)) {
      setTimeout(gameOver(), 1000);
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
} /************** END ENEMY CLASS ******************/

/************** START PLAYER CLASS ******************/
// Player starts at a fixed initial position and is moved with the arrow keys
class Player {
  constructor() {
    // Sets initial player position
    this.x = INIT_X;
    this.y = INIT_Y;
    this.level = 1;
    this.score = 0;
    // Sets player's image
    this.sprite = 'images/char-boy.png';
  }

  update() {
    if (this.y < 0) {
      roundWin();
    }
    displayLevel.innerHTML = `Level: ${player.level}`;
    displayScore.innerHTML = `Score: ${player.score}`;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
  // Takes in keyCodes and moves the player accordingly
  handleInput(keyCode) {
    switch (keyCode) {
      case 'up':
        if (this.y > 0) {
          this.y -= 83;
        }
        break;
      case 'down':
        if (this.y < 373.5) {
          this.y += 83;
        }
        break;
      case 'left':
        if (this.x > 0) {
          this.x -= 101;
        }
        break;
      case 'right':
        if (this.x < 404) {
          this.x += 101;
        }
        break;
    }
  }
} /************** END PLAYER CLASS ******************/

/************** START REWARD CLASS ******************/
class Reward {
  constructor() {
    // Possible Gem Sprites
    this.gemArray = ['images/Gem-Green.png', 'images/Gem-Blue.png', 'images/Gem-Orange.png'];
    // Value of the Reward
    this.value = 25;
    // Possible x Positions
    this.xArr = [15, 115, 215, 315, 415];
    // Possible y Positions
    this.yArr = [85, 170, 255];
    this.x = randomArrayVal(this.xArr);
    this.y = randomArrayVal(this.yArr);
    // Sets reward's Image
    this.sprite = randomArrayVal(this.gemArray);
  }

  update() {
    // Checks if player picked up a gem for bonus points by comparing x & y coordinates of the player and the gem
    if ((this.x > player.x - 75 && this.x < player.x + 75) && (this.y > player.y - 10 && this.y < player.y + 50)) {
      player.score += this.value * player.level;
      allRewards.pop(this.reward);
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
} /************** END REWARD CLASS ******************/

// Places the player object in a variable called player
const player = new Player();
// Holds all the rewards objects
let allRewards = [new Reward()];
// Places all enemy objects in an array called allEnemies
let allEnemies = [new Enemy(), new Enemy(), new Enemy()];

// This listens for key presses and sends the keys to the
// Player.handleInput() method. 
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});