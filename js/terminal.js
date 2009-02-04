GIT_USER = "prtksxna";

Terminal = Class.create({
	initialize: function(user){
		this.user = user;
		this.commands = new Hash;
	},
	connection: function(data){
		this.userdata = data
		$("terminal_console").update("Welcome to ~\/github\/<a href=\'http://github.com/"+this.userdata.user.login+"\'>"+this.userdata.user.login+"<\/a>\/ <br \/>Type \`help\` to get a list of commands. <br\/> <br\/>");
		this.loc = "~/github/"+this.userdata.user.login;
		$("terminal_folder").update(this.loc+"$<span class=\'loading\'>><\/span>");
		$("terminal_input").show().activate().value = "";
		this.addDefaultCommands();
	},
	changeLoc: function(loc){
		this.loc = "~/github/"+this.userdata.user.login+loc;
		$("terminal_folder").update(this.loc+"$<span class=\'loading\'>><\/span>");
	},
	addData: function(element){
		$("terminal_console").insert({bottom: element});
	},
	addDefaultCommands: function(){
		this.commands.set('whois',{help:'Gives you information about the user.',exec: function(){
			var whois = new Element('div',{class:'info'}).update(git.userdata.user.name+", "+git.userdata.user.company+" ("+git.userdata.user.login+") \t <a href=\'"+git.userdata.user.blog+"\'>"+git.userdata.user.blog+"<\/a> <br> <a class=\'green\' href=\'mailto:"+git.userdata.user.email+"\'>"+git.userdata.user.email+"<\/a>");
			git.addData(whois);
		}});
		
		this.commands.set('open', {help:'Opens the page of the current user or the repository.', exec: function(){
			var where = git.loc.split("/");
			if (where.length == 3){
				var ref = window.open("http://github.com/"+git.userdata.user.login);
				var emp = new Element("div");
				git.addData(emp);
			}else{
				var ref = window.open("http://github.com/"+git.userdata.user.login+"/"+where[3]);
				var emp = new Element("div");
				git.addData(emp);
			}
			
		}});
		
		this.commands.set('help',{help:'Helps those who cant help themselves.', exec: function(){
			var list = "<table>";
			git.commands.keys().sort().each(function(el) {
				list += "<tr><td class=\'pink\'>"+el+"<\/td><td class=\'blue\'>"+git.commands.get(el).help+"<\/td><\/tr>";
			});
			list += "<\/table>";
			var helpTable = new Element('div').update(list);
			git.addData(helpTable);
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
		
		this.commands.set('cd', {help:'should be followed by the name of a repository, to enter it.', exec: function(repo){
			repo = repo.reduce();
			var repos = new Array;
			git.userdata.user.repositories.each(function(el) {
				repos.push(el.name);
			});
			if(repos.indexOf(repo) === -1){
				if(repo == ".."){
					git.changeLoc("");
					var emp = new Element("div");
					git.addData(emp);
				}else{
					var noR = new Element("div", {class:'red'}).update("No such repository!");
					git.addData(noR);
				}
			}else{
				git.changeLoc("/"+repo);
				var emp = new Element("div");
				git.addData(emp);
			}
			
		}});
		
		this.commands.set('git', {help:'<ul><li><b>log<\/b>: Gives a list of all the recent commits.<\/li><li><b>diff<\/b>: Followed by the SHA1 of the commit gives the changes made in the commit.<\/li><\/ul>', exec: function(command){
			command = command.reduce();
			if(command == "log"){
				var where = git.loc.split("/");
				if (where.length == 3){
					var emp = new Element("div").update("Cant run git log here. Enter a repository to run it.");
					git.addData(emp);
				}else{
					git.getData('http://github.com/api/v1/json/'+git.userdata.user.login+'/'+where[3]+'/commits/master',"git.commands.get('git').log")
					$("terminal_console").setStyle({textDecoration:'blink'});
				}

			}
		},
		log: function(data){
			$("terminal_console").setStyle({textDecoration:'none'});
			console.log(data);
			var log = ""
			data.commits.each(function(el) {
				log += "<div>";
				log += "<a href=\'"+el.url+"\' class=\'yellow\'>commit "+el.id+"<\/a>";
				log += "<br \/><a href=\'mailto:"+el.author.email+"\' class=\'green\'>Author: "+el.author.name+" ["+el.author.email+"]<\/a>";
				log += "<br \/>Date: "+el.committed_date;
				log += "<blockquote class=\'pink\'>"+el.message+"<\/blockquote>";
				log += "<\/div>";
			});
			var logEl = new Element('div').update(log);
			git.addData(logEl);
			Effect.ScrollTo("the_end");
		}});
	},
	exec: function(command){
		var comEl = new Element('span', {class:'com'});
		comEl.update(""+ this.loc +">" + command);
		this.addData(comEl);
		
		if (command.include(" ")){
			var param = command.split(" ");
			command = param[0];
			param = param.without(command);
		};
		
		var com = (this.commands.get(command));

		if (!com){
			this.addData("<br \/>No such command <br \/>");
		}else{
			com.exec(param);
		}
		
		$("terminal_input").value = "";
		Effect.ScrollTo("the_end");
	},
	getData: function(url,callback){
		var sc = new Element('script', {src:url+"?callback="+callback});
		console.log(sc);
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