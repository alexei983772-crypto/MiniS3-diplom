const { execFile } = require("child_process");
const path = require("path");

const ENGINE_PATH = path.join(
  __dirname,
  "../storage_engine.exe"
);

function runEngine(args) {
  return new Promise((resolve, reject) => {
    execFile(
      ENGINE_PATH,
      args,
      (err, stdout, stderr) => {
        if (err) {
          return reject(err);
        }

        resolve(stdout.trim());
      }
    );
  });
}

module.exports = {
  runEngine,
};
