function doFilter(){var e=parseInt($("#fantasy-filter-value").val()),a=$("#fantasy-filter-team").val();$(".rlg-player-filterable").hide(),$(".rlg-player-filterable").each(function(t,n){"0"!==a?$(this).data("team-id")==a&&$(this).data("player-cost")<=e?$(this).css("display","flex"):$(this).hide():$(this).data("player-cost")<=e?$(this).css("display","flex"):$(this).hide()})}function doTransfer(e,a){$.post("/my-team/transfer",{_token:window.Laravel.csrfToken,player_in:a,player_out:e}).done(function(t){if(0==t.success&&$.siteAlert(t.message,"warning"),t.success){e=t.player_out.player,a=t.player_in,window.team_value-=e.price,window.team_value+=a.price,$("#fantasy-budget-used").text(window.team_value),$(".rlg-fantasy-player-card-"+e.id).replaceWith(t.html),$(".rlg-my-team-popup-card-"+e.id).replaceWith(t.popup_html),$(".rlg-fantasy-myteam-player-"+e.id).removeClass("hidden"),$(".rlg-fantasy-myteam-player-"+a.id).addClass("hidden");var n=$("#fantasy-transfers-remaining").text();isNaN(n)||(n=parseInt(n),n--,$("#fantasy-transfers-remaining").text(n)),$(".weekly_transfers").html(t.transfer_html)}}).fail(function(){})}function doPickIn(e){$.post("/pick-team/add",{_token:window.Laravel.csrfToken,player_id:e}).done(function(e){e.error&&$.siteAlert(e.error,"warning"),e.success&&(window.picked_players++,window.team_value+=e.player.price,$("#fantasy-budget-used").text(window.team_value),$("#fantasy-budget-remaining").text(window.budget-window.team_value),$("#fantasy-players-selected").text(window.picked_players),$(".rlg-fantasy-player-card.is--empty").first().replaceWith(e.html),$(".rlg-fantasy-create-player-"+e.player.id).addClass("hidden")),6==window.picked_players?$(".rlg-submit-team-area").fadeIn():$(".rlg-submit-team-area").fadeOut()}).fail(function(){})}function doPickOut(e){var a=e.data("player-id");$.post("/pick-team/remove",{_token:window.Laravel.csrfToken,player_id:a}).done(function(a){a.error&&$.siteAlert(a.error,"warning"),a.success&&(window.team_value-=a.player.price,window.picked_players--,$("#fantasy-players-selected").text(window.picked_players),$("#fantasy-budget-used").text(window.team_value),$("#fantasy-budget-remaining").text(window.budget-window.team_value),e.parents(".rlg-fantasy-player-card").remove(),$(".rlg-fantasy-create__players").append(a.html),$(".rlg-fantasy-create-player-"+a.player.id).removeClass("hidden"),$(".rlg-submit-team-area").fadeOut())}).fail(function(){})}function doLeagueApplication(e){$.post(e,{_token:window.Laravel.csrfToken,passcode:$(".rlgf-apply-passcode").val()}).done(function(e){e.success?($.siteAlert("Application created successfully","success"),$(".rlg-join-league-area").slideUp()):$.siteAlert(e.error,"warning")}).fail(function(){})}function sortPlayerRows(e){var a=$(".rlg-fantasy-player-table");a.find(".rlg-fantasy-player-table-row-sortable").sort(function(a,t){return"overall"===e?-(+a.getAttribute("data-player-overall")-+t.getAttribute("data-player-overall")):"name"===e?$(a).find(".rlg-main-table-name").text().toUpperCase().localeCompare($(t).find(".rlg-main-table-name").text().toUpperCase()):-(+a.getAttribute("data-player-w"+e)-+t.getAttribute("data-player-w"+e))}).appendTo(a)}function createCookie(e,a,t){var n;if(t){var i=new Date;i.setTime(i.getTime()+24*t*60*60*1e3),n="; expires="+i.toGMTString()}else n="";document.cookie=e+"="+a+n+"; path=/"}function readCookie(e){for(var a=e+"=",t=document.cookie.split(";"),n=0;n<t.length;n++){for(var i=t[n];" "==i.charAt(0);)i=i.substring(1,i.length);if(0===i.indexOf(a))return i.substring(a.length,i.length)}return null}function eraseCookie(e){createCookie(e,"",-1)}function urltoFile(e,a,t){return t=t||(e.match(/^data:([^;]+);/)||"")[1],fetch(e).then(function(e){return e.arrayBuffer()}).then(function(e){return new File([e],a,{type:t})})}$(document).ready(function(){$.siteAlert=function(e,a,t){var n,i,r=$(".rlg-site-popup"),o=$(".rlg-site-popup__headline"),s=$(".rlg-site-popup__text");void 0!==a?(n="is--"+a,r.addClass(n),i=a):(r.addClass("is--info"),i="Info"),r.addClass("active").removeClass("is--warning is--info is--error is--success").addClass(n),o.text(i),s.text(e)},$(".rlg-site-popup").click(function(){var e=$(".rlg-site-popup__headline"),a=$(".rlg-site-popup__text"),t=$("input.prevent");t.removeClass("prevent"),$(this).removeClass("active"),setTimeout(function(){$(this).removeClass("is--warning is--info is--error is--success"),e.text(""),a.text("")},500)})}),window.dragged_player_id=null,$(document).ready(function(){$(".rlg-fantasy-create__suggestions .scrollbar-inner").scrollbar(),$(".rlg-fantasy-myteam-player__add").on("click",function(){if($(".rlgf-transfer-out").data("player-in-id",$(this).data("player-id")),$(".rlgf-transfer-out").data("player-in-price",$(this).data("player-price")),$(this).data("player-photo"))$(".rlgf-transfer-in-photo").attr("src",$(".rlgf-transfer-in-photo").data("image-path")+$(this).data("player-photo"));else{var e=$(".rlgf-transfer-in-photo").data("image-path").replace("player_photos","team_logos");$(".rlgf-transfer-in-photo").attr("src",e+$(this).data("team-logo"))}$(".rlgf-transfer-in-name").text($(this).data("player-name")),$(".background-blackout-transfer-thing").show()}),$(document).on("click",".rlgf-transfer-out",function(){var e=window.team_value-$(this).data("player-out-price")+$(this).data("player-in-price");return e>window.budget?($.siteAlert("You cannot afford this transfer","warning"),!1):void doTransfer($(this).data("player-out-id"),$(this).data("player-in-id"))}),$(".background-blackout-transfer-thing").on("click",function(){$(".background-blackout-transfer-thing").hide()}),$(".rlgf-apply-league").on("click",function(){doLeagueApplication($(this).data("url"))}),$(".rlg-remove-league-member").on("click",function(){var e=$(this).data("url"),a=$(this);$.post(e,{_token:window.Laravel.csrfToken}).done(function(e){e.error&&$.siteAlert(e.error,"warning"),e.success&&(a.closest(".row").remove(),$.siteAlert("Team removed successfully","success"))})}),$(document).on("click",".rlg-fantasy-create-player__add",function(){return window.picked_players>=6?($.siteAlert("Your team already has the maximum of 6 players","warning"),!1):window.team_value+$(this).data("player-price")>window.budget?($.siteAlert("You cannot afford this player","warning"),!1):void doPickIn($(this).data("player-id"))}),$(document).on("click",".rlg-fantasy-player-card__remove",function(){doPickOut($(this))}),$("#fantasy-filter-value").on("click change keyup paste",function(){doFilter()}),$("#fantasy-filter-team").on("change",function(){doFilter()}),$(".btn-accept-application").on("click",function(){var e=$(this);$.post("/league/applications/"+e.data("id")+"/accept",{_token:window.Laravel.csrfToken}).done(function(a){a.error&&$.siteAlert(a.error,"warning"),a.success&&e.closest(".row").remove()}).fail(function(){})}),$(".btn-reject-application").on("click",function(){var e=$(this);$.post("/league/applications/"+e.data("id")+"/delete",{_token:window.Laravel.csrfToken}).done(function(a){a.error&&$.siteAlert(a.error,"warning"),a.success&&e.closest(".row").remove()}).fail(function(){})}),$(document).on("dragover",".rlg-fantasy-position-tag",function(e){e.preventDefault(),e.stopPropagation()}).on("dragleave",".rlg-fantasy-position-tag",function(e){e.preventDefault(),e.stopPropagation()}).on("drag",".rlg-fantasy-position-tag",function(e){e.preventDefault(),e.stopPropagation(),window.dragged_player_id=$(this).data("player-id")}).on("drop",".rlg-fantasy-position-tag",function(e){var a=$(this);$.post("/my-team/position-change/"+window.dragged_player_id+"/"+$(this).data("player-id"),{_token:window.Laravel.csrfToken}).done(function(e){var t=$(".rlg-fantasy-position-tag-pid-"+window.dragged_player_id),n=t.clone(!0),i=a.data("player-id"),r=window.dragged_player_id;n.data("player-id",i).removeClass("rlg-fantasy-position-tag-pid-"+r).addClass("rlg-fantasy-position-tag-pid-"+i),a.data("player-id",r).removeClass("rlg-fantasy-position-tag-pid-"+i).addClass("rlg-fantasy-position-tag-pid-"+r),a.after(n),t.after(a),t.remove()}).fail(function(){}),e.preventDefault(),e.stopPropagation()}),$(document).on("click",".rlg-player-sortable-th",function(){sortPlayerRows($(this).data("week"))})}),$(document).ready(function(){readCookie("acceptedFantasyPrivacyPolicy");0!==$("#privacyPolicyInfo").length&&$("#acceptPrivacyPolicy").click(function(e){e.preventDefault(),createCookie("acceptedFantasyPrivacyPolicy",currentPrivacyPolicyVersion,3650),location.reload()})}),$(document).ready(function(){$(function(){$(".rlg-select").chosen({disable_search_threshold:10,inherit_select_classes:!0,search_contains:!0})}),$("input[type=file]").nicefileinput({label:"Select file…"}),$(".rlg-input-selectable").click(function(){$(this).select()})}),$(document).ready(function(){smoothScroll.init({speed:500,easing:"easeInOutCubic",updateURL:!0,offset:50})}),$(document).ready(function(){$("#generateimage").click(function(){$(this).text("Generating…"),$("#share").addClass("--active"),setTimeout(function(){html2canvas($("#share").get(0)).then(function(e){var a=e.toDataURL("image/png"),t=document.createElement("a");t.href=a,t.download="rlg-fantasy-team.png",t.click()})},400),setTimeout(function(){$("#share").removeClass("--active"),$("#generateimage").text("Download team image")},800)})}),$(document).ready(function(){window.location.hash&&($(".rlg-gen-tab-link").removeClass("active"),$("#tab-"+window.location.hash.substring(1)).addClass("active"),$("#tab-"+window.location.hash.substring(1)+"-content").siblings().removeClass("active"),$("#tab-"+window.location.hash.substring(1)+"-content").addClass("active")),$(".rlg-tabs li").click(function(){$(this).addClass("active"),$(this).siblings().removeClass("active");var e=$(this).attr("data-content");$("#"+e).addClass("active"),$("#"+e).siblings().removeClass("active"),$("#tab-"+e+"-content").addClass("active"),$("#tab-"+e+"-content").siblings().removeClass("active")})});