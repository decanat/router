# decanat-router

Client-side router.

![Router](http://decanat.github.io/router/images/vane.png)

## Installation

Using [component](https://github.com/component/component):

    $ component install decanat/router

Using [npm](http://npmjs.org/) for [browserify](http://browserify.org/):

    $ npm install decanat-router

## Usage

```js
var Router = require('router');

var router = Router();

router.route('/blog/:thread/')
    .use(function(ctx, xxx, next){
        console.log(xxx); // null
        console.log(ctx.params.thread); // thread id parsed from url
        next()
    });

router.listen();
```

## Test

Run unit tests:

    $ make test


## Forebears

This project is inspired my and based on [Page.js](http://visionmedia.github.io/page.js/).

## License

The MIT License.
