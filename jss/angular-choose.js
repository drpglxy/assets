app.directive("ngChoose", function($parse) {
   return {
      restrict: "A",
      link: function(scope, element, attrs) {
         element.parent().on('change', function() { 
            if(this.options[this.selectedIndex] == element.get(0)) {
               scope.$eval(attrs.ngChoose);
               scope.$apply();
            }
         });
      }
   }
});
