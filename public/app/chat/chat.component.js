(function () {
    function chatController($scope) {
        ctrl = this;
        ctrl.data = {};
        ctrl.users = [];
        ctrl.rooms = [];
        ctrl.msgs = [];
        count = 0;
        var nsp = io.connect('/new');
        var socket = io.connect();
        ctrl.isMenuOpen = false;
        ctrl.$onInit = function () {
            ctrl.onSend = onSend;
            ctrl.onSend = onSend;
            ctrl.onOpenMenu = onOpenMenu;
            ctrl.onAddRoom = onAddRoom;
            // ctrl.myName = ctrl.$transition$.params().username;
            ctrl.user = user;
            console.log(ctrl.user);
            getUsers();
            getRooms();
        }

        function getUsers() {
            socket.emit('get:user', ctrl.user);
        }

        function getRooms() {
            socket.emit('get:rooms');
        }

        ctrl.selectUser = function (user) {
            ctrl.selectedUser = user;
        }

        function onSend(msg) {
            if (ctrl.selectedUser && msg) {
                ctrl.data = {
                    msg: msg,
                    type: 'msg',
                    to: ctrl.selectedUser,
                    from: ctrl.user
                };
                socket.emit('send:msg', ctrl.data);
                ctrl.msgs.push(ctrl.data);
                ctrl.inputMsg = '';
            }
        }

        function onOpenMenu() {
            ctrl.isMenuOpen = !ctrl.isMenuOpen;
        }

        function onAddRoom() {
            console.log('clicked')
            nsp.emit('send:msg',{})
            ctrl.isMenuOpen = !ctrl.isMenuOpen;
        }

        nsp.on('hi', function (data) {
            console.log(data);
        })

        socket.on('get:msg', function (msg) {
            msg.isRead = false;
            ctrl.msgs.push(msg);
            $scope.$apply();
        });
        socket.on('user:left', function (data) {
            ctrl.msgs.push(data);
            $scope.$apply();
        });

        socket.on('newUser', function (users, user) {
            if (user && user.id && ctrl.user.id == null) {
                ctrl.user = user;
            }
            ctrl.users = [];
            ctrl.users = users;
            $scope.$apply();
        });

        socket.on('newRoom', function (data) {
            count += 1;
            ctrl.rooms = [];
            ctrl.rooms = data;
            if (count === 1) {
                ctrl.selectedUser = ctrl.rooms[0];
            }
            $scope.$apply();

        });

    }
    var chatComponent = {
        templateUrl: 'app/chat/chat.component.html',
        controller: chatController,
        bindings: {
            user: '<',
            $transition$: '<'
        }
    }
    angular.module('chat').component('chatComponent', chatComponent);
})();