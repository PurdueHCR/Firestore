


module.exports = async() => {
    const util = require('util');
    const exec = util.promisify(require('child_process').exec);
    try {
        const { firestoreStdOut, firestoreStdErr } = await exec('pkill java');
        console.log('stdout:', firestoreStdOut);
        console.log('stderr:', firestoreStdErr);

        const { stdout, stderr } = await exec('sleep 2');
        console.log('stdout:', stdout);
        console.log('stderr:', stderr);
    }catch (err){
       console.error(err);
    };
}