__Welljs__ - это небольшой фреймворк предназначенный для построения javascript-приложений. В качестве AMD-решения Well использует [Require.js](http://requirejs.org/)

Так выглядит модуль  Well:

```JavaScript
wellDefine('Views:Pages:AboutWell', function(app) {
  this.use('Views:Common:Basic');
  this.use('Views:Partials:Sidebar');
  this.use('Plugins:VendorName:PluginName');
  this.configure({
    template: 'Pages:AboutWell',
    otherConfigParam: 'paramValue'
  });
  return function(options) {
    // module code here
    // at this time all deps are already loaded
  }
});
```
Для удобства чтения и понимания структуры проекта, наименования модулей в Welljs соответствуют их путям. Т.е. `'Views:Pages:AboutWell'` хранится в `views/pages/about-well.js`. 

Корневые директории прописываются в WellConfig
```javascript
window.WellConfig = {
	strategy: 'MyStrategy',
	appRoot: '/app',
	wellRoot: '/well',
	pluginsRoot: '/plugins'
};
```

Если у модуля есть зависимости, они указываются через `this.use('Path:To:DependencyModule')`. Если зависимый модуль находится в той же директории что и исходный, то его можно указать кратко: `this.use(':DependencyModule')` 

###Применение
Модули загружаются следующим образом:
```javascript
app.Modules.require([
    'Full:ModuleName:Foo', 
    'Full:ModuleName:Bar', 
    'Full:ModuleName:Baz'
  ],
  function (modules) {
    //callback
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

###Applications

Поставляемые из коробки плагины Router, Views, Models, Collections позволяют быстро развернуть Backbone приложение
Ссыка на пример 
Если вы разработчик Angular, можете написать свои плагины для работы с Angular

Пример структуры нескольких проектов


###Plugins

Well предоставляет возможность писать независимые плагины и использовать их в разных приложениях. Так же обмениваться ими, через пакетный менеджер bower

###Installation

1) Склонировать репозиторий

`git clone https://github.com/welljs/welljs.git`

2) Установить зависимости командой

`bower install`


Ссылка на подробную документацию к проекту