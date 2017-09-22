(function () {
    angular.module('app').directive("msgCount", function () {
        return {
            scope: {
                msgCount: "=",
                us: "=",
                me: "=",
                selected: "="
            },
            template: '<div id="msg_count" ng-show="msgscount >0"><div>{{msgscount}}</div></div>',
            restrict: 'EA',
            replace: true,
            link: function (scope, element, attr) {
                scope.$watchCollection('msgCount', function (msgs) {
                    if (msgs) {
                        scope.msgscount = 0;
                        msgs.forEach(function (msg) {
                            if ((msg.type == 'msg') && (!msg.isRead) && (scope.us.type == 'SINGLE') && (scope.me == msg.to.id) && (scope.us.id == msg.from.id) && (scope.selected != msg.from.id)) {
                                scope.msgscount += 1;
                            }
                            if ((msg.type == 'msg') && (!msg.isRead) && (scope.us.type == 'ROOM') && (scope.us.id == msg.to.id) && (msg.from.id != scope.me) && (scope.selected != msg.to.id)) {
                                scope.msgscount += 1;
                            }

                        }, this);
                    }
                });
                scope.$watch('selected', function (newValue, oldValue) {
                    scope.msgscount = 0;
                    scope.msgCount.forEach(function (msg) {
                        if (((newValue == msg.from.id) || (oldValue == msg.from.id) && (msg.to.type == 'SINGLE'))
                            || ((newValue == msg.to.id) || (oldValue == msg.to.id) && (msg.to.type == 'ROOM'))) {
                            msg.isRead = true;
                        }
                    }, this);
                }, true);


            }
        }
    })
})();