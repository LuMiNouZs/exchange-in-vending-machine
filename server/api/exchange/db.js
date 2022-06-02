let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: ";yom^vv]@2016-db",
  database: "product_on_shelf",
});

//- Establish a new connection
connection.connect(function (err) {
  if (err) {
    // mysqlErrorHandling(connection, err);
    console.log(
      "\n\t *** Cannot establish a connection with the database. ***"
    );

    connection = reconnect(connection);
  } else {
    console.log("\n\t *** New connection established with the database. ***");
  }
});

//- Reconnection function
function reconnect(connection) {
  console.log("\n New connection tentative...");

  //- Destroy the current connection variable
  if (connection) connection.destroy();

  //- Create a new one
  var connection = mysql.createConnection(connection);

  //- Try to reconnect
  connection.connect(function (err) {
    //- The server close the connection.
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      console.log(
        "/!PROTOCOL_CONNECTION_LOST\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
      connection = reconnect(connection);
    }

    //- Connection in closing
    else if (err.code === "PROTOCOL_ENQUEUE_AFTER_QUIT") {
      console.log(
        "/!PROTOCOL_ENQUEUE_AFTER_QUIT\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
      connection = reconnect(connection);
    }

    //- Fatal error : connection variable must be recreated
    else if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
      console.log(
        "/!PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
      connection = reconnect(connection);
    }

    //- Error because a connection is already being established
    else if (err.code === "PROTOCOL_ENQUEUE_HANDSHAKE_TWICE") {
      console.log(
        "/!PROTOCOL_ENQUEUE_HANDSHAKE_TWICE\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
    }

    //- Anything else
    else {
      console.log(
        "/!\\ Cannot establish a connection with the database. /!\\ (" +
          err.code +
          ")"
      );
      connection = reconnect(connection);
    }
  });
}

module.exports = connection;
