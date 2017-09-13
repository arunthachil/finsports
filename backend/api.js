var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
exports.games = function (req, res) {
	db.all("SELECT game_id,game as gameName FROM games where status  <> 3 COLLATE NOCASE order by game_id desc", function(err, row) {
		res.write(JSON.stringify(row));
		res.end();
	});
};
exports.addgames = function (req, res) {
	var title = req.body.title;
	if(typeof title!='undefined' && title!=''){


			db.get("SELECT count(game_id) as game_count FROM games where status  <> 3 and game = ? COLLATE NOCASE",[title], function(err, row) {
				if(parseInt(row.game_count) > 0){
					res.write(JSON.stringify({ "status":"failure", "msg":"Game already exist"}));
					res.end();
				}else{

					var stmt = db.prepare("INSERT INTO games (game) VALUES (?)");
					stmt.run(title);
					db.get("SELECT game_id,game as gameName FROM games where status  <> 3 and game = ? limit 1 COLLATE NOCASE",[title], function(err, row) {
					if(parseInt(row.game_id) > 0){
					 	res.write(JSON.stringify({ "status":"success", "msg":"Game added successfully","data":row}));
						res.end();
					}
				});
				}
			});
	}else{
			res.write(JSON.stringify({ "status":"failure", "msg":"Game adding failed"}));
			res.end();
	}
};
exports.editgames = function (req, res) {
	var title = req.body.title;
	var gameId = req.body.gameId;;
	if(typeof title!='undefined' && title!=''){
			db.get("SELECT count(game_id) as game_count FROM games where status  <> 3 and game = ? COLLATE NOCASE and game_id <> ? limit 1 ",[title,gameId], function(err, row) {
				if(parseInt(row.game_count) > 0){
					res.write(JSON.stringify({ "status":"failure", "msg":"Game already exist"}));
					res.end();
				}else{
					var stmt = db.prepare("update games set game = ? where game_id  = ?");
					stmt.run(title,gameId);
				 	res.write(JSON.stringify({ "status":"success", "msg":"Game edited successfully","data":row}));
					res.end();
				}
			});
	}else{
			res.write(JSON.stringify({ "status":"failure", "msg":"Game editing failed"}));
			res.end();
	}
};
exports.deletegames = function (req, res) {
	var gameId = req.params.gameId;
	if(typeof gameId!='undefined' && parseInt(gameId) > 0){
			var stmt = db.prepare("update games set status = ? where game_id  = ?");
			stmt.run(3,gameId);
			res.write(JSON.stringify({ "status":"success", "msg":"Game deleted successfully"}));
			res.end();
	}else{
		res.write(JSON.stringify({ "status":"failure", "msg":"Game deleting failed"}));
		res.end();
	}
};