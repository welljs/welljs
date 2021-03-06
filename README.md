##Что такое Well.js
__Welljs__ - это, обертка для файловых загрузчиков, которая __помогает построить понятную систему основанную на модулях, легко подключать зависимости и ориентироваться в структуре проекта__. По умолчанию, в качестве AMD (Asynchronous module definition) -движка Well использует [Require.js](http://requirejs.org/), но позволяет заменить его на другой.

Так выглядит модуль  Well:

```JavaScript
// в любой модуль в качестве аргумента передается
// ссылка на приложени
wellDefine('Views:Pages:Overview', function(app) {
  // зависимости можно подключать последовательно одна за другой, 
  // или цепочкой this.use().use().use().options().exports();
  this.use('Views:Basic:Page', {as: 'BasicPage'});
  this.use('Views:Partials:Sidebar');
  //отменить автоинициализацию по окончанию загрузки
  this.use('Vendor:HighlightPack', {autonInit: false});
  // тут хранятся дополнительные параметы, к которым можно обратиться 
  // через someModule.get('paramName')
  this.set({
    template: 'Pages:Overview',
    otherOption: 'paramValue'
  });
  // эта колбэк-функция вызовется при app.Module.get('Views:Pages:AboutWell');
  this.exports(function(args) {
    // module code
    // all the dependencies are available here
    return this.BasicPage.extend({
      //Backbone page view
    });
  });
});
```
Для удобного ориентирования, наименования модулей в Welljs соответствуют их путям. Т.е. `'Views:Pages:AboutWell'` хранится в `views/pages/about-well.js`. 


Если у модуля есть зависимости, они указываются через `this.use('Path:To:DependencyModule')`. Если зависимый модуль находится в той же директории что и исходный, то его можно указать кратко: `this.use(':DependencyModule')` 

##Применение
Загрузить модули можно двумя способами:

1) Объявить его в секции `use()` как зависимость
```javascript
wellDefine('MyModule', function(){
  this.use('Utils:Helper', {as: 'AppHelper'});
  this.exports(function(){
    //После загрузки можно использовать:    
    var appHelper = new this.AppHelper({option: 'some option'});
  });
});
```

2) Через метод `app.require()` в любом месте программы
```javascript
// app - неймспес приложения. доступен везде
// Modules - контроллер модулей
app.require([
    'Full:ModuleName:Foo', 
    'Full:ModuleName:Bar', 
    'Full:ModuleName:Baz'
  ],
  function (err, modules) {
    if (err)
      throw err;
    // выполняется при удачной загрузке модулей
    // modules - загруженные модули
  }
);
```

##Features
* __Удобное подключение зависимостей__ Зависимости подключаются линейно внутри модуля, и доступны в секции `exports`. 
* __Система имен__ Наименования модулей соответсвуют их путям. Это позволяет легко разбираться в структуре проекта, а так же без проблема подключать модули написанные другими разработчиками.
* __Поддержка AMD__ Из коробки Welljs подключает модули посредством Require.js, но дает возможность использовать другие библиотеки.
* __Плагины__ Welljs дает разработчикам возможность писать собственные плагины и делиться ими через пакетный менеджер Bower.
* __Библиотеки и стороние плагины__ Для того чтобы подключить стороннюю библиотеку к проекту, нужно только создать модуль и поместить код библиотеки в секцию `exports`. После этого она доступна как зависимость, и ее можно вызывать именно там где она нужна. 

[Документация и пример к проекту](http://welljs.org/#!docs )

##License
The MIT License (MIT)

Copyright (c) 2014 vitalii.vorobioff@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
