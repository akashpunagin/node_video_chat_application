var muteButton = $('#main__mute__button');
var videoButton = $('#main_video__button');
var chatButton = $('#main__chat__button');
var mainChatWindow = $('#main__chat__window');
var mainVideoWindow = $('#main__video__window');
var mainParticipantsWindow = $('#main__participants__window');

// Initial Columns
var mainVideoWindowInitialCols = "col-md-7";
var mainChatWindowInitialCols = "col-md-3";
var mainParticipantsWindowInitialCols = "col-md-2";

// Expanded and Shrinked Columns
var mainChatWindowCols_Expanded = "col-md-10";
var mainChatWindowCols_Shrinked = "col-md-7";

mainVideoWindow.addClass(mainVideoWindowInitialCols);
mainChatWindow.addClass(mainChatWindowInitialCols);
mainParticipantsWindow.addClass(mainParticipantsWindowInitialCols);

const muteUnmute = function () {
  const enabled = videoStreamCurrentUser.getAudioTracks()[0].enabled;
  if (enabled) {
    videoStreamCurrentUser.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    videoStreamCurrentUser.getAudioTracks()[0].enabled = true;
    setMuteButton();
  }
}

const playStopVideo = function () {
  const enabled = videoStreamCurrentUser.getVideoTracks()[0].enabled;
  if (enabled) {
    videoStreamCurrentUser.getVideoTracks()[0].enabled = false;
    setVideoStopButton();
  } else {
    videoStreamCurrentUser.getVideoTracks()[0].enabled = true;
    setVideoPlayButton();
  }
}

$(document).ready(function () {
  chatButton.on('click', function () {
    if (mainChatWindow.is(":visible")) {
      mainChatWindow.removeClass('d-flex').addClass('d-none');
      mainVideoWindow.removeClass(mainChatWindowCols_Shrinked).addClass(mainChatWindowCols_Expanded);
      setChatShowButton();
    } else {
      mainChatWindow.removeClass('d-none').addClass('d-flex');
      mainVideoWindow.removeClass(mainChatWindowCols_Expanded).addClass(mainChatWindowCols_Shrinked);
      setChatHideButton();
    }
  });
});

const setChatShowButton = function () {
  chatButton.find("i").removeClass("fa-comment-slash").removeClass("controls__disabled").addClass('fa-comment');
  chatButton.find("span").text("Show Chat");
};

const setChatHideButton = function () {
  chatButton.find("i").removeClass("fa-comment-slash").addClass("controls__disabled").addClass("fa-comment-slash");
  chatButton.find("span").text("Hide Chat");
}

const setMuteButton = function () {
  muteButton.find("i").removeClass("fa-microphone-slash").removeClass("controls__disabled").addClass("fa-microphone");
  muteButton.find("span").text("Mute");
};

const setUnmuteButton = function () {
  muteButton.find("i").removeClass("fa-microphone").addClass("fa-microphone-slash").addClass("controls__disabled");
  muteButton.find("span").text("Unmute");
};

const setVideoPlayButton = function () {
  videoButton.find("i").removeClass("fa-video-slash").removeClass("controls__disabled").addClass("fa-video");
  videoButton.find("span").text("Stop Video");
};

const setVideoStopButton = function () {
  videoButton.find("i").removeClass("fa-video").addClass("fa-video-slash").addClass("controls__disabled");
  videoButton.find("span").text("Play Video");
};

// COPY ROOM ID
var roomTooltip = $('[data-toggle="tooltip"]');
roomTooltip.tooltip('disable');
roomTooltip.hover(function () {
  if (roomTooltip.find('i').hasClass('fa-door-closed')) {
    roomTooltip.find('i').removeClass('fa-door-closed').addClass('fa-door-open');
  } else if (roomTooltip.find('i').hasClass('fa-door-open')) {
    roomTooltip.find('i').removeClass('fa-door-open').addClass('fa-door-closed');
  }
});
function copyToClipboard() {
  roomTooltip.tooltip('enable');
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(ROOM_ID).select();
  document.execCommand("copy");
  $temp.remove();

  roomTooltip.tooltip('show');
  roomTooltip.mouseleave(function(){
    roomTooltip.tooltip('dispose');
  });
}
