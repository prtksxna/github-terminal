GIT_USER = "defunkt";

Terminal = Class.create({
	initialize: function(user){
		this.user = user;
		this.commands = new Hash;
	},
	connection: function(data){
		this.userdata = data
		$("terminal_console").update("Welcome to ~\/github\/<a href=\'http://github.com/"+this.userdata.user.login+"\'>"+this.userdata.user.login+"<\/a>\/ <br\/> <br\/>");
		this.loc = "~/github/"+this.userdata.user.login
		$("terminal_folder").update(this.loc+"$<span class=\'loading\'>><\/span>");
		$("terminal_input").show().activate().value = "";
		this.addDefaultCommands();
	},
	addData: function(element){
		$("terminal_console").insert({bottom: element});
	},
	addDefaultCommands: function(){
		this.commands.set('whois',{help:'Gives you information about the user.',exec: function(){
			var whois = new Element('div',{class:'info'}).update(git.userdata.user.name+", "+git.userdata.user.company+" ("+git.userdata.user.login+") \t <a href=\'"+git.userdata.user.blog+"\'>"+git.userdata.user.blog+"<\/a> <br> <a class=\'green\' href=\'mailto:"+git.userdata.user.email+"\'>"+git.userdata.user.email+"<\/a>");
			git.addData(whois);
		}});
		
		
		this.commands.set('ls',{help:'Lists all the repositories by this user.', exec: function(){
			var repos = git.userdata.user.repositories;
			var repEl = new Element('div', {class: 'ls-list'});
			var list = "<table>";
			repos.each(function(el) {
				list += "<tr><td>"+el.name+"<\/td><td><a class=\'yellow\' href=\'"+el.url+"\'>"+el.url+"<\/a><\/td><\/tr>"
			});
			list += "<\/table>"
			repEl.update(list);
			git.addData(repEl);
		}});
	},
	exec: function(command){
		var comEl = new Element('span', {class:'com'});
		comEl.update(""+ this.loc +">" + command);
		this.addData(comEl);
		var com = (this.commands.get(command));

		if (!com){
			this.addData("<br \/>No such command <br \/>");
		}else{
			com.exec();
		}
		
		$("terminal_input").value = "";
		Effect.ScrollTo("terminal_input");
	},
	getData: function(url,callback){
		var sc = new Element('script', {src:url+"="+callback});
		$(document.body).insert(sc);
	},
});

git = new Terminal(GIT_USER); 

document.observe('dom:loaded',function(e) {
	var sc = new Element('script', {src:'http://github.com/api/v1/json/'+GIT_USER+'?callback=initTerm'});
	$(document.body).insert(sc);
	
	$("term_in").observe('submit',function(e) {
		e.stop()
		git.exec($F("terminal_input"));
	});
	
});

initTerm = function(data) {
	git.connection(data);
};