# This doesnt work right now
#  need a way to open a new terminal for each server
cd ..
cd ..
cd frontend
npx nodemon index.js
cd ..
cd proxy-1
npx nodemon index.js
cd ..
cd mock-site
npx nodemon index.js
echo("success! Running servers on ports: 3004, 3005, 4000")