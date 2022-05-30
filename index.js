const canvas = document.getElementById("canvas1");
const c = canvas.getContext("2d");

canvas.width = 832;
canvas.height = 480;

const gravity = 0.1;
// let jumping = true;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 26) {
  collisionsMap.push(collisions.slice(i, 26 + i));
}

class Boundary {
  static width = 32;
  static height = 32;
  constructor({ position }) {
    this.position = position;
    this.width = 32; // tile width times zoom
    this.height = 32; // tile height times zoom
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
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
image.src = "./img/testLevel.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.frames = frames;
    this.velocity = velocity;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
    c.drawImage(
      this.image,
      0,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }

  update() {
    this.draw();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y += gravity;
  }
}

const player = new Sprite({
  position: {
    x: 416,
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

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    // rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    // rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    // rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    // rectangle1.position.y + rectangle1.height >= rectangle2.position.y &&
    // rectangle1.position.y + rectangle1.height + rectangle1.velocity.y >=
    //   rectangle2.position.y

    rectangle1.position.y + rectangle1.height <= rectangle2.position.y &&
    rectangle1.position.y + rectangle1.height + rectangle1.velocity.y >=
      rectangle2.position.y &&
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();

    if (rectangularCollision({ rectangle1: player, rectangle2: boundary })) {
      player.velocity.y = 0;
      jumping = false;
      // console.log("colliding");
      console.log(jumping);
    }
  });

  movables.forEach((movable) => {
    movable.position.y -= player.velocity.y / 10;
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
      // } else if (player.position.y < 180) {
      //   movables.forEach((movable) => {
      //     movable.position.y += 0.5;
      //   });
      // } else if (player.position.y > 400) {
      //   movables.forEach((movable) => {
      //     movable.position.y -= 0.5;
      //   });
    }
  }

  player.update();

  // let moving = true;

  // if (keys.d.pressed && lastKey === "d") {
  //   for (let i = 0; i < boundaries.length; i++) {
  //     const boundary = boundaries[i];
  //     if (
  //       rectangularCollision({
  //         rectangle1: player,
  //         rectangle2: {
  //           ...boundary,
  //           position: {
  //             x: boundary.position.x - 2,
  //             y: boundary.position.y,
  //           },
  //         },
  //       })
  //     ) {
  //       moving = false;
  //       break;
  //     }
  //   }
  //   if (moving)
  //     movables.forEach((movable) => {
  //       movable.position.x -= 2;
  //     });
  // } else if (keys.a.pressed && lastKey === "a") {
  //   for (let i = 0; i < boundaries.length; i++) {
  //     const boundary = boundaries[i];
  //     if (
  //       rectangularCollision({
  //         rectangle1: player,
  //         rectangle2: {
  //           ...boundary,
  //           position: {
  //             x: boundary.position.x + 2,
  //             y: boundary.position.y,
  //           },
  //         },
  //       })
  //     ) {
  //       moving = false;
  //       break;
  //     }
  //   }
  //   if (moving)
  //     movables.forEach((movable) => {
  //       movable.position.x += 2;
  //     });

  // } else if (keys.w.pressed && lastKey === "w") {
  //   for (let i = 0; i < boundaries.length; i++) {
  //     const boundary = boundaries[i];
  //     if (
  //       rectangularCollision({
  //         rectangle1: player,
  //         rectangle2: {
  //           ...boundary,
  //           position: {
  //             x: boundary.position.x,
  //             y: boundary.position.y + 2,
  //           },
  //         },
  //       })
  //     ) {
  //       moving = false;
  //       break;
  //     }
  //   }
  //   if (moving)
  //     movables.forEach((movable) => {
  //       movable.position.y += 2;
  //     });
  // } else if (keys.s.pressed && lastKey === "s") {
  //   for (let i = 0; i < boundaries.length; i++) {
  //     const boundary = boundaries[i];
  //     if (
  //       rectangularCollision({
  //         rectangle1: player,
  //         rectangle2: {
  //           ...boundary,
  //           position: {
  //             x: boundary.position.x,
  //             y: boundary.position.y - 2,
  //           },
  //         },
  //       })
  //     ) {
  //       moving = false;
  //       break;
  //     }
  //   }
  //   if (moving)
  //     movables.forEach((movable) => {
  //       movable.position.y -= 2;
  //     });
  // }
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

      // movables.forEach((movable) => {
      //   movable.position.y += player.velocity.y + gravity;
      // });
      console.log(player.velocity.y);
      // console.log("w");
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      // console.log("a");
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      // console.log("d");
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
