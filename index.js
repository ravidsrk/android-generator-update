'use strict';

const renamer = require('renamer');
const rimraf = require('rimraf');
const path = require('path');
const Git = require("nodegit");
const replace = require("replace");
const filter = require('filter-files');
const findInFiles = require('find-in-files');

// Clone a given repository into the `./tmp` folder.
rimraf.sync(__dirname + '/templates')

Git.Clone("https://github.com/androidstarter/android-mvp-starter", "./templates")
  // Look up this known commit.
  .then(function(repo) {
    console.log("Completed cloning");

    replace({
      regex: "in.mvpstarter.sample",
      replacement: "<%= appPackage %>",
      paths: ['./templates'],
      recursive: true,
      silent: false,
    });


  })
  .catch(function(err) {
    console.log(err);
  });