__Welljs__ - это, основанный на AMD (Asynchronous Module Definition), JavaScript-фреймворк предназначенный для развертывания и масштабирования клиентских приложений. Ключевая особенность - систематизированная работа с модулями и их зависимостями. В качестве AMD-движка Well использует [Require.js](http://requirejs.org/), но позволяет легко заменить его на любой другой.

Так выглядит модуль  Well:

```JavaScript
// в любой модуль в качестве аргумента передается
// ссылка на приложени
wellDefine('Views:Pages:AboutWell', function(app) {
  // зависимости можно подключать последовательно одна за другой, 
  // или цепочкой this.use().use().use().options().export();
  this.use('Views:Common:Page');
  this.use('Views:Partials:Sidebar');
  this.use('Plugins:VendorName:PluginName');
  // тут хранятся дополнительные параметы, к которым можно обратиться 
  // через someModule.getOption('paramName')
  this.options({
    template: 'Pages:AboutWell',
    otherOption: 'paramValue'
  });
  // эта колбэк-функция вызовется при app.Module.get('Views:Pages:AboutWell');
  this.exports(function(args) {
    // module code
    // all the dependencies are available here
    return app.Modules.get('Views:Common:Page').extend({
      //Backbone page view
    });
  });
});
```
Для удобного ориентирования, наименования модулей в Welljs соответствуют их путям. Т.е. `'Views:Pages:AboutWell'` хранится в `views/pages/about-well.js`. 


Если у модуля есть зависимости, они указываются через `this.use('Path:To:DependencyModule')`. Если зависимый модуль находится в той же директории что и исходный, то его можно указать кратко: `this.use(':DependencyModule')` 

###Применение
Модули загружаются следующим образом:
```javascript
// app - неймспес приложения. доступен везде
// Modules - контроллер модулей
app.Modules.require([
    'Full:ModuleName:Foo', 
    'Full:ModuleName:Bar', 
    'Full:ModuleName:Baz'
  ],
  function (modules) {
    // выполняется при удачной загрузке модулей
    // modules - загруженные модули
  },
  function(err) {
    //error handler
  }
);
```

Так вызываются:
```javascript
var MyModule = app.Modules.get('Foo:Bar:MyModule');
var myModule = new MyModule({option: 'some option'});
```

###Features
* __Удобное подключение зависимостей__ Зависимости подключаются линейно внутри модуля, и доступны в секции *export*. 
* __Система имен__ Наименования модулей соответсвуют их путям. Это позволяет легко разбираться в структуре проекта, а так же без проблема подключать модули написанные другими разработчиками.
* __Поддержка AMD__ Из коробки Welljs подключает модули посредством Require.js, но дает возможность использовать другие библиотеки.
* __Плагины__ Welljs дает разработчикам возможность писать собственные плагины и делиться ими через пакетный менеджер Bower.
* __[Backbone-приложение](backbonejs.org)__ Через пакетный менеджер Bower можно скачать плагин [Sawbones](https://github.com/welljs/sawbones), который содержит все необходимое, для того чтобы быстро развернуть backbone-приложение.
* __Библиотеки и стороние плагины__ Для того чтобы подключить стороннюю библиотеку к проекту, нужно только создать модуль и поместить ее в секцию `exports`. После этого она доступна как зависимость, и ее можно вызывать именно там где она нужна. 
* __Фреймворки__ Если вы используете другой фреймворк, например Angular, можете написать плагины для работы с Angular 
* __Приложения__ Структура Well позволяет создавать несколько приложений которые будут использовать одни и те же плагины и библиотеки. Нужно только [настроить](http://welljs.org/#installation/applications) Nginx
* __Сборка__. Из коробки предлагается сборщик проекта для Gulp

[Документация и пример к проекту](http://welljs.org/#documentation )
