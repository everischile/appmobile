UtilsModule.factory('JasonStathamFactory', function(){
	var vars = [];
	var setItem = function(key, value){
		if(key && value){
			vars[key] = value;
			return value;
		}else{
			throw 'Jason Says: "setItem: key and value is needed"';
		}
	};
	var getItem = function(key){
		if(!key){
			throw 'Jason Says: "getItem: key is needed"';
		}
		if(typeof vars[key] !== 'undefined'){
			return vars[key];
		}else{
			throw 'Jason Says: "Item not found on my car"';
		}
	};
	return {
		setItem: setItem,
		getItem: getItem
	};
});

UtilsModule.factory('TheTransporterFactory', function(JasonStathamFactory){
	return JasonStathamFactory;
});
