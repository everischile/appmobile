CoreModule.factory('PopupFactory', ['$rootScope', '$ionicPopup','$state', function($rootScope, $ionicPopup,$state){

	var instance;

	var show = function(title, content, type, buttons, options){
		var t = type || 'info';
		var child = $rootScope.$new();
		var icon = t;
		child.title = title;
		child.content = content;
		child.type = t;
		child.buttons = buttons;
		child.options = {};
		angular.extend(child.options, options);
		instance = $ionicPopup.show({
			templateUrl: 'app/global/directives/PopUp/popup.html',
			title: '<i class="mov-icon valign-middle ' + icon + '"></i>' + child.title,
			cssClass: 'popup-' + t + '-color',
			scope: child,
			buttons: buttons
		});
		child.close = function(){
			instance.close();
		};
	};

	var hide = function(){
		if(instance){
			instance.close();
		}
	};

	return {
		show: show,
		hide: hide
	};
}]);
