const Position = require("../models/Position.js");
const axios = require("axios");

const api = axios.create({
  baseURL: "http://192.168.0.150"
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

const rotationStep = 7.5833;
const elevationStep = 10;
const extensionStep = 77.777;
const gripperStep = 35;

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

        await api.get(`/?rotation=${Number(beta) * rotationStep}`);
        await api.get(`/?elevation=${-(Number(theta) * elevationStep)}`);
        await api.get(`/?extension=${(Number(alpha) - 30) * extensionStep}`);
        pos.rotation = beta;
        pos.elevation = theta;
        pos.extension = alpha;
      } else {
        console.log("Pontos não existem!");
      }
    }

    if (gripper) {
      await api.get(`?gripper=${-(Number(gripper) * gripperStep)}`);
      pos.gripper = gripper;
    }
  },
  async rotation(data) {
    const { action } = data;
    let position = {};

    if (action === "plus" && pos.rotation < rotationMax) {
      pos.rotation += 1;
      position = await getPosition();

      await api.get(`/?rotation=${Number(position.beta) * rotationStep}`);
    } else if (action === "minus" && pos.rotation > rotationMin) {
      pos.rotation -= 1;
      position = await getPosition();

      await api.get(`/?rotation=${Number(position.beta) * rotationStep}`);
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

      await api.get(`/?elevation=${-(Number(position.theta) * elevationStep)}`);
    } else if (action === "minus" && pos.elevation > elevationMin) {
      pos.elevation -= 1;
      position = await getPosition();

      await api.get(`/?elevation=${-(Number(position.theta) * elevationStep)}`);
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

      await api.get(
        `/?extension=${(Number(position.alpha) - 30) * extensionStep}`
      );
    } else if (action === "minus" && pos.extension > extensionMin) {
      pos.extension -= 1;
      position = await getPosition();

      await api.get(
        `/?extension=${(Number(position.alpha) - 30) * extensionStep}`
      );
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

      await api.get(`?gripper=${-(Number(pos.gripper) * gripperStep)}`);
    } else if (action === "minus" && pos.gripper > gripperMin) {
      pos.gripper -= 1;

      await api.get(`?gripper=${-(Number(pos.gripper) * gripperStep)}`);
    }
  }
};
