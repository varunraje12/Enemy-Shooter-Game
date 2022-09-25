const can = document.getElementById("mycanvas");
const ctx = can.getContext("2d");

// Data
const canvasSize = {
  x: 500,
  y: 500,
};

let  interval

const player = {
  pos: {
    x: canvasSize.x / 2,
    y: canvasSize.y / 2,
  },
  angle: 90,
  size: 30,
  color: "blue",
  speed: 5,
  health: 100,
  Score:0
};

const enemyConfig = {
  enemiesAtATime: 7,

  enemyLeadAtTime: 2,

  enemyMovSpeed: 3,
  
  enemyMovammount: 3,

  enemyTurnAngles: [null,null,null,null,null,null,null,null,null,null,90,0,null,270,null, 180,],
  
  enemyFiringRate: 0.2,

  bulletsSize: 5,

  leaderBulletsSize: 10,

  enemyBulletColor: "#ff3538",

  enemyBulletDamage: 5,

  enemyHealth: 10,

  bulletSpeed: 2,

  enemySize: 25,

  enemyLeaderSize: 40,

  enemyLeaderHealth: 20,

  enemyLeaderBulletDamage: 10,

  enemyLeaderColor: "red",

  enemyColor: "#fe7744",

};

const enemies = [
  // {
  //   pos:{
  //       x: canvasSize.x/2,
  //       y: canvasSize.y/2
  //   },
  //   angle: 90,
  //   size : 30,
  //   color: "blue",
  //   speed: 5
  // }
];

const bullets = [
  // {
  //     pos:{
  //         x: 250,
  //         y: 500
  //     },
  //     size: 10,
  //     color: "red",
  //     speed: 5,
  //     angle: 90
  // }
];

// Activity Functions
function movePlayer(e, p) {
  if (e.code === "KeyW" || e.code === "ArrowUp") {
    if (p.pos.y > p.size / 6) {
      p.pos.y -= p.speed;
    }
    p.angle = 90;
  }
  if (e.code === "KeyA" || e.code === "ArrowLeft") {
    if (p.pos.x > p.size / 6) {
      p.pos.x -= p.speed;
    }
    p.angle = 180;
  }
  if (e.code === "KeyS" || e.code === "ArrowDown") {
    if (p.pos.y < canvasSize.y - (5 * p.size) / 6) {
      p.pos.y += p.speed;
    }
    p.angle = 270;
  }
  if (e.code === "KeyD" || e.code === "ArrowRight") {
    if (p.pos.x < canvasSize.x - (5 * p.size) / 6) {
      p.pos.x += p.speed;
    }
    p.angle = 0;
  }
}

function moveEnemies() {
  enemies.forEach((e) => {
    let willMove = false;
    if (Math.random() * 10 < enemyConfig.enemyMovSpeed) {
      willMove = true;
    }

    if (willMove) {
      const turnAngle =
        enemyConfig.enemyTurnAngles[
          Math.floor(Math.random() * enemyConfig.enemyTurnAngles.length)
        ];
      if (turnAngle != null) {
        e.angle = turnAngle;
      }
      e.pos.x +=
        Math.cos((e.angle / 180) * Math.PI) * enemyConfig.enemyMovammount;
      e.pos.y -=
        Math.sin((e.angle / 180) * Math.PI) * enemyConfig.enemyMovammount;

      if (e.pos.x < e.size / 3) {
        e.pos.x = e.size / 3;
      } else if (e.pos.x > canvasSize.x - (2 * e.size) / 3) {
        e.pos.x = canvasSize.x - (2 * e.size) / 3;
      }
      if (e.pos.y < e.size / 3) {
        e.pos.y = e.size / 3;
      } else if (e.pos.y > canvasSize.y - (2 * e.size) / 3) {
        e.pos.y = canvasSize.y - (2 * e.size) / 3;
      }
    }
  });
}

function creatPlayerBullet(e, p, b) {
  if (e.code === "Space" || e.code === "Enter") {
    b = {
      pos: {
        x: p.pos.x,
        y: p.pos.y,
      },
      angle: p.angle,
      size: p.size / 3,
      color: "red",
      speed: 5,
      damage: 5,
      isPlayerBullet: true,
    };
    bullets.push(b);
  }
}

function createEnemyBullet() {
  enemies.forEach((e) => {
    if (Math.random() * 10 < enemyConfig.enemyFiringRate) {
      bullets.push({
        pos: {
          x: e.pos.x,
          y: e.pos.y,
        },
        size:
          e.type === "L"
            ? enemyConfig.leaderBulletsSize
            : enemyConfig.bulletsSize,
        color: enemyConfig.enemyBulletColor,
        speed: enemyConfig.bulletSpeed,
        angle: e.angle,
        damage:
          e.type === "L"
            ? enemyConfig.enemyLeaderBulletDamage
            : enemyConfig.enemyBulletDamage,
      });
    }
  });
}

function createEnemy() {
  if (enemies.length >= enemyConfig.enemiesAtATime) {
    return;
  }
  let angle = 0;
  const randomNum = Math.round(Math.random() * 3);
  if (randomNum === 0) {
    angle = 0;
  } else if (randomNum === 1) {
    angle = 90;
  } else if (randomNum === 2) {
    angle = 180;
  } else if (randomNum === 3) {
    angle = 270;
  }
  enemies.push({
    pos: {
      x: Math.round((Math.random() * canvasSize.x) / 2),
      y: Math.round((Math.random() * canvasSize.y) / 2),
    },
    angle,
    size: enemyConfig.enemySize,
    color: enemyConfig.enemyColor,
    speed: enemyConfig.enemySpeed,
    health: enemyConfig.enemyHealth,
  });
}

function createEnemyLeader() {
  let count = 0;
  enemies.forEach((e) => {
    if (e.type === "L") {
      count++;
    }
  });
  if (count >= enemyConfig.enemyLeadAtTime) {
    return;
  }

  let angle = 0;
  const randomNum = Math.round(Math.random() * 3);
  if (randomNum === 0) {
    angle = 0;
  } else if (randomNum === 1) {
    angle = 90;
  } else if (randomNum === 2) {
    angle = 180;
  } else if (randomNum === 3) {
    angle = 270;
  }
  enemies.push({
    pos: {
      x: Math.round(Math.random() * canvasSize.x),
      y: Math.round(Math.random() * canvasSize.y),
    },
    angle,
    size: enemyConfig.enemyLeaderSize,
    color: enemyConfig.enemyLeaderColor,
    speed: enemyConfig.enemySpeed,
    type: "L",
    health: enemyConfig.enemyLeaderHealth,
  });
}

function checkBulletImpact() {
  bullets.forEach((b) => {
    // checking for enemy collision
    if (b.isPlayerBullet) {
      enemies.forEach((e) => {
        if (
          Math.abs(e.pos.x - b.pos.x) < e.size / 2 + b.size / 2 &&
          Math.abs(e.pos.y - b.pos.y) < e.size / 2 + b.size / 2
        ) {
          e.health -= b.damage;
          b.delete = true;
        }
      });

      //checking for player to enemy to enemy bullet collision
      bullets.forEach((eb) => {
        if (!eb.isPlayerBullet) {
          if (
            Math.abs(eb.pos.x - b.pos.x) < eb.size / 2 + b.size / 2 &&
            Math.abs(eb.pos.y - b.pos.y) < eb.size / 2 + b.size / 2
          ) {
            eb.delete = true;
            b.delete = true;
          }
        }
      });

    } else {
      if (
        Math.abs(player.pos.x - b.pos.x) < player.size / 2 + b.size / 2 &&
        Math.abs(player.pos.y - b.pos.y) < player.size / 2 + b.size / 2
      ) {
        player.health -= b.damage;
        b.delete = true;
      }
    }
  });
}

function BulletImpact() {

}


function isPlayerDead() {
  if (player.health <= 0) {
  clearInterval(interval);
  soGameover()
  }
}

function soGameover(){
  ctx.font = '25px serif'
  ctx.fillText("GAME OVER",canvasSize.x/3,canvasSize.y/2)
}
function pauseNplay(e) {
   if(e.code === "Escape"){
     if(interval) {
       clearInterval(interval)
       interval =null
       pause()
       return
     }
     play()
    }
  }
  function pause(){
    ctx.font = '50px serif'
    ctx.fillText("PAUSE",canvasSize.x/3,canvasSize.y/2)
  }

function play() {  
  plays()
  interval = setInterval(() => {
    createEnemyLeader();
    createEnemy();
    moveEnemies();
    createEnemyBullet();
    moveBullets(bullets);
    checkBulletImpact();
    deleteBullets(bullets);
    deleteEnemies(enemies);
    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);
    drawBullets(bullets);
    drawEnemies();
    drawCharacter(
      player.pos.x,
      player.pos.y,
      player.size,
      player.angle,
      player.color
      );
      isPlayerDead();
    drowMetrix()
  }, 20)
  plays()
}

function plays(){
  ctx.font = '100px serif'
  ctx.fillText("play",canvasSize.x/3,canvasSize.y/2)
}


function deleteBullets(b) {
  for (let i = 0; i < b.length; i++) {
    if (
      b[i].delete ||
      b[i].pos.x < 0 - b.size / 2 ||
      b[i].pos.x > canvasSize.x + b.size / 2 ||
      b[i].pos.y < 0 - b.size / 2 ||
      b[i].pos.y > canvasSize.y + b.size / 2
    ) {
      b.splice(i, 1);
    }
  }
}

function deleteEnemies(enemies) {
  for (let i = 0; i < enemies.length; i++) {
    if (enemies[i].health <= 0) {
      player.Score += enemies[i].type ==="L"? 10: 5;
      enemies.splice(i, 1);
    }
  }
}

function moveBullets(bullets) {
  bullets.forEach((b) => {
    b.pos.x = b.pos.x + b.speed * Math.cos((b.angle / 180) * Math.PI);
    b.pos.y = b.pos.y - b.speed * Math.sin((b.angle / 180) * Math.PI);
  });
}

// Drawing Function
function drawSquare(px, py, size, color) {
  ctx.fillStyle = color;
  ctx.fillRect(px - size / 2, py - size / 2, size, size);
}

function drowMetrix() {
  ctx.font = '20px serif';
  ctx.fillText('health-'+ Math.ceil(player.health/25), 0, 40);
  ctx.fillText('Score-'+ player.Score, 0, 18);
}

function drawBullets(bullets) {
  bullets.forEach((b) => {
    drawSquare(b.pos.x, b.pos.y, b.size, b.color);
  });
}

function drawCharacter(cx, cy, size, angle, color) {
  rd = (angle / 180) * Math.PI;
  drawSquare(
    cx + Math.cos(rd) * (size / 3),
    cy - Math.sin(rd) * (size / 3),
    size / 3,
    color
  );
  drawSquare(
    cx - (Math.sin(rd) * size) / 3,
    cy + (Math.cos(rd) * size) / 3,
    size / 3,
    color
  );
  drawSquare(cx, cy, size / 3, color);
  drawSquare(
    cx + (Math.sin(rd) * size) / 3,
    cy - (Math.cos(rd) * size) / 3,
    size / 3,
    color
  );
  drawSquare(
    cx - ((Math.sin(rd) + Math.cos(rd)) * size) / 3,
    cy + ((Math.sin(rd) - Math.cos(rd)) * size) / 3,
    size / 3,
    color
  );
  drawSquare(
    cx + ((Math.sin(rd) - Math.cos(rd)) * size) / 3,
    cy + ((Math.sin(rd) + Math.cos(rd)) * size) / 3,
    size / 3,
    color
  );
}

function drawEnemies() {
  enemies.forEach((e) => {
    drawCharacter(e.pos.x, e.pos.y, e.size, e.angle, e.color);
  });
}

// Button Input Functions
document.addEventListener("keydown", buttonEvent);
function buttonEvent(e) {
  movePlayer(e, player);
  creatPlayerBullet(e, player, bullets);
  pauseNplay(e)
}

play()