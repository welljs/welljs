<h1>Welljs</h1>
========

<span style="color: red;">A small boilerplate for Javascript applications, with lazy loading and Asynchronous Module Definition (AMD)</span>

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
