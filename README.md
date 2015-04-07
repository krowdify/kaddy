## Kaddy - Open source API Explorer by [krowdify](http://www.krowdify.com) 


Krowd Kaddy is an experimental JSON based API explorer. It is currently pretty alpha but
we do use it every day.  Feel free to create issues and improve the code so we can make this 
project successful.

![screenshot](https://raw.github.com/krowd/kaddy/master/img/screenshot1.png)

## Working with Kaddy

This is just HTML and Javascript so all you need is a webserver to load the code on so you can make 
JSON requests.

Edit the data file for your API or sign up for krowd.io and see our API in action.

    data/krowd.json

If you create your own json configuration file just edit line #70 in `js/krowd.js`
    
    $.getJSON('data/FILENAME.json', function(data) {

## Authentication

You can modify the authentication schema at line #200 in `js/krowd.js`. This block of code will set your authorization headers.  
This will have to be tweaked to match your authentication schema.  Since we use Oauth2 based calls for krowd.io this is the schema 
we have in place. If you don't require authentication simply set the `headers = []` to an empty array.

## Disclosures

Again this is alpha but works quite well if you understand Javascript this should be no problem for you to handle.  

[http://www.krowdify.com](http://www.krowdify.com)

[Krowd.io](http://krowd.io) is a social "Platform as a Service" (PaaS) that delivers the backend for social applications on any device or platform. 

Copyright 2012-2015 Krowdify
