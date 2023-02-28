function Page() {

    var self = this;

    self.get_content = function(){
        return '<h1>Page works!</h1>'
    };
    self.render = function(router, route, root_container_id){
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
    self.regexp = new RegExp(self.pattern)

    self.matches_path = function(path) {
        var matches = path.match(self.regexp);
        if (matches !== null){
            if (matches.length !== 0) {
                return true;
            };
        };
        return false;
    };

    self.get_named_groups = function(path) {
        var regexp = self.regexp;
        return regexp.exec(path).groups || {};
    };

};


function Router() {

    var self = this;

    self.routes = [];

    self.get_current_path = function() {
        return self.get_pathname() + self.get_hash();
    };

    self.get_pathname = function() {
        var path = window.location.pathname;
        if (window.location.pathname.indexOf('/') != 0) { path = '/' + path };
        return path;
    };

    self.get_hash = function() {
        var hash = window.location.hash;
        return hash.split('?')[0];
    };

    self.get_query_dict = function() {

        var query_string = window.location.hash;

        var parts = query_string.split('?')[1] || '';
        parts = parts.split('&');

        var dict = {};

        for (var i = 0; i < parts.length; i++){
            var key_value = parts[i].split('=');
            var key = key_value[0];
            if (key !== '') {
                if (dict[key] === undefined){
                    dict[key] = [];
                };
                dict[key].push(key_value[1]);
            };
        };

        return dict;

    };

    self.get_route = function() {

        var path = self.get_hash();

        if (path.indexOf('/') !== 0) {
            path = '/' + path;
        }

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
            self.path_404.render(self.router, self.root_container_id, undefined);
            return;
        }
        route.page.render(self.router, route, self.root_container_id);
    };

    self.init = function(){

        var main_container = document.getElementById(self.root_container_id);
        if (main_container === null){
            throw new Error('Main container not found');
        }

        var path = self.router.get_current_path();
        if (path.indexOf('/#/') === -1){
            window.location.href = path + '#/';
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
