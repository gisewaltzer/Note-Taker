const express = require("express");
const path = require("path");
const fs = require("fs");

const server = express();

server.use(express.json());

server.use(express.static("public"));

server.get("", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/index.html"));
});

server.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/notes.html"));
});

server.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname + "/data/db.json"), "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        res.setHeader("Content-Type", "application/json");
        res.send(data);
    });
});

server.post("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname + "/data/db.json"), "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        var currentData = JSON.parse(data);

        var fullPath = path.join(__dirname + "/data/db.json");
        console.log(fullPath);
        console.log(req.body);
        currentData.push(req.body);
        fs.writeFile(fullPath, JSON.stringify(currentData), (error) => {
            if (error) {
                console.error(error);
            }
        });
        res.send(currentData);
    });
});

server.delete("/api/notes/:id", (req, res) => {
    var id = req.params.id;
    fs.readFile(path.join(__dirname + "/data/db.json"), "utf8", (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        var currentData = JSON.parse(data);

        currentData = currentData.filter((value) => value.id !== parseInt(id));

        var fullPath = path.join(__dirname + "/data/db.json");

        fs.writeFile(fullPath, JSON.stringify(currentData), (error) => {
            if (error) {
                console.error(error);
            }
        });
        res.send(currentData);
    });
});

server.listen(8000);
