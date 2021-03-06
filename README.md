# ![Router](http://decanat.github.io/router/images/vane-s.png) decanat-router

Client-side router.

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
    .use(function(ctx, next){
        console.log(ctx.params.thread); // thread id parsed from url
        next()
    });

router.listen();
```

## Test

Run unit tests:

    $ make test

## Forebears

  - <https://github.com/visionmedia/page.js>
  - <https://github.com/ianstormtaylor/router>

## License

The MIT License.
