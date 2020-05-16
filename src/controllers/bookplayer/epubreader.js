define(["playbackManager", "dom", "inputManager", "datetime", "itemHelper", "mediaInfo", "focusManager", "imageLoader", "scrollHelper", "events", "connectionManager", "browser", "globalize", "apphost", "layoutManager", "userSettings", "keyboardnavigation", "scrollStyles", "emby-slider", "paper-icon-button-light", "css!assets/css/videoosd"], function (playbackManager, dom, inputManager, datetime, itemHelper, mediaInfo, focusManager, imageLoader, scrollHelper, events, connectionManager, browser, globalize, appHost, layoutManager, userSettings, keyboardnavigation) {
    "use strict";
    return function (view, params) {

        function onWindowKeyDown(e) {
            var currentPlayer = playbackManager.getCurrentPlayer();
            var key = keyboardnavigation.getKeyName(e);

            switch (key) {
                case "l":
                case "ArrowRight":
                case "Right":
                    playbackManager.fastForward(currentPlayer);
                    break;
                case "j":
                case "ArrowLeft":
                case "Left":
                    playbackManager.rewind(currentPlayer);
                    break;
                case "NavigationLeft":
                case "GamepadDPadLeft":
                case "GamepadLeftThumbstickLeft":
                    // Ignores gamepad events that are always triggered, even when not focused.
                    if (document.hasFocus()) {
                        playbackManager.rewind(currentPlayer);
                    }
                    break;
                case "NavigationRight":
                case "GamepadDPadRight":
                case "GamepadLeftThumbstickRight":
                    // Ignores gamepad events that are always triggered, even when not focused.
                    if (document.hasFocus()) {
                        playbackManager.fastForward(currentPlayer);
                    }
            }
        }

        view.addEventListener("viewshow", function (e) {
            try {
                var currentPlayer = playbackManager.getCurrentPlayer();

                document.addEventListener("keydown", onWindowKeyDown);
                // FIXME: I don't really get why document keydown event is not triggered when epub is in focus
                currentPlayer._rendition.on("keydown", onWindowKeyDown);
            } catch (e) {
                require(['appRouter'], function(appRouter) {
                    appRouter.showDirect('');
                });
            }
        });
    };
});
