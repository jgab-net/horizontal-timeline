angular
	.module('timeline', [])
	.directive('timeline', function ($interval, $timeout) {
		return {
			templateUrl: 'views/timeline.html',
			replace: true,
			scope: {
				alias: '@?', 
				items: '=',
				select: '&?'			
			}, 			
			controller: function ($scope) {
				this.timelineSettings = {
					width: 0,
					space: 42,
					padding: 5
				};

				this.steps = [];
				this.yearSteps = [];

				$scope.nodes = [];

				var backItem = $scope.items[0];

				$scope.items.forEach(function (item, i) {
					var diff = moment(item.date).year() - moment(backItem.date).year();

					for (var j=diff; j>0; j--) {							
						$scope.nodes.push({
							type: 'info', 									
							info: moment(item.date).year()-j
						});						
					}
					$scope.nodes.push(angular.extend({
						type: 'node',
						index: i
					}, item));	

					backItem = item;
				});		

				this.stepUp = function () {	

					var currentStep = this.findStep();
					
					if (currentStep >= 0 && currentStep < this.steps.length-1) {
						$scope.style.left = this.steps[++currentStep];
						$scope.$apply();
					}					
				};	

				this.stepDown = function () {	

					var currentStep = this.findStep();	

					if (currentStep > 0 && currentStep < this.steps.length) {
						$scope.style.left = this.steps[--currentStep];
						$scope.$apply();					
					}
				};

				this.yearStepUp = function () {
					var currentStep = this.findYearStep();					

					if (currentStep >= 0 && currentStep < this.yearSteps.length-1) {
						$scope.style.left = this.yearSteps[++currentStep];
						$scope.$apply();
					}					
				};

				this.yearStepDown = function () {
					var currentStep = this.findYearStep();

					if (currentStep === undefined) currentStep = this.yearSteps.length-1;

					if (currentStep > 0 && currentStep < this.yearSteps.length) {
						$scope.style.left = this.yearSteps[--currentStep];
						$scope.$apply();					
					}
				};

				this.findStep = function () {
					for (var i = 0; i < this.steps.length; i++) {
						if (this.steps[i] <= parseInt($scope.style.left)) {
							return i;
							break;
						}
					}					
				};

				this.findYearStep = function () {					
					for (var i = 0; i < this.yearSteps.length; i++) {
						if (this.yearSteps[i] <= parseInt($scope.style.left)) {							
							return i;
							break;
						}
					}
				};

				this.move = function (value, viewPortWidth) {					
					var value = (parseInt($scope.style.left)+value);					
					if (value <= this.timelineSettings.space) {				
						//-1*(this.timelineSettings.space+this.timelineSettings.width-viewPortWidth)
						if (value > this.steps[this.steps.length - 1]){
							$scope.style.left = value+'px';
						} else {
							//$scope.style.left = -1*(this.timelineSettings.width-viewPortWidth)-this.timelineSettings.space+'px';
							$scope.style.left = this.steps[this.steps.length - 1];
						}
					} else {
						$scope.style.left = this.timelineSettings.space+'px';
					}
					$scope.$apply();				
				};

				this.getRealItem = function (node) {
					$scope.select({item: $scope.items[node.index]});
				};
			},
			link: function (scope, element, attrs, controller) {
				if (scope.alias) scope.$parent[scope.alias] = controller.exports;							

				$leftControl = element.find('.btn-left');
				$rightControl = element.find('.btn-right');	

				$leftYearControl = element.find('.btn-left-year');
				$rightYearControl = element.find('.btn-right-year');

				$timeline = element.find('.timeline');		

				scope.style = {
					left: controller.timelineSettings.space+'px'
				};

				$timeout(function () {
					$items = element.find('.timeline-item');						

					var changeClass = false;				
					
					//controller.yearSteps.push((-1)*controller.timelineSettings.width+controller.timelineSettings.space);
					$items.each(function (i, item) {					

						controller.steps.push((-1)*controller.timelineSettings.width+controller.timelineSettings.space);		
						if (scope.nodes[i].type === 'node') {							
							$(item)
								.css({
									left: controller.timelineSettings.width+'px',
									bottom: changeClass? controller.timelineSettings.padding+'px': '',
									top: !changeClass? controller.timelineSettings.padding+'px': ''
								})
								.addClass(!changeClass?'bottom-line':'top-line')
								.addClass('timeline-item-node')
								.data('x', (-1)*controller.timelineSettings.width+controller.timelineSettings.space)
								.data('index', i)
								.on('click', function () {
									$('.item-active').removeClass('item-active');
									$(this).addClass('item-active');
									controller.getRealItem(scope.nodes[$(this).data('index')]);
								});

							controller.timelineSettings.width += parseInt($(item).outerWidth(true));	
							changeClass = !changeClass;												
						} else {
							controller.yearSteps.push((-1)*controller.timelineSettings.width+controller.timelineSettings.space);
							$(item)
								.css({
									left: controller.timelineSettings.width+'px'
								})
								.addClass('timeline-item-info')
								.data('x', (-1)*controller.timelineSettings.width+controller.timelineSettings.space);

							controller.timelineSettings.width += parseInt($(item).outerWidth(true));
						}										
					});

					scope.style.width = controller.timelineSettings.width+'px';
					scope.style.left = controller.steps[controller.steps.length>=3? controller.steps.length - 3: controller.steps.length];
				});

				var stop;

				$leftControl.on('click', function () {
					controller.stepUp();						
				});

				$rightControl.on('click', function () {
					controller.stepDown();	
				});

				$leftYearControl.on('click', function () {
					controller.yearStepUp();						
				});

				$rightYearControl.on('click', function () {					
					controller.yearStepDown();	
				});

				interact('.timeline', {
						context: element
					})					
					.draggable({
						inertia: true,
						axis:'x',
						onstart: function (event) {
							$timeline.removeClass('timeline-animation');
							element.addClass('timeline-drag');
						},						
						onmove: function (event) {
							controller.move(event.dx, element.width());							
						},
						onend: function (event) {
							$timeline.addClass('timeline-animation');
							element.removeClass('timeline-drag');
						}
					}).styleCursor(true);

			}
		}


	});