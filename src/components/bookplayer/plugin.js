define(['connectionManager', 'dom', 'loading', 'appRouter', 'events', 'apphost', 'appSettings', 'htmlMediaHelper'], function (connectionManager, dom, loading, appRouter, events, appHost, appSettings, htmlMediaHelper) {
    'use strict';

    function BookPlayer() {
        let self = this;

        self.name = 'Book Player';
        self.type = 'mediaplayer';
        self.id = 'bookplayer';
        self.priority = 1;

        self.play = function (options) {
            loading.show();
            let elem = createMediaElement();
            return setCurrentSrc(elem, options);
        };

        self.stop = function (destroyPlayer) {
            let elem = self._mediaElement;
            let src = self._currentSrc;
            let book = self._book;

            if (elem && src && book) {
                if (destroyPlayer) {
                    book.destroy();
                    elem.destroy();

                    self.destroy();
                }
            }
        };

        self.hide = function () {
        };

        self.fastForward = function () {
            let rendition = self._rendition;
            let book = rendition.book;
            book.package.metadata.direction === 'rtl' ? rendition.prev() : rendition.next();
        };

        self.rewind = function () {
            let rendition = self._rendition;
            let book = rendition.book;
            book.package.metadata.direction === 'rtl' ? rendition.next() : rendition.prev();
        };

        self.getVolume = function () {
        };

        self.setVolume = function (vol) {
        };

        self.isMuted = function (vol) {
        };

        self.isPaused = function (vol) {
        };

        self.paused = function (vol) {
        };

        self.currentTime = function (vol) {
        };

        function onDisplay() {
            loading.hide();
            appRouter.showEpubReader();
        }

        function createMediaElement() {
            let elem = self._mediaElement;

            if (elem) {
                return elem;
            }

            elem = document.getElementById('bookPlayer');

            if (!elem) {
                elem = document.createElement('div');
                elem.id = 'bookPlayer';

                document.body.appendChild(elem);
            }

            self._mediaElement = elem;

            return elem;
        }

        function setCurrentSrc(elem, options) {
            let serverId = options.items[0].ServerId;
            let apiClient = connectionManager.getApiClient(serverId);

            return new Promise(function (resolve, reject) {
                require(['epubjs'], function (epubjs) {
                    let downloadHref = apiClient.getItemDownloadUrl(options.items[0].Id);
                    self._currentSrc = downloadHref;

                    let book = epubjs.default(downloadHref, {openAs: 'epub'});

                    let rendition = book.renderTo(elem, {width: '100%', height: '97%'});
                    self._rendition = rendition;

                    return rendition.display().then(function () {
                        onDisplay();
                        resolve();
                    });
                });
            });
        }
    }

    BookPlayer.prototype.currentSrc = function () {
        return this._currentSrc;
    };

    BookPlayer.prototype.duration = function () {
    };

    BookPlayer.prototype.seekable = function () {
    };

    BookPlayer.prototype.canPlayMediaType = function (mediaType) {
        return (mediaType || '').toLowerCase() === 'book';
    };

    return BookPlayer;
});
