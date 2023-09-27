$(document).ready(function(){
 
    Processing_Modal("Loading!");
    load_systemuser($("#txtSearch").val());
    Processing_Close(500);
 });
     //Filter the table
  $("#txtSearch").on("keyup", function() {
         var value = $(this).val().toLowerCase();
         $("#myTable tr").filter(function() {
           $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
         });
       }); 
 
     $("#btnAdd").on("click", function(){
       $("#btnUserSave").show();
       $("#btnUserUpdate").hide();
       $("#hidden_menu").val("add");
    
       clear_content();
     }); //end btnAdd
    
     $(document).on("click",".btnEdit", function(){
         $("#btnUserSave").hide();
         $("#btnUserUpdate").show();
         $("#hidden_id").val($(this).data("id"));
         $("#txtfirstname").val($(this).data("firstname"));
         $("#txtlastname").val($(this).data("lastname"));
         $("#cboPosition").val($(this).data("position"));
         $("#txtusername").val($(this).data("username"));
         $("#txtpassword").val("");
         $("#txtretype").val("");
         $("#hidden_menu").val("edit");
 
      
     }); //.btnEdit
     $(document).on("click",".btnRemove", function(){
         var id = $(this).data("id");
         Swal.fire({
             title: 'Are you sure?',
             text: "Remove "  + $(this).data("username"),
             icon: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#3085d6',
             cancelButtonColor: '#d33',
             confirmButtonText: 'Yes'
             }).then((result) => {
             if (result.isConfirmed) {
                 Processing_Modal("Processing!");
                 //remove ajax
                 $.ajax({
                     url: "../api/systemuser.php", method: "POST", data: {user_id:id, action:"remove"}
                 });
 
                 Swal.fire(
                 'Deleted!',
                 $(this).data("username") + ' removed.',
                 'success'
                 )
                 load_systemuser($("#txtSearch").val());
                 Processing_Close(1000);
             }
             })
     }); // end .btnRemove
 
     $("#user_add").on("submit",function(event){
         event.preventDefault();
         var menu = $("#hidden_menu").val();
         var user_id = $("#hidden_id").val();
         var firstname = $("#txtfirstname").val();
         var lastname = $("#txtlastname").val();
         var position = $("#cboPosition").val();
         var username = $("#txtusername").val();
         var password = $("#txtpassword").val();
         var retypepassword = $("#txtretype").val();
       
         if (password != retypepassword){
             alert("Password did not match!");
             return;
         }
         Processing_Modal("Processing!");
         $.ajax({
             url: "../api/systemuser.php", method:"POST",
             data: {action:menu, firstname:firstname,lastname:lastname,position:position,username:username,password:password, user_id:user_id},
             success: function(data){
             
                 if (data=="duplicate"){
                     alert("Username already used!");
                     Processing_Close(1000);
                     return
                 }
                 else if(data=="failed"){
                     Error_Message_SweetAlert("Unable to create/edit user");
                 }
                 else{
                     Swal.fire({
                         position: 'center',
                         icon: 'success',
                         title: (menu=="add") ? 'Record Saved!':'Record Update',
                         showConfirmButton: false,
                         timer: 1500
                       })
                       $("#btnUserClose").click();
                     load_systemuser($("#txtSearch").val());
                     Processing_Close(1000);
                 }
             },error: function(xhr, status, error){
                 var errorMessage = xhr.status + ': ' + xhr.statusText
                 Error_Message_SweetAlert(errorMessage);
             }
         });
 
     });
 
 
 function clear_content(){
     $("#txtfirstname").val("");
     $("#txtlastname").val("");
     $("#cboPosition").val("");
     $("#txtusername").val("");
     $("#txtpassword").val("");
     $("#txtretype").val("");
 
 }
 
 function load_systemuser(search){
   
     $.ajax({
     
         url: "../api/systemuser.php", method: "GET", dataType: "JSON",data: {action:"fetch",search:search},
         success: function(data){
           
             var string = JSON.stringify(data);
             var parse = JSON.parse(string);
             var dataRow = "<table><thead><tr>" +
                          "<th>#</th>" +
                         "<th>Firstname</th>" +
                         "<th>Lastname</th>" +
                         "<th>Position</th>" +
                         "<th>Username</th>" +
                     "<th>Action</th>" +
                     "</tr></thead><tbody id='myTable'>";
                     var rowCount = parse.length;
                              
                     var i =0; //index    
                     while(i < rowCount){
                         var no = i + 1;       
                         var id = parse[i]['user_id'] ;
                         var firstname = parse[i]['firstname'] ;
                         var lastname = parse[i]['lastname'];
                         var position = parse[i]['position'];
                         var username = parse[i]['uname'];
 
                     
                         var tblRow = "<tr>";
                         tblRow += "<td>" + no + "</td>";
                         tblRow += "<td>" + firstname + "</td>";
                         tblRow += "<td>" + lastname + "</td>";
                         tblRow += "<td>" + position + "</td>";
                         tblRow += "<td>" + username + "</td>";
     
                       
                         tblRow += "<td><button type='button' class='btn btn-primary btn-sm btnEdit' title='Edit User' data-id='"+id+"' data-firstname='"+firstname+"' data-lastname='"+lastname+"' data-position='"+position+"' data-username='"+username+"' data-toggle='modal' data-target='#userModal'><span class='fas fa-edit'></span></button> &nbsp;&nbsp;";
 
                         tblRow += "<button type='button' class='btn btn-danger btn-sm btnRemove' title='Remove User' data-id='"+id+"' data-username='" + username +"'><span class='fas fa-trash'></span></button> &nbsp;&nbsp;";
 
                             tblRow += "</td></tr>";
                             dataRow += tblRow;
                            i++;
                            
                     }
 
                     dataRow += "</table>";
 
                     $("#userTable").html(dataRow);
 
                     
                     document.getElementById("lblRecords").innerHTML = rowCount;
 
         }
 
     });
 }