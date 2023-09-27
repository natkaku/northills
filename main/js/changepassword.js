$("#formPassword").on("submit", function(event){
    event.preventDefault();
   
    var currentPassword = $("#txtCurrentPassword").val();
    var newPassword = $("#txtNewPassword").val();
    var retypePassword = $("#txtRetypePassword").val();
    
    if(newPassword != retypePassword){
        $("#msgLogin").html("<span class='text-danger'> Password did not match </span>");
    }
    else{
        Swal.fire({ title: 'Processing!', html: 'Please wait..',allowOutsideClick: false,onBeforeOpen: () => { Swal.showLoading() }, });

        $.ajax({
        url: "../api/session.php",
        method: "POST",
        dataType: "JSON",
  
        success: function(data){
            var username =data.username;
            var user_id = data.user_id;
          
                $.ajax({
                url: "../api/changepassword.php",
                method: "POST",
                data: {id: user_id, username: username, currentpassword: currentPassword, newpassword: newPassword},
                success: function(adata){
                   
                    if(adata=="false"){
                        $("#msgLogin").html("<span class='text-danger'> Invalid Password. </span>");
                    }
                    else if(adata=="true"){
                        $("#txtCurrentPassword").val("");
                        $("#txtNewPassword").val("");
                        $("#txtRetypePassword").val("");
                        $("#msgLogin").html("<span class='text-success'> Password successfully changed. </span>");
                    }
                    else{
                        Swal.fire({icon: 'error',title: 'Error....',text: 'Unable to changepassword!'})
                    }
                    setTimeout(function(){ swal.close(); }, 200);
                
                }
                });
            },error: function(xhr, status, error){var errorMessage = xhr.status + ': ' + xhr.statusText 
            Swal.fire({icon: 'error',title: 'Error....',text: 'No network connection!'})
            
            }
        });
        
    }
    
});