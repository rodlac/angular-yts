app.controller('MoviesController', [
    '$scope',
    '$http',
    '$timeout',
    function($scope, $http, $timeout){

        $scope.mostDownloaded = [];
        $scope.latestMovies = [];
        $scope.upcomingMovies = [];
        $scope.searchedMovies = [];

        $scope.movie = [];
        $scope.search = [];

        $scope.emptyResult = null;

        $scope.selectedMovie = {};

        $scope.showSearchLoader = false;

        $scope.criteria = {
            quality: [
                'All',
                '1080p',
                '720p',
                '3D'
            ],
            genre: [
                'All',
                'Action',
                'Adventure',
                'Animation',
                'Biography',
                'Comedy',
                'Crime',
                'Documentary',
                'Drama',
                'Family',
                'Fantasy',
                'Film-Noir',
                'History',
                'Horror',
                'Music',
                'Musical',
                'Mystery',
                'Romance',
                'Sci-Fi',
                'Short',
                'Sport',
                'Thriller',
                'War',
                'Western'
            ],
            rating: [
                { value: 0, label: 'All' },
                { value: 9.9, label: '10' },
                { value: 9, label: '9+' },
                { value: 8, label: '8+' },
                { value: 7, label: '7+' },
                { value: 6, label: '6+' },
                { value: 5, label: '5+' },
                { value: 4, label: '4+' },
                { value: 3, label: '3+' },
                { value: 2, label: '2+' },
                { value: 1, label: '1+' }
            ],
            sort: [
                { value: 'date', label: 'Date' },
                { value: 'downloaded', label: 'Downloaded' },
                { value: 'seeds', label: 'Seeds' },
                { value: 'peers', label: 'Peers' },
                { value: 'size', label: 'Size' },
                { value: 'year', label: 'Year' },
                { value: 'alphabet', label: 'A-Z' },
                { value: 'rating', label: 'Rating' }
            ],
            order: [
                { value: 'desc', label: 'Descending' },
                { value: 'asc', label: 'Ascending' }
            ]
        };

        $scope.search.genre = $scope.criteria.genre[0];
        $scope.search.quality = $scope.criteria.quality[0];
        $scope.search.mininum_rating = $scope.criteria.rating[0].value;
        $scope.search.sort_by = $scope.criteria.sort[0].value;
        $scope.search.order_by = $scope.criteria.order[0].value;

        $scope.pagination = {
            previous: 0,
            next: 0
        };

        $scope.apiTimeout = false;

        $scope.init = function() {
            $scope.getLatestMovies();
            $scope.getMostDownloadedMovies();
            $scope.getUpcomingMovies();
        };

        $scope.getMostDownloadedMovies = function() {
            $http.get(
                'http://yts.to/api/v2/list_movies.json',
                {
                    params: {
                        sort_by: 'download_count'
                    }
                }
            )
            .success(function(data){
                $scope.mostDownloaded = data.data.movies;
            });
        };

        $scope.getLatestMovies = function() {
            $http.get('http://yts.to/api/v2/list_movies.json')
            .success(function(data){
                $scope.latestMovies = data.data.movies;
            });
        };

        $scope.getUpcomingMovies = function() {
            $http.get('http://yts.to/api/v2/list_upcoming.json')
            .success(function(data){
                $scope.upcomingMovies = data.data.upcoming_movies;
            });
        };

        $scope.getMovies = function(search) {

            $scope.selectedMovie = {};
            $scope.emptyResult = null;
            $scope.showSearchLoader = true;

            if ($scope.apiTimeout !== false) {

                $timeout.cancel($scope.apiTimeout);

            }

            $scope.apiTimeout = $timeout(function(){

                $http.get(
                    'http://yts.to/api/v2/list_movies.json',
                    {
                        params: search
                    }
                )
                .success(function(data){

                    if (data.error !== undefined) {
                        $scope.emptyResult = data.error;
                        $scope.searchedMovies = [];
                    } else {
                        $scope.searchedMovies = data.data.movies;
                    }

                })
                .then(function(){
                    $scope.apiTimeout = false;
                    $scope.showSearchLoader = false;
                });

            }, 150);

        };

        $scope.showMoreInfo = function(movie) {
            $scope.selectedMovie = movie;
        };

        $scope.cleanSearchParams = function () {
            $scope.searchedMovies = [];
            $scope.selectedMovie = {};

            $scope.search.query_term = '';
            $scope.search.genre = $scope.criteria.genre[0];
            $scope.search.quality = $scope.criteria.quality[0];
            $scope.search.minimum_rating = $scope.criteria.rating[0].value;
            $scope.search.sort_by = $scope.criteria.sort[0].value;
            $scope.search.order_by = $scope.criteria.order[0].value;

            $scope.emptyResult = null

            angular.element('[custom-select]').trigger('change');

            $scope.searchMovies.$setPristine(true);
        };
    }]
);