document.observe('dom:loaded',function(e) {
	var sc = new Element('script', {src:'http://github.com/api/v1/json/defunkt?callback=initTerm'});
	$(document.body).insert(sc);
});

initTerm = function(data) {
	var git = new Terminal(data);
};