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

**Note: the client is currently configured to use the dev stage. If you want to use a different stage, 
please configure the config.ts file.**

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

## Configuration
If you deploy the application on your own, please ensure to configure *client/src/config.ts* 
according to your data and the output of the serverless deploy command.

# Implementation and important files
The following sections shortly describe important files for the backend and fronend part of the 
MyDiary serverless application. For a detailed description feel free to have a look at the 
actual source code.

## Backend
The backend implementation is located in the *backend* subfolder of the repository. There a NodeJS 
environment with the appropriate *package.json* and *package-lock.json* as well as the TypeScript 
configuration file *tsconfig.json* is present to ensure proper compilation and setup with npm.

The file *serverless.yml* is read by the serverless package of NodeJS and contains the Amazon AWS 
cloud configuration of the backend including database and file resources, lambda functions to handle 
requests, authentication handlers, tracing and logging configuration etc.

Folder *src* contains the actual sourcecode of the backend. The most important folders and files are:

* auth
  * implementations for the auth0 authentication service
* businessLogic
  * diaryentry.ts
    * contains all the functional logic for the application to work, independent of the actual data access 
    * all the functions of the application (create/delete/update/get entry) are implemented here
* dataLayer
  * diaryentryAccess.ts
    * contains all specific data access implementation to the actual used database (DynamoDB) and file (Amazon S3) infrastructure
    * this may be changed if the underlying resources (e.g. the database) changes without adapting the business logic
* lambda
  * implementation of each lambda function of the cloud backend
  * auth
    * the auth0 authorizer is implemented here
  * http
    * contains all the functions that can be requested through specific browser http calls, with request checks and responses
    * *createEntry.ts* implements the creation of a diary entry
    * *deleteEntry.ts* implements the deletion of a diary entry
    * *generateUploadUrl.ts* implements the browser call to retrieve a time limited URL to upload an image to an S3 bucket
    * *getEntries.ts* implements a function to retrieve all diary entries in order to show the in the fronend list
    * *updateEntry.ts* implements a function to set an attachment URL to an existing diary entry
* models
  * contains interface definitions for diary entries (*DiaryEntry.ts*) and update calls for diary entries (*DiaryUpdate.ts*) for internal communication between business logic, lambdas and data access layer
* requests
  * contains the interface for diary entry creation (*CreateEntryRequest.ts*) and entry update (*UpdateEntryRequest.ts*) in order to parse browser requests correctly
* utils
  * folder for common utilities
  * currently only the logger is present
* validators
  * JSON definitions for the AWS Gateway request validator in order to check for valid requests
  * *create-entry-request.json* defines must have properties for entry creation
  * *update-entry-request.json* defines must have properties for updating an existing entry

## Frontend/Client
The frontend is implemented as NodeJS React single page web application. In it's easiest ways, it 
runs locally and connects to the Amazon AWS backend. The sourcecode is located in the *client* folder 
in this repository.

Like in the backend folder described in the previous section, the client also contains npm files with 
all needed dependencies. In the following part, some important files in the *src* folder are described. 
Please have a look at the actual repository files to gain a complete view on the implementation.

* src
  * all the React application source files are located here
* api
  * definitions for the diary entry API to the backend (*entries-api.ts*)
* auth
  * helpers for the auth0 authentication
* components
  * all the router components for the frontend can be found here
  * *Callback.tsx*
    * loading animation while authentication callback is running
  * *EditEntry.tsx*
    * the view when updating an existing diary entry
    * shows the possibility to select and upload an image for a diary entry
  * *Entries.tsx*
    * the "default" view for listing existing diary entries and creating new ones
  * *LogIn.tsx*
    * the log in screen prior to access the diary
  * *NotFound.tsx*
    * Error screen on not found resources*