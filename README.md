

# About this project
- This is the capstone project of the per scholas engineering course
- this is intended to demonstrate proficiency in the mern stack, including but not limited to:
  - fundamental programming concepts
  - responsive web design
  - fundamental and advanced react concepts
  - understanding and implementation of a RESTful server with database connection

- This app is called protasker, with the intention of allowing a user to create, update, and delete projects, as well as invite users to collaborate with one another on projects

# LIVE DEPLOY:
- https://perscholas-capstone-frontend.onrender.com/
- side note: the front end, back end, and mongodb are all hosted on free services, and may take a while to be accessible.  Please be patient, give the front end about a minute and refresh.

 # Backend repository:
 - https://github.com/Defnar/perscholas-capstone-backend

# App setup/installation
- After downloading your files, you will need a .env file with the following parameters:
  ```
  VITE_API_URL=
  VITE_ORIGIN_URL=
  ```
  - the VITE_API_URL is the backend url and should contain `/api` at the end, as the program is configured to already have api in the base url
  - origin url should be the url from which the front end is running, for example it would be `http://localhost:5173` on vite/react being the default address from which it runs
 
# Dependencies
## Dev
- react/vite setups
## nonDev 
- heroicons/react
- tailwindcss/vite
- axios
- react-icons
- react-router-dom
- react-toastify


# Features
- Users may create/update/delete tasks based on defined permissions.
- Users may designate their project as public or private.  Public projects are shown on the front page, and other users may send a request to join the project
- From within the page, users who have the permission to do so may invite other users as well
- implemented a double token system, allowing a short-term token to be saved in state, and a resfresh token to be stored in httponly cookie.  On app refresh or open, it will attempt to log user in using the refresh token if it exists
- implemented the ability for a project owner to update the permissions another user has for a project
- 
# Missing/Planned features
- users are not yet able to leave a project they are collaborating on.  the endpoint on the backend is set up, but no frontend connection has been made yet
- users are not informed if their requests have been accepted or rejected yet, as this would take frontend and backend work
- functionality to allower a user to display a different number of projects on the page
- custom invite/join request messages
- separate archive lists for projects and tasks

# Potential features
- using websockets to create a notification system and more robust message system.
- handling cases where multiple users are updating, probably using data access timestamps to update timestamps.

