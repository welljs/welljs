var Queue = function (names, next, controller) {
	this.modules = {};
	this.controller = controller;
	this.names = names;
	this.next = next;
	app.Events.on('MODULE_DEFINED', this.onModuleDefined, this);
};

Queue.prototype.onModuleDefined = function (module) {
	//если модуль из этой очереди, то удалить его из очереди
	if (this.exist(module.name)) {
		this.modules[module.name] = module;
		this.names.splice(this.names.indexOf(module.name), 1);
	}

	//когда все модули загружены
	if (!this.names.length){
		app.Events.off('MODULE_DEFINED', this.onModuleDefined, this);
		//формирую список модулей и их зависимостей
		var exportList =_.extend(this.modules, this.controller.getDeps(this.modules));
		//колбэк самого первого уровня вложенности (относительно очереди)
		this.next(exportList, this);
	}
	return this;
};

Queue.prototype.exist = function (moduleName) {
	return _.find(this.names, function (module) {
		return module === moduleName;
	});
};
