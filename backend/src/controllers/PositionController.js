const math = require("mathjs");
const Position = require("../models/Position.js");

module.exports = {
  async store(request, response) {
    function toRadians(angle) {
      return angle * (Math.PI / 180);
    }

    const {
      alphaMin,
      alphaMax,
      alphaN,
      betaMin,
      betaMax,
      betaN,
      thetaMin,
      thetaMax,
      thetaN
    } = request.body;

    const l_21 = 0;
    const l_10 = 35;
    const pos_cum = [];

    for (let alpha = alphaMin; alpha < alphaMax; alpha += alphaN) {
      for (let theta = thetaMin; theta < thetaMax; theta += thetaN) {
        for (let beta = betaMin; beta < betaMax; beta += betaN) {
          const M_21 = [
            [Math.cos(toRadians(theta)), 0, -Math.sin(toRadians(theta)), l_21],
            [0, 1, 0, 0],
            [Math.sin(toRadians(theta)), 0, Math.cos(toRadians(theta)), 0],
            [0, 0, 0, 1]
          ];
          const M_10 = [
            [Math.cos(toRadians(beta)), -Math.sin(toRadians(beta)), 0, 0],
            [Math.sin(toRadians(beta)), Math.cos(toRadians(beta)), 0, 0],
            [0, 0, 1, l_10],
            [0, 0, 0, 1]
          ];

          const M_20 = math.multiply(M_10, M_21);
          const ponto = [alpha, 0, 0, 1];
          const pos = math.multiply(M_20, ponto);
          pos_cum.push({ x: pos[0], y: pos[1], z: pos[2], alpha, beta, theta });
        }
      }
    }

    const positions = await Position.insertMany(pos_cum);

    return response.status(200).json(positions);
  }
};
