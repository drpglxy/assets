var Dialogs = {
   confirm: function(message, object) {
      $.confirm({
        template: 'primary',
        templateOk: 'primary',
        message: message,
        onOk: function() {
           Dialogs.confirmHandler(object);
        },
        onCancel: function() {
        }
      });
        console.log('return false');
            return false;
   },

   confirmHandler: function(object) {

      if(object.tagName == "A")
      {

         console.log("Redirecting to", object.href);
         document.location = object.href;
      }else{
      
      if(object.tagName == "BUTTON")
      {
         console.log("Redirecting to", object);
         return true; 


      }
      
      }
   },

   alert: function(title, message) {
      $.confirm({
        template: 'danger',
        templateOk: 'danger',
        message: message,
        onOk: function() {
           Dialogs.confirmHandler(object);
        },
        onCancel: function() {
        },
        title: title,
        titleIcon: 'glyphicon glyphicon-exclamation-sign',
        buttonOk: false,
        labelCancel: 'Close'
      });
   },

   info: function(title, message) {
      $.confirm({
        template: 'success',
        templateOk: 'success',
        message: message,
        onCancel: function() {
        },
        title: title,
        titleIcon: 'glyphicon glyphicon-info-sign',
        buttonOk: false,
        labelCancel: 'Close'
      });
   },

   askEmail: function(object) {
      $.confirm({
        template: 'primary',
        templateOk: 'primary',
        message: '<input class="form-control response" type="text" placeholder="specify valid address, e.g. john@doe.com" oninput="Dialogs.emailInputHandler(this)">',
        title: "Enter your E-Mail...",
        titleIcon: 'glyphicon glyphicon-envelope',
        onInit: function($dialog) {
           $dialog.find('button[data-confirm="Ok"]').prop('disabled', true);
        },
        onOk: function() {
           var response = this.parentNode.parentNode.querySelector('input.response').value;
           document.location = object.href + '&email=' + response;
        },
        onCancel: function() {
        }
      });

      return false;
   },

   emailInputHandler: function(input) {
      var enabled = input.value.match(/^.+@.*\..+/) ? true : false;
      $('button[data-confirm="Ok"]').prop('disabled', !enabled);
   },
};
