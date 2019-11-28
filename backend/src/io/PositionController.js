const Position = require("../models/Position.js");
const axios = require("axios");

const api = axios.create({
  baseURL: "http://192.168.1.150"
});

const pos = {
  rotation: 0,
  elevation: 0,
  extension: 30,
  gripper: 0
};

const rotationMin = -180;
const rotationMax = 180;

const elevationMin = -30;
const elevationMax = 30;

const extensionMin = 30;
const extensionMax = 40;

const gripperMin = 0;
const gripperMax = 100;

const rotationStep = 10;
const elevationStep = 10;
const extensionStep = 20;
const gripperStep = 10;

async function getPosition() {
  return (position = await Position.findOne({
    $and: [
      { beta: pos.rotation },
      { theta: pos.elevation },
      { alpha: pos.extension }
    ]
  }));
}

module.exports = {
  async xyz(data) {
    let { x, y, z, gripper } = data;

    if (x && y && z) {
      x = Number(x);
      y = Number(y);
      z = Number(z);

      const position = await Position.findOne({
        $and: [
          { x: { $gt: x - 0.5 } },
          { x: { $lt: x + 0.5 } },
          { y: { $gt: y - 0.5 } },
          { y: { $lt: y + 0.5 } },
          { z: { $gt: z - 0.5 } },
          { z: { $lt: z + 0.5 } }
        ]
      });

      if (position) {
        const { alpha, beta, theta } = position;
        console.log("");
        console.log("x: ", Math.round(position.x * 100) / 100);
        console.log("y: ", Math.round(position.y * 100) / 100);
        console.log("z: ", Math.round(position.z * 100) / 100);

        const newRotation = rotationStep * (beta - pos.rotation);
        if (newRotation !== 0) {
          try {
            await api.get("/?rotation=" + newRotation);
          } catch {}
          pos.rotation = beta;
        }

        const newElevation = elevationStep * (theta - pos.elevation);
        if (newElevation !== 0) {
          try {
            await api.get("/?elevation=" + newElevation);
          } catch {}
          pos.elevation = theta;
        }

        const newExtension = extensionStep * (alpha - pos.extension);
        if (newExtension !== 0) {
          try {
            await api.get("/?extension=" + newExtension);
          } catch {}
          pos.extension = alpha;
        }
      } else {
        console.log("Pontos não existem!");
      }
    }

    if (gripper) {
      console.log(pos);

      gripper = Number(gripper);
      const newGripper = gripperStep * (gripper - pos.gripper);
      if (newGripper !== 0) {
        pos.gripper = gripper;
        try {
          await api.get("/?gripper=" + newGripper);
        } catch {}
      }
      console.log(pos);
    }
  },
  async rotation(data) {
    const { action } = data;
    let position = {};

    if (action === "plus" && pos.rotation < rotationMax) {
      pos.rotation += 1;
      position = await getPosition();

      try {
        await api.get("/?rotation=" + rotationStep);
      } catch {}
    } else if (action === "minus" && pos.rotation > rotationMin) {
      pos.rotation -= 1;
      position = await getPosition();

      try {
        await api.get("/?rotation=" + -rotationStep);
      } catch {}
    }
    console.log("");
    console.log("x: ", Math.round(position.x * 100) / 100);
    console.log("y: ", Math.round(position.y * 100) / 100);
    console.log("z: ", Math.round(position.z * 100) / 100);
  },
  async elevation(data) {
    const { action } = data;
    let position = {};

    if (action === "plus" && pos.elevation < elevationMax) {
      pos.elevation += 1;
      position = await getPosition();

      try {
        await api.get("/?elevation=" + elevationStep);
      } catch {}
    } else if (action === "minus" && pos.elevation > elevationMin) {
      pos.elevation -= 1;
      position = await getPosition();

      try {
        await api.get("/?elevation=" + -elevationStep);
      } catch {}
    }
    console.log("");
    console.log("x: ", Math.round(position.x * 100) / 100);
    console.log("y: ", Math.round(position.y * 100) / 100);
    console.log("z: ", Math.round(position.z * 100) / 100);
  },
  async extension(data) {
    const { action } = data;
    let position = {};

    if (action === "plus" && pos.extension < extensionMax) {
      pos.extension += 1;
      position = await getPosition();

      try {
        await api.get("/?extension=" + extensionStep);
      } catch {}
    } else if (action === "minus" && pos.extension > extensionMin) {
      pos.extension -= 1;
      position = await getPosition();

      try {
        await api.get("/?extension=" + -extensionStep);
      } catch {}
    }
    console.log("");
    console.log("x: ", Math.round(position.x * 100) / 100);
    console.log("y: ", Math.round(position.y * 100) / 100);
    console.log("z: ", Math.round(position.z * 100) / 100);
  },
  async gripper(data) {
    const { action } = data;

    if (action === "plus" && pos.gripper < gripperMax) {
      pos.gripper += 1;

      try {
        await api.get("/?gripper=" + gripperStep);
      } catch {}
    } else if (action === "minus" && pos.gripper > gripperMin) {
      pos.gripper -= 1;

      try {
        await api.get("/?gripper=" + -gripperStep);
      } catch {}
    }
  }
};
