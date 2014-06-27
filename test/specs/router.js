expect = chai.expect;

var Router = require('router');


describe('Testing:', function(){
    describe('Constructor', function(){
        it('should be proper type', function(){
            expect(Router)
                .to.be.a('function');
        });

        it('should work with or without `new`', function(){
            expect(Router())
                .to.be.instanceof(Router);

            expect(new Router())
                .to.be.instanceof(Router);
        });

        it('should be "extendable"', function(){
            var Vein = Router.extend();

            var vein = new Vein();

            expect(vein)
                .to.be.instanceof(Vein)
                .to.be.instanceof(Router);
        });
    });

    describe('Instance', function(){
        var router = Router();

        it('should initialize in neutral state', function(){
            expect(router)
                .to.have.property('mntPath', '');

            expect(router)
                .to.have.property('parent', null);

            expect(router)
                .to.have.property('nodes')
                .to.be.an('array')
                .to.have.length(0);

            expect(router.root)
                .to.equal(router);

            expect(router.running)
                .to.not.be.ok;
        });

        it('should be an "emitter"', function(done){
            expect(router)
                .to.respondTo('on')
                .to.respondTo('once')
                .to.respondTo('off')
                .to.respondTo('emit');

            router.once('next', done);

            router.emit('next')
        });
    });

    describe('Mounting', function(){
        var router;

        beforeEach(function(){
            router = Router();
        });

        it('should mount properly with `mount` event', function(done){
            var r1 = Router();

            r1.on('mount', function(mntPath){
                expect(this)
                    .to.be.an.instanceof(Router)
                    .to.equal(r1)
                    .to.have.property('parent', router);

                expect(this.root)
                    .to.equal(router);

                expect(this.mntPath)
                    .to.equal(mntPath)
                    .to.equal('/mnt');

                done();
            });

            router.mount('/mnt', r1);
        });

        it('should keep correct chain data', function () {
            var r1 = Router(),
                r2 = Router();

            router.mount('/mnt1', r1);
            r1.mount('/mnt2', r2);

            expect(r1.base)
                .to.equal('/mnt1');
            expect(r2.base)
                .to.equal('/mnt1/mnt2');

            expect(r2.root)
                .to.equal(router);
        });

        it('should normalize mountpath', function(){
            var r1 = Router(),
                r2 = Router(),
                r3 = Router(),
                r4 = Router();

            router.mount('/mnt1', r1);
            router.mount('/mnt2/', r2);
            router.mount('mnt3/', r3);
            router.mount('mnt4/mnt', r4);

            expect(r1.base)
                .to.equal('/mnt1');

            expect(r2.base)
                .to.equal('/mnt2');

            expect(r3.base)
                .to.equal('/mnt3');

            expect(r4.base)
                .to.equal('/mnt4/mnt');
        });


        it('should iterate over node routers with `.each`', function(){
            var r1 = Router(),
                r2 = Router();

            router.mount('/mnt1', r1);
            router.mount('/mnt2', r2);


            expect(router.nodes)
                .to.have.length(2);

            var spy = sinon.spy();

            var r1s = spy.withArgs(r1, '/mnt1'),
                r2s = spy.withArgs(r2, '/mnt2');

            router.each(spy);

            expect(r1s.calledOnce)
                .to.be.ok;

            expect(r2s.calledOnce)
                .to.be.ok;

            expect(spy.alwaysCalledOn(router))
                .to.be.ok;
        });
    });


    describe('Routing', function(){
        var router;

        beforeEach(function(){
            router = Router();
        });

        it('should perform initial dispatch by default', function(done){
            router.route('/')
                .use(function(){
                    expect(router.running)
                        .to.be.ok;
                    done();
                });

            router.listen();
        });

        it('should stop when mounted', function(){
            var r = Router();

            var spy = sinon.spy(r, 'stopListening');

            r.listen();

            expect(r.running)
                .to.be.ok;

            router.mount('/mnt', r);

            expect(spy.called)
                .to.be.ok;

            expect(r.running)
                .to.not.be.ok;
        });

        it('should route relative to mountpath', function(){
            var r = Router();

            var spy = sinon.spy(router, 'show');

            router.mount('/mnt', r);

            r.show('test');

            expect(spy.withArgs('/mnt/test').called)
                .to.be.ok;
        });

        it('should propogate from top to bottom', function(){
            var router0 = Router();

            var spyD = sinon.spy(router, 'dispatch'),
                spyS = sinon.spy(router, 'show'),
                spy0D = sinon.spy(router0, 'dispatch'),
                spy0S = sinon.spy(router0, 'show');

            router0.mount('/mnt0', router);

            router.show('/test/');

            // router.show -> router0.show ->
            // -> router0.dispatc -> router.dispatch

            expect(spyS.calledBefore(spy0S))
                .to.be.ok;

            expect(spy0D.calledBefore(spyD))
                .to.be.ok;
        });

        it.skip('should listen to "popstate" events', function(){
            router.listen();

            var spy = sinon.spy(router, 'show');

            history.go(-1);

            expect(spy.called)
                .to.be.true;
        });

        afterEach(function(){
            router.stopListening();
        });
    });

    describe('Route', function(){
        var router,
            route1, route2, route3;

        beforeEach(function(){
            router = Router();

            route1 = router.route('/test/');
            route2 = router.route('/test/*');
            route3 = router.route('/test/:section');
        });


        it('should match express-style routes correctly', function(){
            var path1 = '/test/',
                path2 = '/test/something';

            expect(route1.match(path1))
                .to.be.true;

            expect(route2.match(path1))
                .to.be.true;

            expect(route3.match(path1))
                .to.be.false;

            expect(route1.match(path2))
                .to.be.false;

            expect(route2.match(path2))
                .to.be.true;

            expect(route3.match(path2))
                .to.be.true;
        });

        it('should accept RegExp rules', function(){
            var route0 = router.route(/^\/mr(.*)cat(\/?)$/i);

            expect(route0.match('/mr-goodcat'))
                .to.be.true;

            expect(route0.match('/mr-baddog'))
                .to.be.false;
        });

        it('should ignore querystring while testing', function(){
            var path = '/test/something?and=then&something=else';

            expect(route1.match(path))
                .to.be.false;

            expect(route2.match(path))
                .to.be.true;

            expect(route3.match(path))
                .to.be.true;
        });

        it('should populate `params` based on context', function(){
            var path = '/test/goodcat';

            var params1 = [],
                params2 = [],
                params3 = [];

            route1.populate(path, params1);
            route2.populate(path, params2);
            route3.populate(path, params3);

            expect(params1)
                .to.eql([]);

            expect(params2)
                .to.eql(['goodcat']);

            expect(params3)
                .to.have.property('section', 'goodcat');
        });

        it('should invoke passed functions as middleware', function(done){
            var context = {
                    path: '/test/goodcat',
                    params: []
                };

            route3.use(function(ctx, req, next){
                ctx.something = 'custom';

                next();
            });

            route3.use(function(ctx, req, next){
                expect(ctx)
                    .to.have.property('something', 'custom');

                next()
            });

            expect(route3.wares)
                .to.be.an('array')
                .to.have.length(2);

            route3.dispatch(context, null, done)
        });

        it('should act correctly when mounted', function(done){
            var router0 = Router();

            router0.mount('/mnt0', router);

            route3.use(function(ctx, req, next){
                expect(ctx.params)
                    .to.have.property('section', 'baddog');

                done();
            });

            router0.show('/mnt0/test/baddog');
        });
    });

    describe('Context', function(){
        var router, route, path;
        beforeEach(function(){
            router = Router();
            route = router.route('*');
            path = '/test/something?and=then&something=else';
        });

        it('should parse querystring as "search"', function(done){
            route.use(function(ctx){
                expect(ctx.search)
                    .to.equal('?and=then&something=else')

                expect(ctx.query)
                    .to.eql({ and: 'then', something: 'else' });

                done();
            });

            router.show(path);
        });

        it('should expose different "paths" when mounted', function(done){
            var router0 = Router();

            route.use(function(ctx){
                expect(ctx.path)
                    .to.equal(path);

                expect(ctx.canonicalPath)
                    .to.equal('/mnt' + path);

                expect(ctx.pathname)
                    .to.equal('/mnt/test/something');

                done();
            });

            router0.mount('/mnt', router);

            router0.show('/mnt' + path);
        });

        it('should expose hashtag', function(done){
            route.use(function(ctx){
                expect(ctx.hash)
                    .to.equal('#hello');

                done();
            });

            router.show('#hello');
        });
    });

    after(function(){
        setTimeout(function(){
            Router().show('/');
        }, 500);
    });
});
