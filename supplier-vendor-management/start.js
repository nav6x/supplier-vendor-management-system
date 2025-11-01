const { exec } = require('child_process');

console.log('Building the application...');
exec('npm run build', (error, stdout, stderr) => {
  if (error) {
    console.error(`Build error: ${error}`);
    return;
  }
  
  console.log('Build completed successfully!');
  console.log('Starting the application...');
  
  exec('npm run start:prod', (error, stdout, stderr) => {
    if (error) {
      console.error(`Start error: ${error}`);
      return;
    }
    
    console.log('Application started successfully!');
    console.log('Visit http://localhost:3000 to access the application.');
  });
});