# Express-Typegoose-Boilerplate

This is a Boilerplate project for using Express with Typescript using Typegoose for ORM for MongoDB connection

Created By Faizan Zaheer

This Project contains the following: -

1. Express Server Setup And Routing with MVC File Folder Structure for Typescript
2. Mongoose Models created with heavily typed, Typegoose library
3. Repository Pattern with abstract class
4. Zod for validations
5. basic auth flow , using encrypted JWT and passport
6. email sending, SMS sending
7. Event emitter publisher and subscriber pattern for optimization
8. Bull Queues with Redis for sending Emails and SMS
9. prettier and eslint setup
10. Swagger API documentation
11. Optimized Docker build


Before running the main project make sure that queue processors are running using :-
1. npm | pnpm run start:email-bullq-worker 
2. npm | pnpm start:sms-bullq-worker


For running this example run cmd on cli, npm | pnpm run start,

For running in development watch mode, run cmd on cli, npm | pnpm run start:dev

<!-- Before running docker build or docker-compose up , make sure to run pnpm i to generate a pnpm-lock.yaml file -->
