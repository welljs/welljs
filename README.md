__Welljs__ - это небольшой фреймворк предназначенный для построения javascript-приложений. В качестве AMD-решения Well использует [Require.js](http://requirejs.org/)

Так выглядит модуль  Well:

```JavaScript
// в любой модуль в качестве аргумента передается
// ссылка на приложени
wellDefine('Views:Pages:AboutWell', function(app) {
  // зависимости можно подключать последовательно одна за другой, 
  // или цепочкой this.use().use().use().configure().export();
  this.use('Views:Common:Basic');
  this.use('Views:Partials:Sidebar');
  this.use('Plugins:VendorName:PluginName');
  // тут хранятся дополнительные параметы, к которым можно обратиться 
  // через someModule.getOption('paramName')
  this.options({
    template: 'Pages:AboutWell',
    otherOption: 'paramValue'
  });
  // эта колбэк-функция вызовется при app.Module.get('Views:Pages:AboutWell');
  this.export(function(args) {
    // module code
    // all the dependencies are available here
  });
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