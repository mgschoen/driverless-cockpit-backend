const numeric = require('numericjs');
const { hash } = require('./util');

module.exports = {
  updateClusterList: (oldClusters, delta) => {
    let newClusters = {...oldClusters}
    let deltaObject = {};
    for (let cluster of delta) {
      let clusterID = cluster.id;
      let SVD = numeric.svd([[cluster.covXX, cluster.covXY], [cluster.covXY, cluster.covYY]])
      let clusterContent = {
        middleX: cluster.middleX,
        middleY: cluster.middleY,
        angle: (Math.atan2(SVD.U[1][0], SVD.U[0][0])) * 180 / Math.PI,
        width: Math.sqrt(SVD.S[0]),
        height: Math.sqrt(SVD.S[1]),
        color: cluster.color
      };
      clusterContent.hash = hash('' + clusterContent.middleX + clusterContent.middleY + clusterContent.angle +
          clusterContent.width + clusterContent.height);
      deltaObject[clusterID] = clusterContent;
    }
    for (let id in deltaObject) {
      newClusters[id] = deltaObject[id];
    }
    return newClusters;
  },

  updateTrajectory: (oldPoints, additionalPointsXY) => {
    let additionalPoints = [];
    for (let addPoint of additionalPointsXY) {
      additionalPoints.push(addPoint.x);
      additionalPoints.push(addPoint.y);
    }
    let newPoints = [...oldPoints, ...additionalPoints];
    let hashString = '';
    for (let coord of newPoints) {
      hashString += coord;
    }
    return {
      hash: hash(hashString),
      points: newPoints
    };
  }
}