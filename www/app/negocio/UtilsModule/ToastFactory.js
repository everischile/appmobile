UtilsModule.factory('ToastFactory', ['$rootScope', '$ionicLoading', '$timeout', function ($rootScope, $ionicLoading, $timeout) {
	var loadingIcon = '<ion-spinner icon="ios"></ion-spinner><br/>';
	var processIcon = '<ion-spinner icon="ripple"></ion-spinner><br/>';
	var sendingIcon = '<ion-spinner icon="ios"></ion-spinner></i><br/>';


	function hide(){
		$ionicLoading.hide();
	}

        function _show(text){
		var cfg = text ? {template: text} : null;

		$ionicLoading.show(cfg);
	}

	function show(text, interval){
		if(text){
			_show(text);
		}else{
			_show($rootScope.translation.LOADING);
		}

		if(!interval){
			interval = 3000;
		}

		if(interval > 0){
			$timeout(function(){
				hide();
			}, interval);
		}
	}

	function loading(text){
		_show(loadingIcon + (text ? text : $rootScope.translation.LOADING));
	}

	function process(text){
		_show(processIcon + (text ? text : $rootScope.translation.PROCESSING));
	}

	function sending(text){
		_show(sendingIcon + (text ? text : $rootScope.translation.SENDING));
	}

	return {
		show: show,
		loading: loading,
		process: process,
		sending: sending,
		hide: hide
	};

}]);