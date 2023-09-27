$("#btnAdd").on("click", function(){
    $("#btnModalSave").show();
    $("#btnModalUpdate").hide();
    $("#modalTitle").html("Add New Subject");
    $("#hidden_menu").val("add");
    clear_content();
  }); //end btnAdd

  $("#formAdd").on("submit",function(event){
    event.preventDefault();
    var menu = $("#hidden_menu").val();
    var id = $("#hidden_id").val();
    var subj_code = $("#txtsubjcode").val();
    var subj_desc = $("#txtsubjdesc").val();
    var units = $("#txtunits").val();

    var rowId = $("#hidden_rowid").val();

    Processing_Modal("Processing!");
    $.ajax({
        url: "../api/subjects.php", method:"POST",dataType:"JSON",
        data: {action:menu, subj_code:subj_code,subj_desc:subj_desc,units:units, id:id},
        success: function(data){
 
           if(data=="failed"){
                Error_Message_SweetAlert("Unable to create/edit subject");
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
            
                    var string = JSON.stringify(data);
                      var parse = JSON.parse(string);

                      var new_id = parse[0]['id'];

                      var id = parse[0]['id'];
                      var subj_code = parse[0]['subj_code'];
                      var subj_desc = parse[0]['subj_desc'];
                      var units = parse[0]['units'];
                   
                      var table = $("#subjectTable").DataTable(); 

                      button = "<span id='btnEdit_"+id+"'></span>";

                   if(menu=="add"){              
                       var newRow =  table.row.add([subj_code,subj_desc,units,button]).draw(false);
                       newRow.node().id = 'row' + new_id;      
                   }
                   else{                               
                       var updatedData = [subj_code,subj_desc,units,button];
                       var rowIndex = table.row('#' + rowId).index(); 
                       table.row(rowIndex).data(updatedData).draw();
                   }

                    //action buttons
                    Create_Edit_Button(id,subj_code,subj_desc,units);

                Processing_Close(1000);
            }
        },error: function(xhr, status, error){
            var errorMessage = xhr.status + ': ' + xhr.statusText
            Error_Message_SweetAlert(errorMessage);
        }
    });

});


$(document).on("click",".btnEdit", function(){
   
    $("#btnModalSave").hide();
    $("#btnModalUpdate").show();
    $("#modalTitle").html("Update Subject");
    $("#hidden_id").val($(this).data("id"));
    $("#txtsubjcode").val($(this).data("subj_code"));
    $("#txtsubjdesc").val($(this).data("subj_desc"));
    $("#txtunits").val($(this).data("units"));
    $("#hidden_menu").val("edit");
    $("#hidden_rowid").val($(this).closest('tr').attr('id'));
   
}); //.btnEdit

   function clear_content(){
    $("#txtsubjcode").val("");
    $("#txtsubjdesc").val("");
    $("#txtunits").val("");
  
}

 function load_subjects(tbl){
  //  let position = Get_Parse_Session(Get_Session_Data()).position;
    $.ajax({
    
        url: "../api/subjects.php", method: "GET", dataType: "JSON",data: {action:"fetch_subject_col"},
        success: function(data){
          
            var string = JSON.stringify(data);
            var parse = JSON.parse(string);
            
                    var rowCount = parse.length;
              
                    for(var i=0; i < rowCount;i++){    
                        var id = parse[i]['id'];
                        var subj_code = parse[i]['subj_code'];
                        var subj_desc = parse[i]['subj_desc'];
                        var units = parse[i]['units'];
                     
                        button = "<span id='btnEdit_"+id+"'></span>";

                            var newRow =  tbl.row.add([subj_code,subj_desc,units,button]).draw(); 
                            // Assigning an ID attribute to the new row   
                            newRow.node().id = 'row' + id;

                            //action buttons
                            Create_Edit_Button(id,subj_code,subj_desc,units);

                    }
                   
        }
    });
}

  //Action Buttons
  Create_Edit_Button = (id,subj_code,subj_desc,units) =>{
    const editButton = new Button({text: "",clickHandler: () => {},attributes: {id: "btnEdit" + id,class: "btn btn-primary btn-sm btnEdit",title:"'Edit User" },htmlContent: "<span class='fa fa-edit'></span>",dataAttributes: {id: id,subj_code:subj_code,subj_desc:subj_desc,units:units,toggle:"modal",target:"#addModal"}});

    const editButtonElement = editButton.render();
    $("#btnEdit_" + id).html( editButtonElement);
  }