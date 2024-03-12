# LightBnB
A simple multi-page Airbnb clone that uses a server-side Javascript to display the information from the queries to web pages via SQL queires.

# The Goal
This repository was built to help build my skills in database management.

# Getting Started
1 - Fork and Clone this repo
2 - Install dependancies using this command ```npm install```
3 - Start the server database using this command ```startpostgres```
4 - Connect to postgres using this command ```psql```
4 - Create the "lightbnb" database using this command ```CREATE DATABASE ligghtbnb;```
5 - Connect to the newly created database using this command ```\c lightbnd```
6 - Create the database tables with ```\i migrations/01_schema.sql```
7 - Add the data with these commands: ```\i seeds/01_seeds.sql``` and ```\i seeds/02_seeds.sql```

Now you are ready to launch the server with the ```npm run local command```
Visit localhost:3000 to view the webpage

# Acknowledgments
This product was built with very heavy guidance from the LHL staff!