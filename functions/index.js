const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const database = admin.database();

exports.addDevice = functions.https.onRequest((req, res) => {
  const { name, type, version } = req.query;
  console.log("ITDBG - addDevice", name);
  database.ref(`/devices`).push({ name: name, type: type, version: version });
  return res.status(200).send({ message: `Device (${name}) was saved` }).end();
});

exports.addUser = functions.https.onRequest((req, res) => {
  const { name, password } = req.query;
  console.log("ITDBG - addUser", name);
  database.ref(`/users`).push({ name: name, password: password });
  return res.status(200).send({ message: `User (${name}) was saved` }).end();
});

exports.getDevice = functions.https.onRequest((req, res) => {
  const { deviceId, userId } = req.query;
  console.log("ITDBG - getDevice", deviceId, userId);
  database.ref(`/devices/${deviceId}/userId`).set(userId);
  return res
    .status(200)
    .send({
      message: `User (${userId}) get device (${deviceId})`
    })
    .end();
});

exports.putDevice = functions.https.onRequest((req, res) => {
  const { deviceId } = req.query;
  console.log("ITDBG - putDevice", deviceId);
  database.ref(`/devices/${deviceId}/userId`).set(null);
  return res
    .status(200)
    .send({
      message: `removed device with id = ${deviceId}`
    })
    .end();
});

exports.fetchUsers = functions.https.onRequest((req, res) => {
  database.ref(`/users`).once("value", snapshot => {
    const users = snapshot.val();
    const result = Object.keys(users).map(key => {
      var user = users[key];
      user.id = key;
      return user;
    });
    return res
      .status(200)
      .send({
        users: result,
        message: `users`
      })
      .end();
  });
});

exports.fetchDevices = functions.https.onRequest((req, res) => {
  database.ref(`/devices`).once("value", snapshot => {
    const devices = snapshot.val();

    const result = Object.keys(devices).map(key => {
      var device = devices[key];
      device.id = key;
      return device;
    });
    return res
      .status(200)
      .send({
        devices: result,
        message: `devices`
      })
      .end();
  });
});

exports.getDevicesForPrint = functions.https.onRequest((req, res) => {
  database.ref(`/devices`).once("value", snapshot => {
    const devices = snapshot.val();
    return res
      .status(200)
      .send({
        devices: Object.keys(devices)
          .map(key => `\nd|${devices[key].name}|${key}\n`)
          .join(""),
        message: `devices`
      })
      .end();
  });
});

exports.getUsersForPrint = functions.https.onRequest((req, res) => {
  database.ref(`/users`).once("value", snapshot => {
    const users = snapshot.val();
    return res
      .status(200)
      .send({
        devices: Object.keys(users)
          .map(key => `\nu|${users[key].name}|${key}\n`)
          .join(""),
        message: `users`
      })
      .end();
  });
});
