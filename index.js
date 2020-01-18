const express = require("express");

const server = express();
server.use(express.json());

const db = require("./data/db");

// create new user
server.post("/api/users", (req, res) => {
  !req.body.name || !req.body.bio
    ? res
        .status(400)
        .json({ message: "Please provide name and bio for the user." })
    : db
        .insert(req.body)
        .then(user => {
          res.status(201).json(user);
        })
        .catch(err => {
          res.status(500).json({
            errorMessage:
              "There was an error while saving the user to the database"
          });
        });
});

// get all users
server.get("/api/users", (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

// get user by id
server.get("/api/users/:id", (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      user
        ? res.status(200).json(user)
        : res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
    });
});

//delete user by id
server.delete("/api/users/:id", (req, res) => {
  db.remove(req.params.id)
    .then(user => {
      user
        ? res.status(200).json({ message: "Deleted user" })
        : res.status(400).json({
            message: "The user with the specified ID does not exist."
          });
    })
    .catch(err => {
      res.status(500).json({ errorMessage: "The user could not be removed." });
    });
});

// update user by id
server.put("/api/users/:id", (req, res) => {
  db.findById(req.params.id)
    .then(user => {
      // checks if user found
      user
        ? // checks if bio or name is missing
          !req.body.bio || !req.body.name
          ? res
              .status(400)
              .json({ message: "Please provide name and bio for the user." })
          : db
              .update(user.id, req.body)
              .then(response => {
                res.status(200).json({ message: "User updated." });
              })
              .catch(err => {
                res.status(500).json({
                  errorMessage: "The user information could not be modified."
                });
              })
        : res.status(404).json({
            message: "The user with the specified ID does not exist."
          });
    })
    .catch(err => {
      res
        .status(500)
        .json({ message: "The user information could not be retrieved." });
    });
});

server.listen(4000, () => console.log("Server started"));
