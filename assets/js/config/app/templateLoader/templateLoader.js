define(function(){
Marionette.TemplateLoader = (function(Marionette, _) {
    "use strict";

    var templateLoader = { };

    templateLoader.templatePath = 'templates/';
    templateLoader.templateExt = ".html";
    templateLoader.templatePrefix = "";


    templateLoader.loadModuleTemplates = function (module, callback) {
        // walk the views in the provided module
        // gather the templates used by each view
        // then preload them all
        // when done, call the callback
        templateLoader.templatePath = module.templatePath;
        templateLoader.templatePrefix = module.prefix;

        var templatesToLoad = [];
        for (var viewName in module.views) {
            var view = module.views[viewName];
            var template = view.prototype.template

            //Check if template is a separate html if not, do not put in array
            if (!template ||
                typeof template == 'function'){
                continue;
            }

            templatesToLoad.push(view.prototype.template);
        }
        var loadingTemplates = templateLoader.preloadTemplates(templatesToLoad, module);
        if (callback) {
            $.when(loadingTemplates).done(callback);
        }
//        $.when(loadingTemplates).done(function(){
//            if (callback) {
//                callback()
//            }
//        });
    };

    templateLoader.preloadTemplates = function (templateIds, context) {
        var loadAllTemplates = $.Deferred();
        var loadTemplatePromises = [];
        _.each(templateIds, function (templateId, index) {
            loadTemplatePromises[index] = templateLoader.preloadTemplate(templateIds[index], templateLoader);
        });
        var templatesRemainingToLoad = loadTemplatePromises.length;
        _.each(loadTemplatePromises, function (aLoadPromise) {
            $.when(aLoadPromise).done(function () {
                templatesRemainingToLoad--;
                if (templatesRemainingToLoad == 0)
                    loadAllTemplates.resolveWith(context); // 'this' context is the module
            });
        });
        return loadAllTemplates;
    };

    templateLoader.preloadTemplate = function (templateId, context) {
        var loader = $.Deferred();
        var that = this;
        var msg;
        var err;
        if (!templateId || templateId.length == 0) {
            err = new Error('No templateId was specified - please provide a valid template id or filename.');
            err.name = "NoTemplateSpecified";
            throw err;
        }
        var hasHasTag = templateId.substr(0, 1) === '#';
        var template = hasHasTag ? $(templateId).html() : null;
        if (template && template.length > 0) {
            templateLoader.storeTemplate(templateId, template);
            loader.resolveWith(context);

        } else {
            var dashPos = templateId.indexOf('-');
            var fileName = hasHasTag
                ? templateId.substr(1)
                : dashPos > 0
                ? templateId.substr(dashPos + 1)
                : templateId;
            var url = templateLoader.templatePath + fileName + templateLoader.templateExt;

            $.get(url, function (serverTemplate) {
                if (!serverTemplate || serverTemplate.length == 0) {
                    msg = "Could not find template: '" + templateId + "'";
                    err = new Error(msg);
                    err.name = "NoTemplateError";
                    throw err;
                }

                // templateId = (context.templatePrefix) ? context.templatePrefix + templateId : templateId;
                templateLoader.storeTemplate(templateId, serverTemplate);
                loader.resolveWith(context);

            });
            return loader;
        }
    };


    templateLoader.storeTemplate = function(templateId, template) {
        // compile template and store in cache
        console.log("Template loaded: " + templateId);
        template = Marionette.TemplateCache.prototype.compileTemplate(template);
        var cachedTemplate = new Marionette.TemplateCache(templateId);
        cachedTemplate.compiledTemplate = template;
        if (Marionette.TemplateCache.templateCaches[templateId] === undefined)
            Marionette.TemplateCache.templateCaches[templateId] = cachedTemplate;
    };

    return templateLoader;
})(Marionette,_);

});

