!function(){var a=Handlebars.template,e=Handlebars.templates=Handlebars.templates||{};e["layouts/main"]=a(function(a,e,r,i,t){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,a.helpers),t=t||{};var l,n,s="",p=r.helperMissing,o=this.escapeExpression;return s+='<div class="main-layout">\r\n		'+o((l=r.partial||e&&e.partial,n={hash:{},data:t},l?l.call(e,"Parts:Sidebar",n):p.call(e,"partial","Parts:Sidebar",n)))+'\r\n		<div class="page-content">\r\n				'+o((l=r.partial||e&&e.partial,n={hash:{},data:t},l?l.call(e,e&&e.page,n):p.call(e,"partial",e&&e.page,n)))+"\r\n		</div>\r\n</div>"}),e["pages/page-one"]=a(function(a,e,r,i,t){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,a.helpers),t=t||{};var l="";return l}),e["pages/page-three"]=a(function(a,e,r,i,t){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,a.helpers),t=t||{};var l="";return l}),e["pages/page-two"]=a(function(a,e,r,i,t){this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,a.helpers),t=t||{};var l="";return l}),e["parts/sidebar"]=a(function(a,e,r,i,t){return this.compilerInfo=[4,">= 1.0.0"],r=this.merge(r,a.helpers),t=t||{},"<div>\r\n		<ul>\r\n			<li>main</li>\r\n      <li>about</li>\r\n      <li>logout</li>\r\n		</ul>\r\n</div>"})}();
