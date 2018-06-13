import fs from 'fs';

const { log, error } = console;

const createFile = (filename) => {
  fs.open(filename,'r', (err) => {
    if (err) {
      fs.writeFile(filename, '', function(err) {
          if(err) {
              error(err);
          }
          log('File creation successful!');
      });
    } else {
      log('DB file exists!');
    }
  });
};

export default createFile;
