'use strict';

const renamer = require('renamer');
const rimraf = require('rimraf');
const async = require('async');
const path = require('path');
const mkdirp = require('mkdirp');
const Git = require("nodegit");
const replace = require("replace");
const filter = require('filter-files');
const findInFiles = require('find-in-files');
const ncp = require('ncp').ncp;

// Clone a given repository into the `./tmp` folder.
rimraf.sync(__dirname + '/templates')
rimraf.sync(__dirname + '/final-templates')

mkdirp('./final-templates')

Git.Clone("https://github.com/googlesamples/android-architecture", "./templates")
  .then(function(repo) {
    console.log("Cloning complete!");

      checkOutAndCopy(repo,"todo-mvp", function() {
        checkOutAndCopy(repo,"todo-mvp-loaders", function() {
          console.log("Complete");
        })
      });
      
      // checkOutAndCopy(repo,"todo-databinding"),
      // checkOutAndCopy(repo,"todo-mvp-clean"),
      // checkOutAndCopy(repo,"todo-mvp-dagger"),
      // checkOutAndCopy(repo,"todo-mvp-contentproviders")
  })
  .catch(function(err) {
    console.log(err);
  });

function checkOutAndCopy(repo,name,callback) {
  repo.getBranch('refs/remotes/origin/' + name)
    .then(function(reference) {
        console.log("Checking out branch "+ name);
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

      console.log("Copying files to ./final-templates/"+ name);
      ncp.limit = 1600;
      ncp('./templates/todoapp', './final-templates/'+ name, function (err) {
       if (err) {
         return console.error(err);
       }
       console.log('Copying complete!');
      });
    })
    .then(callback);
  }