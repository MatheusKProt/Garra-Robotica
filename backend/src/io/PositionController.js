const pos = { x: 0, y: 0, z: 0, gripper: 0 };

function move() {
  console.log(pos);
}

module.exports = {
  xyz(data) {
    const { x, y, z, gripper } = data;
    if (x) {
      pos.x = Number(x);
    }
    if (y) {
      pos.y = Number(y);
    }
    if (z) {
      pos.z = Number(z);
    }
    if (gripper) {
      pos.gripper = Number(gripper);
    }
    move();
  },
  x(data) {
    const { action } = data;
    if (action === "plus") {
      pos.x += 1;
    } else {
      pos.x -= 1;
    }
    move();
  },
  y(data) {
    const { action } = data;
    if (action === "plus") {
      pos.y += 1;
    } else {
      pos.y -= 1;
    }
    move();
  },
  z(data) {
    const { action } = data;
    if (action === "plus") {
      pos.z += 1;
    } else {
      pos.z -= 1;
    }
    move();
  },
  gripper(data) {
    const { action } = data;
    if (action === "plus") {
      pos.gripper += 1;
    } else {
      pos.gripper -= 1;
    }
    move();
  }
};
