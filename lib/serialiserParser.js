function stringifyReplacer(key, value) {
    if (key === 'service') {
        return undefined;
    }
    else if (key === 'name' && !value.events) {
        return undefined;
    }
    else if (key === 'type') {
        return undefined;
    }
    else {
        return value;
    }
}
function stringify(services) {
    return JSON.stringify(jsonify(services), null, '  ');
}
exports.stringify = stringify;
function jsonify(services) {
    var jsonified = {};
    Object.keys(services).forEach(function (name) {
        var service = services[name];
        var jsonifiedService = {
            methods: {},
            events: {}
        };
        jsonified[name] = jsonifiedService;
        if (service.methods) {
            Object.keys(service.methods).forEach(function (name) {
                var method = service.methods[name];
                var jsonifiedMethod = {};
                Object.keys(method).forEach(function (key) {
                    if (key !== 'name' && key !== 'service' && key !== 'type') {
                        jsonifiedMethod[key] = method[key];
                    }
                });
                jsonifiedService.methods[name] = jsonifiedMethod;
            });
        }
        if (service.events) {
            Object.keys(service.events).forEach(function (name) {
                var event = service.events[name];
                var jsonifiedEvent = {};
                Object.keys(event).forEach(function (key) {
                    if (key !== 'name' && key !== 'service' && key !== 'type') {
                        jsonifiedEvent[key] = event[key];
                    }
                });
                jsonifiedService.events[name] = jsonifiedEvent;
            });
        }
    });
    return jsonified;
}
exports.jsonify = jsonify;
function parse(serviceString) {
    return dejsonify(JSON.parse(serviceString));
}
exports.parse = parse;
function dejsonify(jsonified) {
    var services = {};
    Object.keys(jsonified).forEach(function (name) {
        var jsonifiedService = jsonified[name];
        var service = {
            name: name,
            methods: {},
            events: {}
        };
        services[name] = service;
        if (jsonifiedService.methods) {
            Object.keys(jsonifiedService.methods).forEach(function (name) {
                var jsonifiedMethod = jsonifiedService.methods[name];
                var method = {
                    name: name,
                    service: service
                };
                Object.keys(jsonifiedMethod).forEach(function (key) {
                    method[key] = jsonifiedMethod[key];
                });
                service.methods[name] = method;
            });
        }
        if (jsonifiedService.events) {
            Object.keys(jsonifiedService.events).forEach(function (name) {
                var jsonifiedEvent = jsonifiedService.events[name];
                var event = {
                    name: name,
                    service: service
                };
                Object.keys(jsonifiedEvent).forEach(function (key) {
                    event[key] = jsonifiedEvent[key];
                });
                service.events[name] = event;
            });
        }
    });
    return services;
}
exports.dejsonify = dejsonify;
//# sourceMappingURL=serialiserParser.js.map