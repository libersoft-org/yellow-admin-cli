const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

class App {
 run() {
  const args = process.argv.slice(2);
  switch (args.length) {
   case 0:
    console.log('no command passed, start server on nemp-server');
    break;
   case 1:
    if (args[0] === '--module-identity-add') return this.fetchModule('identity');
    if (args[0] === '--module-messages-add') return this.fetchModule('messages');
    if (args[0] === '--module-contacts-add') return this.fetchModule('contacts');
    else this.getHelp();
    break;
   default:
    this.getHelp();
    break;
   }
  }

 getHelp() {
  console.log('Command line arguments:');
  console.log('');
  console.log('--help - to see this help');
  console.log('--module-identity-add - to add identity module');
  console.log('--module-messages-add - to add messages module.');
  console.log('--module-contacts-add - to add contacts module.');
  console.log('');
 }
 fetchModule(moduleName) {
  let repo = 'https://github.com/libersoft-org/';
  let filePath = '';
  let modulesRoot = '../../server-modules';
  let modulesPrefix = 'nemp-server-module-'
  if(moduleName === 'identity' || moduleName === 'messages' || moduleName === 'contacts') {
   repo = repo + modulesPrefix + moduleName;
   filePath = path.join(__dirname, modulesRoot, modulesPrefix + moduleName);
   if(!fs.existsSync(filePath)) {
    exec(`cd ${modulesRoot} && git clone ${repo}`, (error, stdout, stderr) => {
     if (error) {
      console.error(`Clone error: ${error}`);
      return;
     }
     if(stdout) console.log(`stdout (clone): ${stdout}`);
     if(stderr) console.error(`stderr (clone): ${stderr}`);
    });
    return;
   }
   exec(`cd ${modulesRoot} && git config pull.rebase false && git pull ${repo}`, (error, stdout, stderr) => {
    if (error) {
     console.error(`Pull error: ${error}`);
     return;
    }
    if(stdout) console.log(`stdout (pull): ${stdout}`);
    if(stderr) console.error(`stderr (pull): ${stderr}`);
    return;
   });
  }
 }
}

new App().run();
