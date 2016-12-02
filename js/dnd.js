score = 0;
if ($('.draggable')[0]) {
  $('.draggable').draggable({
    revert: true,
    snapTolerance: 30,
    revertDuration: 0,
    cursor: "move"
  });
}

$('.blank').each(function(index) {

  toAccept = $(this)[0].dataset.accept;
  // Resize spans to correct answer
  if ($(this).hasClass('resizable')) {
    answer = $('.draggable.' + toAccept);
  }

  $(this).droppable({
    accept: '.' + toAccept,
    drop: function(event, ui) {
      $(this).append(ui.draggable);
      $(this).addClass('answered');

      score++;
      $(ui.draggable).draggable('destroy');
      $(this).droppable("destroy");
    }
  });
});