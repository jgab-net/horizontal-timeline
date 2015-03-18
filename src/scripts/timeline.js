angular
	.module('timeline', [])
	.directive('timeline', function ($interval, $timeout) {
		return {
			templateUrl: '../templates/timeline.html',
			replace: true,
			scope: {
				alias: '@?', 
				items: '='				
			}, 			
			controller: function ($scope) {
				this.timelineSettings = {
					width: 0,
					space: 42,
					padding: 5
				};

				this.steps = [];
				this.currentStep = 0;

				$scope.nodes = [];

				var backItem = $scope.items[0];

				$scope.items.forEach(function (item) {
					var diff = moment(item.date).year() - moment(backItem.date).year();

					for (var j=diff; j>0; j--) {							
						$scope.nodes.push({
							type: 'info', 									
							info: moment(item.date).year()-j
						});						
					}
					$scope.nodes.push(angular.extend({
						type: 'node'
					}, item));	

					backItem = item;
				});		

				this.step = function (step) {

				};		

				this.move = function (value, viewPortWidth) {					
					var value = (parseInt($scope.style.left)+value);					
					if (value <= this.timelineSettings.space) {				
						if ((-1)*value<=(this.timelineSettings.width-viewPortWidth+this.timelineSettings.space)){
							$scope.style.left = value+'px';
						} else {
							$scope.style.left = -1*(this.timelineSettings.width-viewPortWidth)-this.timelineSettings.space+'px';
						}
					} else {
						$scope.style.left = this.timelineSettings.space+'px';
					}				
				};

				$scope.select = function (node) {
					console.log(node);
				};
			},
			link: function (scope, element, attrs, controller) {
				if (scope.alias) scope.$parent[scope.alias] = controller.exports;							

				$leftControl = element.find('.timeline-control-left');
				$rightControl = element.find('.timeline-control-right');				

				scope.style = {
					left: controller.timelineSettings.space+'px'
				};							

				$timeout(function () {
					$items = element.find('.timeline-item');						

					var changeClass = false;				
					
					$items.each(function (i, item) {					

						controller.steps.push(controller.timelineSettings.width);		
						if (scope.nodes[i].type === 'node') {							
							$(item)
								.css({
									left: controller.timelineSettings.width+'px',
									bottom: changeClass? controller.timelineSettings.padding+'px': '',
									top: !changeClass? controller.timelineSettings.padding+'px': ''
								})
								.addClass(!changeClass?'bottom-line':'top-line')
								.addClass('timeline-item-node')
								.data('x', controller.timelineSettings.width);

							controller.timelineSettings.width += parseInt($(item).outerWidth(true));	
							changeClass = !changeClass;												
						} else {
							$(item)
								.css({
									left: controller.timelineSettings.width+'px'
								})
								.addClass('timeline-item-info')
								.data('x', controller.timelineSettings.width);

							controller.timelineSettings.width += parseInt($(item).outerWidth(true));
						}				

					});

					scope.style.width = controller.timelineSettings.width+'px';
				});

				var stop;

				$leftControl
					.on('mousedown', function () {
						stop = $interval(function (){
							controller.move(-8, element.width());	
						});									
					})
					.on('mouseup mouseleave', function () {
						$interval.cancel(stop);
					});

				$rightControl
					.on('mousedown', function () {
						stop = $interval(function (){
							controller.move(8, element.width());	
						});	
					})
					.on('mouseup mouseleave', function () {
						$interval.cancel(stop);
					});

				interact('.timeline', {
						context: element
					})					
					.draggable({
						inertia: true,
						axis:'x',						
						onmove: function (event) {
							scope.$apply(function () {
								controller.move(event.dx, element.width());
							});							
						}
					}).styleCursor(true);

			}
		}


	});