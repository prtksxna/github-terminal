Terminal = Class.create({
	initialize: function(user){
		this.user = user;
		console.log(user);
		this.console = $('terminal_console');
		this.folder = $('terminal_folder');
		this.inp = $("terminal_input");
		this.console.update("Welcome to ~\/github\/<a href=\'http://github.com/"+this.user.user.login+"\'>"+this.user.user.login+"<\/a>\/ <br\/> <br\/>");
		this.folder.update("~/github/"+this.user.user.login+"$<span class=\'loading\'>><\/span>");
		this.inp.show();
		this.commands = new Hash;
		this.addDefaultCommands();
	},
	addData: function(element){
		this.console.insert({bottom: element});
	},
	addDefaultCommands: function(){
		me = this;
		this.commands.set('whois',{help:'Gives you information about the user.',exec: function(){
			var whois = new Element('div',{class:'info'}).update("hi \t dfj");
			me.addData(whois);
		}});
		var cg = (this.commands.get('whois'));
		cg.exec();
	},
	getData: function(url,callback){
		
	},
})