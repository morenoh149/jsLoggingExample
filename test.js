import test from 'ava';
const exec = require('child_process').exec;

test('app prints to stdout', t => {
  return new Promise((resolve, reject) => {
    const server = exec(
      'node ./index.js', 
      { env: { SERVER_PORT: 4000 }}, 
      (error, stdout, stderr) => {
	// not useful as SIGTERM appears as an erroneous exit
        // if (error || stderr) { 
        //   reject();
        // }
        const log = stdout.trim().split('\n');
        resolve(log);
      }
    );
    setTimeout(() => { server.kill('SIGTERM'); }, 1000);
  }).then((log) => {
    t.truthy(log);
  });
});

test('another test to illustrate parallelism', t => {
  return new Promise((resolve, reject) => {
    const server = exec(
      'node ./index.js',
      { env: { SERVER_PORT: 4001 }},
      (error, stdout, stderr) => {
        const log = stdout.trim().split('\n');
        resolve(log);
      }
    );
    setTimeout(() => { server.kill('SIGTERM'); }, 1000);
  }).then((log) => {
    t.true(log.length > 3);
  });
});
