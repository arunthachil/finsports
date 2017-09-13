// var Vue = require('vue');

var gameapp = new Vue({
  el: '#games',

  data: {
    game: { title: '',gameId:''},
    games: [],
  },

  ready: function () {
    this.fetchGames();
  },

  methods: {

    fetchGames: function () {
      var games = [];
      // this.$set('events', events);
      this.$http.get('/api/games')
        .success(function (games) {
          this.$set('games', games);
        })
        .error(function (err) {
          console.log(err);
        });
    },
    addGame: function () {
      $('.error').html('');
      if (this.game.title.trim()) {
        this.$http.post('/api/games', this.game)
          .success(function (res) {
            if(typeof res.data !='undefined'  && res.status == "success"){
              this.games.unshift(res.data);
              $('.modal').modal('hide');
              toastr.success(res.msg);
              this.game.title = '';
            }else{
              $('#gameTitleError').html(res.msg);
            }
          })
          .error(function (err) {
            console.log(err);
          });
      }else{
        $('#gameTitleError').html('Please enter game title');
      }
    },
    editGameSet: function (gameId,gameName,index) {
      $('.error').html('');
      this.game.title = gameName;
      this.game.gameId = gameId;
      $('#editIndex').val(index);
    },
    editGame: function () {
      $('.error').html('');
      if (this.game.title.trim()) {
        this.$http.put('/api/games', this.game)
          .success(function (res) {
            if(typeof res.data !='undefined' && res.status == "success"){
              $('.modal').modal('hide');
              toastr.success(res.msg);
               this.games[$('#editIndex').val()].gameName = this.game.title;
              this.game.title = '';
              this.game.gameId = '';
            }else{
              $('#gameEditTitleError').html(res.msg);
            }
          })
          .error(function (err) {
            console.log(err);
          });
      }else{
        $('#gameTitleError').html('Please enter game title');
      }
    },
    deleteGame: function (gameId,index) {
      if (confirm('Do you want to delete this game？')) {
        this.$http.delete('api/games/' + gameId)
          .success(function (res) {
            this.games.splice(index, 1);
          })
          .error(function (err) {
            console.log(err);
          });
      }
    }
  }
});