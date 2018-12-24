var openSaveModal = function (entryJSON) {
  var modal = $('#saveModal');
  if (entryJSON === null) {
    modal.find('.modal-title').text("New entry: ");
    $('#saveModalId').val("");
    $('#saveModalName').val("");
    $('#saveModalNumber').val("");
    $('#saveModalEmail').val("");
  } else {
    var entry = JSON.parse(entryJSON);
    $('#saveModalId').val(entry._id);
    $('#saveModalName').val(entry.name);
    $('#saveModalNumber').val(entry.number);
    $('#saveModalEmail').val(entry.email);
    modal.find('.modal-title').text('Edit ' + entry.name);
    // $('#saveModal').on('show.bs.modal', function (event) {
    //   var button = $(event.relatedTarget);
    //   var recipient = "Damir";
    //   var modal = $(this);
    //   modal.find('.modal-title').text('New message to ' + recipient);
    // })
  }
  modal.modal('show');
};

var openDeleteModal = function(entryJSON){
  var modal= $('#deleteModal');
  var entry = JSON.parse(entryJSON);
  var id=entry._id;
  var name = entry.name;
  $('#deleteForm').attr('action', "/phonebook/" + id + "/?_method=DELETE");
  modal.find('.modal-title').text('Delete ' + name);
  modal.find('.modal-body > p').text("Are u sure u want to delete " + name);
  modal.modal('show');
};