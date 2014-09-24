<h1>Welljs</h1>
========

Это небольшой фреймворк-надостройка над AMD решениями (в данной версии пока только Require.js)

```javascript
wellDefine('Views:Pages:About', function(app) {
  this.use('Views:Common:Basic');
  this.use('Views:Partials:Sidebar');
  this.configure({
    template: 'Pages:About'
  });
  return function(options) {
    //this options
    //app.Views.get('Views:Common:Base')
    return Backbone.View.extend({
      initialize: function() {
      },
      render: function() {
      }
    })
  }
});
```
