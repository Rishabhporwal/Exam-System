# Instructions for accessing application:

- Steps for running application
	- clone git repository
	- Go to Application folder and on cli type "npm install"
	- npm start
	- Register a user using signup api
	- login with that user using login api. It will generate a token, use that token to access other api's like getquestions, submitanswers and leadersboard api's by passing token in header. 




# API: There are total 7 API's

	- Signup API
	- Login API
	- Add Question API
	- Add Answer API
	- Get Questions API
	- Submit Answer API
	- Leaders Board API

	Note: Request and responses of all above API's are in API Collection(Postman) folder.



# Database: MongoDB is used as Database. There are total 5 collections

- Collections: 
	- Users
	- Question
	- Answer
	- User Answers
	- User Questions

	Note: All collection structure is in Applicaion/models folder inside application. You have to upload all the questions ans answers json in mongodb database to access test, json is available in DB Collection folder. You can also insert questions and answers in DB Using Add Qestions and Add Answers API.

