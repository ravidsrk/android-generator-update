'use strict';

const renamer = require('renamer');
const rimraf = require('rimraf');
const async = require('async');
const path = require('path');
const mv = require('mv');
const mkdirp = require('mkdirp');
const Git = require("nodegit");
const replace = require("replace");
const filter = require('filter-files');
const findInFiles = require('find-in-files');
const ncp = require('ncp').ncp;
const Finder = require('fs-finder');

// Clone a given repository into the `./tmp` folder.
rimraf.sync(__dirname + '/templates')
  // rimraf.sync(__dirname + '/final-templates')
  // mkdirp('./final-templates')

Git.Clone("https://github.com/googlesamples/android-architecture", "./tmp")
  .then(function(repo) {
    // checkOutAndCopy(repo,"todo-mvp")
    // checkOutAndCopy(repo,"todo-mvp-loaders");
    // checkOutAndCopy(repo,"todo-mvp-clean")
    // checkOutAndCopy(repo,"todo-mvp-dagger")
    // checkOutAndCopy(repo,"todo-mvp-contentproviders")
    checkOutAndCopy(repo, "todo-databinding");
  })
  .catch(function(err) {
    console.log(err);
  });

function checkOutAndCopy(repo, name) {
  repo.getBranch('refs/remotes/origin/' + name)
    .then(function(reference) {
      console.log("Checking out branch " + name);
      return repo.checkoutRef(reference);
    })
    .then(function() {

      replace({
        regex: "com.example.android.architecture.blueprints.todoapp",
        replacement: "<%= appPackage %>",
        paths: ['./templates/todoapp'],
        recursive: true,
        silent: true,
      });

      mv('./templates/todoapp/.gitignore', './templates/todoapp/gitignore', function(err) {
        console.log("Renamed root folder .gitignore")
      });

      mv('./templates/todoapp/app/.gitignore', './templates/todoapp/app/gitignore', function(err) {
        console.log("Renamed app folder .gitignore")
      });

      console.log("Copying files to ./templates/" + name);
      ncp.limit = 1600;
      ncp('./templates/todoapp', './templates/' + name, function(err) {
        if (err) {
          return console.error(err);
        }
        console.log('Copying complete!');
      });
    });
}