function Page() {

    var self = this;

    self.get_content = function(){
        return '<h1>Page works!</h1>'
    };
    self.render = function(main_container_id){
        var content_block = document.getElementById(main_container_id);
        content_block.innerHTML = '';
        content_block.innerHTML = self.get_content();
    };

};


function NotFoundPage() {

    Page.call(this);

    var self = this;

    self.get_content = function(){
        return '<h1>URL path not found</h1>'
    };

};


function Route(
    pattern,
    page
){

    var self = this;

    self.pattern = pattern;
    self.page = page;

    self.matches_path = function(path){
        var matches = path.match(new RegExp(self.pattern));
        if (matches !== null){
            if (matches.length !== 0) {
                return true;
            };
        };
        return false;
    };

};


function Router(){

    var self = this;

    self.routes = [];

    self.get_current_path = function(){
        return '/' + window.location.hash;
    };

    self.get_route = function(){
        var path = self.get_current_path();
        for (var i = 0; i < self.routes.length; i++){
            if (self.routes[i].matches_path(path) === true) {
                return self.routes[i];
            }
        }
        return undefined;
    };

    self.set_route = function(route){
        self.routes.push(route);
    };

};


function Application(
    router,
    routes,
    main_container_id,
    page_404,
){

    var self = this;

    self.main_container_id = main_container_id;
    self.router = router;
    self.routes = routes;
    self.page_404 = page_404;

    self.render = function(){
        var route = self.router.get_route();
        if (route === undefined) {
            page_404.render(self.main_container_id);
            return;
        }
        route.page.render(self.main_container_id);
    };

    self.init = function(){

        var main_container = document.getElementById(self.main_container_id);
        if (main_container === null){
            throw new Error('Main container not found');
        }

        var path = self.router.get_current_path();
        if (path.indexOf('/#/') === -1){
            window.location.href = '/#' + path;
        };

        for (var i = 0; i < self.routes.length; i++){
            self.router.set_route(self.routes[i]);
        };

        self.render();

        window.addEventListener(
            'hashchange',
            function(){
                self.render();
            },
            false
        );

    };

    self.init();

};
