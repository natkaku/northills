$("#btnAdd").on("click", function(){
    $("#btnModalSave").show();
    $("#btnModalUpdate").hide();
    $("#modalTitle").html("Add Subject");
    $("#hidden_menu").val("add");
    clear_content();
  
    $("#cboSubject").html(Stringify_Select(Get_Subjects("fetch_subjects_labfee")));

  }); //end btnAdd

  $("#formAdd").on("submit",function(event){
    event.preventDefault();
    var menu = $("#hidden_menu").val();
    var id = $("#hidden_id").val();
    var subj_id = $("#cboSubject").val();
    var amount = $("#txtamount").val();
  
    Processing_Modal("Processing!");
    $.ajax({
        url: "../api/laboratoryfees.php", method:"POST",
        data: {action:menu, subj_id:subj_id,amount:amount},
        success: function(data){
  
           if(data=="failed"){
                Error_Message_SweetAlert("Unable to add subject");
            }
            else{
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: (menu=="add") ? 'Record Saved!':'Record Update',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  $("#btnModalClose").click();
                  $("#tableBodySubject").html("");
                  load_laboratory_fees();
            
                Processing_Close(1000);
            }
        },error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            Error_Message_SweetAlert(errorMessage);
        }
    });
  
  }); // end formAdd

  $(document).on("click",".btnDelete", function(){
    var id = $(this).data("id");
    var subj_desc = $(this).data("subj_code") + ' | ' + $(this).data("subj_desc");
  
    Swal.fire({
        title: 'Are you sure?',
        text: "Remove "  + subj_desc,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: 'Loading!', html: 'Please wait..',allowOutsideClick: false,onBeforeOpen: () => { Swal.showLoading() }, });
            //remove ajax
            $.ajax({
                url: "../api/laboratoryfees.php", method: "POST", data: {id:id, action:"delete"},success:function(data){
               
                  if(data=="success") {
                    Swal.fire(
                      'Deleted!',
                      subj_desc + ' removed.',
                      'success'
                      )
  
                      $("#tableBodySubject").html("");
                      load_laboratory_fees();
     
                  } 
                
                },error: function(xhr, status, error){
                    var errorMessage = xhr.status + ': ' + xhr.statusText 
                Swal.fire({icon: 'error',title: 'Error....',text: 'No network connection!'}) 
                }
            });
  
           
        }
        })
  }); // end .btnRemove

  function clear_content(){

    $("#cboSubject").val("0");
    $("#txtamount").val("");

  }

  function load_laboratory_fees(){
    //  let position = Get_Parse_Session(Get_Session_Data()).position;
      $.ajax({
      
          url: "../api/laboratoryfees.php", method: "GET", dataType: "JSON",data: {action:"fetch_fees"},
          success: function(data){
              var string = JSON.stringify(data);
              var parse = JSON.parse(string);
           
                      var rowCount = parse.length;
                    var newRow ="";
                      for(var i=0; i < rowCount;i++){    
                          var id = parse[i]['id'];
                          var subj_code = parse[i]['subj_code'];
                          var subj_desc = parse[i]['subj_desc'];
                          var units = parse[i]['units'];
                          var amount = parse[i]['amount'];
                         
                        
                        
                          button = "<span id='btnRemove_"+id+"'></span>";
                          newRow = "<tr><td>"+subj_code+"</td>" +
                                    "<td>"+subj_desc+"</td>" +
                                    "<td>"+units+"</td>" +
                                    "<td>"+amount+"</td>" +
                                    "<td>"+button+"</td></tr>"
                             
                            $("#tableBodySubject").append(newRow);
                              //action buttons
                              Create_Remove_Button(id,subj_code,subj_desc);
                          
                         
                      }
                     
          }
      });
  }
  
  Get_Subjects = (action) =>{
    return $.ajax({ url: "../api/curriculum.php", method: "GET",data:{action:action},
     success: function (){
     },async:false
     }).responseText
  
  }

   //Action Buttons
   Create_Remove_Button = (id,subj_code,subj_desc) =>{
    const removeButton = new Button({text: "",clickHandler: () => {},attributes: {id: "btnRemove" + id,class: "btn btn-danger btn-sm btnDelete",title:"Remove Subject" },htmlContent: "<span class='fa fa-trash'></span>",dataAttributes: {id: id,subj_code:subj_code,subj_desc:subj_desc}});

    const removeButtonElement = removeButton.render();
    $("#btnRemove_" + id).html( removeButtonElement);
  }