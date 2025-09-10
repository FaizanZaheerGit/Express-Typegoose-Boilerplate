# Express-Typegoose-Boilerplate

This is a Boilerplate project for using Express with Typescript using Typegoose for ORM for MongoDB connection

Created By Faizan Zaheer

This Project contains the following: -

1. Express Server Setup And Routing with MVC File Folder Structure for Typescript
2. Mongoose Models created with heavily typed, Typegoose library
3. Repository Pattern with abstract class
4. Zod for validations
5. Basic Auth Flow , using encrypted JWT and Passport
6. Email Sending, SMS Sending
7. Event Emitter Publisher and Subscriber Pattern for Optimization
8. Bull Queues with Redis for Sending Emails and SMS
9. Prettier and ESLint Setup
10. Swagger API documentation
11. Optimized Docker Build
12. Graceful Shutdown


Before running the main project make sure that queue processors are running using :-
1. npm run start:email-bullq-worker 
2. npm start:sms-bullq-worker


For running this example run cmd on cli, npm run start,

For running in development watch mode, run cmd on cli, npm run start:dev

<!-- Before running docker build or docker-compose up , make sure to run pnpm i to generate a pnpm-lock.yaml file -->
