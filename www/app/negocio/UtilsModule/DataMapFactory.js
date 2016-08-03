UtilsModule.factory('DataMapFactory', function(){
	var vars = [];
	var setItem = function(key, value){
		if(key && value){
			vars[key] = value;
			return value;
		}else{
			throw '"setItem: key and value is needed"';
		}
	};
	var getItem = function(key){
		if(!key){
			throw '"getItem: key is needed"';
		}
		if(typeof vars[key] !== 'undefined'){
			return vars[key];
		}else{
			throw '"Item not found"';
		}
	};
	return {
		setItem: setItem,
		getItem: getItem
	};
});

UtilsModule.factory('DataMapFactory', function(DataMapFactory){
	return DataMapFactory;
});
