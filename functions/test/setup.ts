

module.exports = async() => {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    try {

        await exec('echo Starting Firestore && export FIRESTORE_EMULATOR_HOST=localhost:8080');

        
        await exec('firebase emulators:start --only firestore &> /dev/null &');
        await exec('sleep 2');

    }catch (err){
       console.error(err);
    };
}