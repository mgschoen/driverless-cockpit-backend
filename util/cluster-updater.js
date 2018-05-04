module.exports = {
  updateClusterList: (oldClusters, delta) => {
    let newClusters = {...oldClusters}
    let deltaObject = {};
    for (let cluster of delta) {
      let clusterID = cluster.id;
      let clusterContent = {...cluster};
      delete clusterContent.id;
      deltaObject[clusterID] = clusterContent;
    }
    for (let id in deltaObject) {
      newClusters[id] = deltaObject[id];
    }
    return newClusters;
  }
}