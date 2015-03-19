angular
	.module('demo', ['timeline'])
	.controller('MainController', function ($scope) {
		
		$scope.items = [
			{
				name: 'item1',
				date:  moment().subtract(3, 'year').subtract(1, 'day').toDate()
			},
			{
				name: 'item6',
				date: moment().subtract(3, 'year').subtract(1, 'day').toDate()
			},
			{
				name: 'item7',
				date: moment().subtract(1, 'year').toDate()
			},
			{
				name: 'item8',
				date: moment().subtract(1, 'days').toDate()
			},
			{
				name: 'item2',
				date: moment().toDate()
			},
			{
				name: 'item3',
				date: moment().add(1, 'day').toDate()
			},
			{
				name: 'item4',
				date: moment().add(2, 'days').toDate()
			},
			{
				name: 'item5',
				date: moment().add(3, 'days').toDate()
			}
		];

		

	});

