# Computer Parts Store (Admin Page)

## About

This is the management dashboard for a fictional computer parts online store. I have used NodeJS with Express, VanillaJS with EJS Templating, MongoDB, and TailwindCSS to create a management interface for the online store.

Users have to authenticate with a Google account to view the backend, and once authenticated, they have the ability to add, manage, and remove products and categories and track order information.

## Features

The features that I used in this project include:

1. Use arrays, objects, sets or maps to store and retrieve information that is displayed in your app.

2. Analyze data that is stored in arrays, objects, sets or maps and display information about it in your app.

3. Retrieve data from a third-party API and use it to display something within your app.

4. Create a form and store the submitted values using an external API (e.g. a contact form, survey, etc).

5. Create a node.js web server using a modern framework such as Express.js or Fastify. Serve at least one route that your app uses (must serve more than just the index.html file).

6. Interact with a database to store and retrieve information (e.g. MySQL, MongoDB, etc).

## Third Party API Integration

I used Passport.js and Google Cloud Auth to authenticate a user with a Google Account. A user has to sign in to view the dashboard.

### Please Note

I am aware that the Google Client ID and Client Secret are visible in the code and that this is typically frowned upon. This is currently required to function and for the purposes of this project will remain as part of the code. I would like to continue with this project after class ends and will likely move this over to a hosting service so that I can hide the ENV file and make it easier for anyone to view this project without locally hosting it in the future.

## 🛠 To run locally:

1. Clone this repository using your Terminal (Mac and Linux) or Command Prompt (Windows).

```sh
   git clone https://github.com/DakotaRileyMedia/computer-parts-store-admin.git
```

2. Install the LTS version of NodeJS for your machine at https://nodejs.org/en.

3. Once NodeJS has installed, exit your Terminal or Command Prompt so the NodeJS CLI can start to work.

4. Reopen your Terminal or Command Prompt and use it to move into the directory with the product. Replace ## "path" ## with the path where you cloned the project.

```sh
   cd "path"/computer-parts-store-admin/
```

5. Once inside of the directory, we need to install all of our node packages using npm.

```sh
   npm install
```

6. To start the project, use npm to start the webserver.

```sh
   npm start
```

7. Now that our web server has started running, go to your browser and type http://localhost:3000/ in the address bar to visit the project.
