const canvas = document.getElementById("canvas1");
const c = canvas.getContext("2d");

canvas.width = 832;
canvas.height = 480;

const gravity = 0.1;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 50) {
  collisionsMap.push(collisions.slice(i, 50 + i));
}

const boundaries = [];

const offset = {
  x: 0,
  y: 0,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 257)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const image = new Image();
image.src = "./img/testLevel2.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

const player = new Sprite({
  position: {
    x: 300,
    y: 300,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movables = [background, ...boundaries];

function animate() {
  window.requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();

    if (rectangularCollision({ rectangle1: player, rectangle2: boundary })) {
      player.velocity.y = 0;
      jumping = false;
      // console.log('colliding')
    }
  });

  movables.forEach((movable) => {
    movable.position.y -= player.velocity.y / 11;
  });

  if (keys.a.pressed && lastKey === "a" && player.position.x > 366) {
    player.velocity.x = -1.5;
  } else if (keys.d.pressed && lastKey === "d" && player.position.x < 466) {
    player.velocity.x = 1.5;
  } else {
    player.velocity.x = 0;

    if (keys.d.pressed) {
      movables.forEach((movable) => {
        movable.position.x -= 1.5;
      });
    } else if (keys.a.pressed) {
      movables.forEach((movable) => {
        movable.position.x += 1.5;
      });
    }
  }

  player.update();
}

animate();

let lastKey = "";

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      if (!jumping) {
        player.velocity.y += -5;
        jumping = true;
      }

      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";

      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";

      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});
