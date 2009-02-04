Terminal = Class.create({
	initialize: function(user){
		this.user = user;
		this.keeper = new Element('div', {'id': 'terminal_keeper' }); //Create a container where
    $(document.body).insert(this.keeper);
		this.keeper.update("Welcome to ~\/github\/"+this.user);
		this.whois = $H();
		
		
		
		new Ajax.Request('http://github.com/api/v1/json/defunkt/',{
			method:'get',
			onCreate: function(){
				alert('a request has been initialized!');
				alert(this);
				console.log(this);
			},
			onSuccess: function(transport){
				var response = transport.responseText || "no response text";
				alert(response);
			},
			onFailure: function(){ alert('Something went wrong...') }
		});
		
		
	},
})