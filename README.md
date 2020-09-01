# Capstone Project: My Diary

This is the implementation of a serverless cloud application for Udacity's Cloud Developer Nanodegree program capstone project. The application provides a personal online diary users can login and write a diary each day. Also the ability to upload a file for the day is given so the users can e.g. provide an image that fits to the user's mood at that day.

# Functionality of the application

The application allows to create, remove, update and get diary entries from a database and show them with a local running React based frontend. Users only have access to the items he/she has created.

# Diary entry

The application stores the diary entries, where each entry may contain the following fields:

* `userId` (string) - a unique id for the user that owns "owns" the diary entry
* `entryid` (string) - a unique id for an diary entry
* `createdAt` (string) - date and time the diary entry was created
* `title` (string) - a title for the diary entry, e.g. to summary the mood on that day
* `content` (string) - the text content of the entry
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to the diary entry

# How to setup and deploy the application
You need a working NodeJS 12.x instance in order to run the following commands to setup and deploy 
the components of this project.

## AWS Serverless Backend
All the backend code is located in the folder called *backend* in this repository. To set up and 
deploy it, change into the folder and run the following commands:

```console
# cd backend
# npm install
# sls deploy --stage=<dev, prod>
```

First, all dependencies from package.json are installed. The serverless package is the main component 
that deploys the backend to Amazon AWS. The deployment itself is done with the sls deploy command, 
optionally with the stage parameter to set the deployment state. 

Please observe the output if there are any errors on deployment.

## Frontend/Client
The client side of the project is also done in node as a React single page application. To set it up, 
run the following commands:

```console 
# cd client
# npm install
# npm run start
```

Again, npm install uses package.json to install all needed dependencies. After this is done, with 
the npm run start command the local webserver can be started. In the browser, connect to 
http://localhost:3000 in order to use the app.

# Implementation and important files
+++ TODO +++

## Backend
+++ TODO +++

## Frontend/Client
+++ TODO +++
