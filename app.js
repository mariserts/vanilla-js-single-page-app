function Component() {

    var self = this;

    self.get_object = function(){
        return null;
    };

};


function Page() {

    var self = this;

    self.get_content = function(){
        return '<h1>Page works!</h1>'
    };
    self.render = function(root_container_id){
        var content_block = document.getElementById(root_container_id);
        content_block.innerHTML = '';
        content_block.innerHTML = self.get_content();
    };

};


function NotFoundPage() {

    Page.call(this);

    var self = this;

    self.get_content = function() {
        return '<h1>Not found</h1>'
    };

};


function PathNotFoundPage() {

    Page.call(this);

    var self = this;

    self.get_content = function() {
        return '<h1>Path not found</h1>'
    };

};


function Route(pattern, page) {

    var self = this;

    self.pattern = pattern;
    self.page = page;

    self.matches_path = function(path) {
        var matches = path.match(new RegExp(self.pattern));
        if (matches !== null){
            if (matches.length !== 0) {
                return true;
            };
        };
        return false;
    };

};


function Router() {

    var self = this;

    self.routes = [];

    self.get_current_path = function() {
        return '/' + window.location.hash;
    };

    self.get_route = function() {
        var path = self.get_current_path();
        for (var i = 0; i < self.routes.length; i++) {
            if (self.routes[i].matches_path(path) === true) {
                return self.routes[i];
            }
        }
        return undefined;
    };

    self.set_route = function(route) {
        self.routes.push(route);
    };

};


function Application(config) {

    var self = this;

    self.config = config
    self.root_container_id = self.config.root_container_id || 'root';
    self.router = self.config.router || new Router();
    self.routes = self.config.routes;
    self.page_404 = self.config.page_404 || new NotFoundPage();
    self.path_404 = self.config.page_404 || new PathNotFoundPage();

    self.render = function() {
        var route = self.router.get_route();
        if (route === undefined) {
            self.path_404.render(self.root_container_id);
            return;
        }
        route.page.render(self.root_container_id);
    };

    self.init = function(){

        var main_container = document.getElementById(self.root_container_id);
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

};
