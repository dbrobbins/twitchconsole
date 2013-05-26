$(function () {
	$("#add-stream").button();
	
	$("#chat-tabs")
		.tabs({
			
		})
		.delegate( "span.ui-icon-close", "click", function() {
			removeChat($(this).attr("id"));
		})
		.hide();
	
	$("#about").dialog({
		title: "About",
		autoOpen: false,
		modal: true,
		width: "500px",
		height: "auto",
		buttons: [
			{
				text: "Ok",
				click: function () {
					$(this).dialog("close");
				}
			}
		]
	});
	
	$("#donate").dialog({
		title: "Donate",
		autoOpen: false,
		modal: true,
		width: "500px",
		height: "auto",
		buttons: [
			{
				text: "Ok",
				click: function () {
					$(this).dialog("close");
				}
			}
		]
	});
	
	addStreamsFromUrlHash();
});

function addStreamsFromUrlHash() {
	var hash = window.location.hash;
	
	var hashSplitByComma = hash.replace("#", "").split(",");
	
	for (var i = 0; i < hashSplitByComma.length; i++) {
		var currentTerm = hashSplitByComma[i];
		
		if (currentTerm.length > 0) {
			addStreamAndChat(currentTerm, false);
		}
	}
}

function addStreamAndChat(streamName, addToHash) {
	if (addToHash) {
		if (!streamBoxIsEmpty()) {
			window.location.hash += ",";
		}
		window.location.hash += streamName;
	}
	
	addStream(streamName);
	addChat(streamName);
	
	$("#stream").val("");
	
	$("#welcome").hide();
}

function removeStreamAndChat(streamName) {
	window.location.hash = window.location.hash.replace("#" + streamName + ",", "#");
	window.location.hash = window.location.hash.replace("#" + streamName, "");
	window.location.hash = window.location.hash.replace("," + streamName, "");

	removeStream(streamName);
	removeChat("remove-chat-" + streamName);
	
	if (streamBoxIsEmpty()) {
		$("#welcome").show();
	}
}

function addStream(streamName) {
	var streamRemoveButtonId = "remove-" + streamName;
	
	var newStreamRemoveButton = '<span class="stream-listing">';
	newStreamRemoveButton += '<input id="' + streamRemoveButtonId + '" type="button" class="remove-stream" onclick="removeStreamAndChat(\'' + streamName + '\');" value="Remove ' + streamName + '" />';
	newStreamRemoveButton += '</span>';
	
	$("#stream-list").append(newStreamRemoveButton);
	$("#" + streamRemoveButtonId).button({
		icons: {
			primary: "ui-icon-close"
		}
    });
	
	var newStreamObject = '<object id="' + streamName + '" type="application/x-shockwave-flash" height="255" width="400" class="stream" data=http://www.twitch.tv/widgets/live_embed_player.swf?channel=' + streamName + '" bgcolor="#000000"><param name="allowFullScreen" value="true" /><param name="allowScriptAccess" value="always" /><param name="allowNetworking" value="all" /><param name="movie" value="http://www.twitch.tv/widgets/live_embed_player.swf" /><param name="flashvars" value="hostname=www.twitch.tv&channel=' + streamName + '&auto_play=true&start_volume=0" /></object>';
	
	$("#active-streams").append(newStreamObject);
}

function removeStream(streamName) {
	$("#remove-" + streamName).parent().remove();
	$("#" + streamName).remove();
}

function addChat(streamName) {
	var chatTabs = $("#chat-tabs").tabs();
	
	var newChatDivId = "chat-" + streamName;
	
	var newChatTabsListing = $('<li><a href="#' + newChatDivId + '">' + streamName + '</a><span id="remove-chat-' + streamName + '" class="ui-icon ui-icon-close" role="presentation">Remove Chat</span></li>');
	
	chatTabs.find(".ui-tabs-nav").append(newChatTabsListing);
	
	var newChatDiv = '<div id="' + newChatDivId + '" class="chat-container"></div>';
	
	chatTabs.append(newChatDiv);

	var newChatIframe = '<iframe frameborder="0" scrolling="no" src="http://twitch.tv/chat/embed?channel=' + streamName + '&popout_chat=true" height="80%" width="100%"></iframe>';
	
	$("#" + newChatDivId).append(newChatIframe);
	
	chatTabs.tabs("refresh");
	chatTabs.show();
	chatTabs.tabs("option", "active", getChatBoxCount() - 1);
}

function removeChat(elementId) {
	removeTab(elementId);
	
	if (chatBoxIsEmpty()) {
		$("#chat-tabs").tabs().hide();
	}
}

function removeTab(elementId) {
	var panelId = $("#" + elementId).closest("li").remove().attr("aria-controls");
	
	if (panelId) {
		$("#" + panelId).remove();
		$("#chat-tabs").tabs("refresh");
	}
}

function getChatBoxCount() {
	return $("#chat-list").children("li").length;
}

function chatBoxIsEmpty() {
	return getChatBoxCount() == 0;
}

function getStreamCount() {
	return $("#active-streams").children("object.stream").length
}

function streamBoxIsEmpty() {
	return getStreamCount() == 0;
}

function openHelp() {
	var help = $("#help").clone().dialog({
		title: "Help",
		modal: true,
		width: "500px",
		height: "auto",
		buttons: [
			{
				text: "Ok",
				click: function () {
					$(this).dialog("close");
				}
			}
		],
		close: function () {
			help.remove();
		}
	});
}

function openAbout() {
	$("#about").dialog("open");
}

function openDonate() {
	$("#donate").dialog("open");
}

function viewOnMultitwitch() {
	var streamsSeparatedByCommas = window.location.hash.replace("#", "");
	var multitwitch = "http://www.multitwitch.tv/";
	var multitwitchSuffix = streamsSeparatedByCommas.replace(/\,/g,"/");
	
	window.location = multitwitch + multitwitchSuffix;
}