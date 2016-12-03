(function($) {
	$.fn.emc = function(options) {
		var defaults = {
				key: [],
				scoring: "normal",
				progress: true
			},
			settings = $.extend(defaults, options),
			$quizItems = $('[data-quiz-item]'),
			$choices = $('[data-choices]'),
			$feedback = $('[data-feedback]'),
			itemCount = $quizItems.length,
			chosen = [],
			$option = null,
			$label = null;
		emcInit();
		if (settings.progress) {
			var $bar = $('#emc-progress'),
				$inner = $('<div id="emc-progress_inner"></div>'),
				$perc = $('<span id="emc-progress_ind">0/' + itemCount + '</span>');
			$bar.append($inner).prepend($perc);
		}

		function emcInit() {
			$quizItems.each(function(index, value) {
				var $this = $(this),
					$choiceEl = $this.find('.choices'),
					choices = $choiceEl;
				for (var i = 0; i < choices.length; i++) {
					$option = $('<input name="' + index + '" id="' + index + '_' + i + '" class="speech-input" type="text">');
					$choiceEl.append($option);
					$option.on('propertychange change click keyup input paste focusin',  function() {
                        
						return getChosen();
					});
				}
			});
		}

		function getChosen() {
			chosen = [];
			$choices.each(function() {
				var $inputs = $(this).find('input[type="text"]'),
					answer = $(this).attr('data-choices').toLowerCase();
				
				$inputs.each(function(index,value) {
					if ($(this).val() != '') {
                        console.log($(this).val());
				    if ($(this).val().toLowerCase() == answer || $(this).val().toLowerCase() == answer+'s' || $(this).val().toLowerCase() == 'a'+' '+answer || $(this).val().toLowerCase() == 'an'+' '+answer) {
							chosen.push(1);
                            
						} else {
							chosen.push(2);
						}
					}
				
				});
			});
			getProgress();
		}

		function getProgress() {
			var prog = (chosen.length / itemCount) * 100 + "%",
				$submit = $('#emc-submit');
			if (settings.progress) {
				$perc.text(chosen.length + '/' + itemCount);
				$inner.css({
					height: prog
				});
			}
			if (chosen.length === itemCount) {
				$submit.addClass('ready-show');
				$submit.click(function() {
					return scoreNormal();
				});
			}
		}

		function scoreNormal() {
			var wrong = [],
				score = null,
				$scoreEl = $('#emc-score');
			for (var i = 0; i < itemCount; i++) {
				if (chosen[i] != settings.key[i]) {
					wrong.push(i);
				}
			}
			$quizItems.each(function(index) {
				var $this = $(this),
					$feedbackEl = $this.find('.choices'),
					feedback = $feedbackEl.data('feedback'),
					$wrong = $('<div class="feedback wrong">' + feedback[1] + '</div>'),
					$right = $('<div class="feedback right">' + feedback[0] + '</div>');
				if ($.inArray(index, wrong) !== -1) {
					$this.removeClass('item-correct').addClass('item-incorrect');
					return $feedbackEl.append($wrong);
				} else {
					$this.removeClass('item-incorrect').addClass('item-correct');
					return $feedbackEl.append($right);
				}
			});
			score = ((itemCount - wrong.length) / itemCount).toFixed(2) * 100 + "%";
			$scoreEl.text("You scored " + score).addClass('new-score');
			$('html,body').animate({
				scrollTop: 0
			}, 50);
		}
	}
}(jQuery));
$(document).emc({
	key: ["1", "1", "1", "1", "1", "1", "1", "1"]
});