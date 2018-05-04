# Baker Loyalty

This is a loyalty application code example intended for Baker Technologies.  This application was modeled after the FiveStars application commonly found in local retail stores such as vape/e-cigarette shops.  This application should run happily on a kiosk device.  If you have any questions, please don't hesitate to ask.  Part of creating software is supporting that software. :)


## Getting Started

These instructions will get you a copy of the project up and running on your local machine for testing purposes.

### Prerequisites

* Node.js (and npm) - v8.0.0+ 
* Grunt (grunt-cli) - v1.2.0+

### Optional Prerequisites

* Yarn - v1.6.0+
* Docker - v18.0.0+


### Installing

To install the application, you simply need to use npm or yarn to install the dependencies, then build the bundle. 
```
npm install
```

or

```
yarn
```

Once you have installed the dependencies, you may build the bundle by running:
```
grunt
```


If you would like to use the docker variant, navigate to the local clone and run:
```
docker build --no-cache -t baker-loyalty .
```


## Running the tests

Only simple tests have been included in this example.
To run the linter, please run Grunt:
```
grunt
```

## Running the application
To run the application you simply need to run:
```
npm start
```
or
```
yarn start
```

Please note that a .env file is checked into this repository, and may be modified if needed.

This is not normally done, but was done so for simplicity.

## Deployment

Deployment only applies to the Docker variant of the application.
To 'deploy' the application locally, you must run:
```
docker run baker-loyalty
```

## Accessing the Application
The application can be found at https://localhost:3000

For simplicity, you may also use this link: [Baker Loyalty](http://localhost:3000)

## Known Issues
Certain mail hosts do not work with the sendmail tool configuration used, and require authentication and/or a hostname matching the sending ip to send mail to users of the system.  One notable example of this is Google's GMail service.  In a production system the sendmail call used in this application would reference a real SMTP host to send mail from, which would prevent these issues.  You will recognize this issue by the ETIMEDOUT error at the console logs.  Due to the nature of this example, authentication or guaranteeing the hostname are not possible.

## TODO
* Add unit tests
* Minimize use of uncached selectors
* Leverage promises more heavily in the API where applicable
* Move API to separate instance, and use API tokens for auth on calls


## Author

* **Elden Armbrust** - [Personal Site](https://eldenarmbrust.com)
