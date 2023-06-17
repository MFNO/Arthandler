# Arthandler
## Description
Photography website designed to display photographs in a simple manner.
## Features
### Website
The public facing website itself is fairly simple, it's a static React app displaying images in a carousel.
### Management Portal
The interesting feature is the management portal.

The photographer is able to log-in using OAuth and dynamically add:
1. New projects
2. Photos to that project
3. The order of the photos
4. Contact informatoin
# Technologies
## Front-End

The website itself is built with a React front-end running on a Vite development server. 

The CSS framework is Tailwind.
## Back-End
The back-end runs on AWS and is setup via the SST framework.

It employs REST APIs accessing a DynamoDB.

Images are stored in S3.
## Authentication
Authentication is reached via the open OAuth protocol.



## References
https://sst.dev/examples/how-to-create-a-reactjs-app-with-serverless.html

https://oauth.net/code/javascript/

https://vitejs.dev/guide/

https://docs.sst.dev/constructs/StaticSite
