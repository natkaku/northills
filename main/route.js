$(function() {


    // Define the routes
    var routes = {
      '#user': 'User',
      '#changepassword': 'ChangePassword',
      '#act': 'ACT',
      '#subjects':'Subjects',
      '#bsentrep': 'BS ENTREP',
      '#bsentrep': 'BS ENTREP',
      '#btvted': 'BTVTED',
      '#beced': 'BECED',
      '#laboratoryfees':'LaboratoryFees'
    };
  
    // Set up the event listener
    $(window).on('hashchange', function() {
      // Get the current hash value
      var hash = window.location.hash;
  
      // Handle the route
      if (routes[hash]==="User") {
        $.get('components/users.html', function(data) {
            // Store the HTML content in a variable
            var htmlContent = data;

            // Display the HTML content in the console
            $('#main-page').html('<script src="js/users.js"></script>' + htmlContent);
            $('#modal-page').html("");

          });
      } 
      // route change password
      else if (routes[hash]==="ChangePassword") {
        $.get('components/changepassword.html', function(data) {
            var htmlContent = data;
            $('#main-page').html(htmlContent);
            $('#modal-page').html("");

          });
      } 
  
         else if (routes[hash]==="ACT") {
       
            $.get('components/curriculum.html', function(data) {
                var htmlContent = data;
                $('#main-page').html( '<script> var course_id=1; </script>' + htmlContent);
              });

               $('#modal-page').html("");
          
          } 
          else if (routes[hash]==="BS ENTREP") {
       
            $.get('components/curriculum.html', function(data) {
                var htmlContent = data;
                $('#main-page').html( '<script> var course_id=2; </script>' + htmlContent);
              });

               $('#modal-page').html(""); 
          } 
          else if (routes[hash]==="BTVTED") {
       
            $.get('components/curriculum.html', function(data) {
                var htmlContent = data;
                $('#main-page').html( '<script> var course_id=3; </script>' + htmlContent);
              });

                $('#modal-page').html(""); 
          } 
          else if (routes[hash]==="BECED") {
       
            $.get('components/curriculum.html', function(data) {
                var htmlContent = data;
                $('#main-page').html( '<script> var course_id=4; </script>' + htmlContent);
              });

                $('#modal-page').html(""); 
          } 



         else if (routes[hash]==="Subjects") {
          $.get('components/subjects.html', function(data) {
              var htmlContent = data;
              $('#main-page').html( htmlContent);
              $('#modal-page').html("");
            });
        } 

        else if (routes[hash]==="LaboratoryFees") {
          $.get('components/laboratoryfees.html', function(data) {
            var htmlContent = data;
            $('#main-page').html( htmlContent);
            $('#modal-page').html("");
          });
        } 
  
      else {
        $('#main-page').html("<br><h1>WELCOME " + Get_Parse_Session(Get_Session_Data()).firstName + " " +  Get_Parse_Session(Get_Session_Data()).lastName + "</h1>");
     
      
      }

    });
  
    // Set the initial route
    $(window).trigger('hashchange');
  });
  