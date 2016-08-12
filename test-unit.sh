#!/usr/bin/env bash

clear

now="$(date +'%Y-%m-%d-%H-%M-%S')"
reportsFolder=./reports-unit
reportName=auto-test-$now

mocha ./tests/ --reporter mochawesome --reporter-options reportDir=$reportsFolder,reportName=$reportName,reportTitle="Auto Test $now",inlineAssets=false

unamestr=`uname`
reportPath="$reportsFolder/$reportName.html"
if [[ "$unamestr" == 'Darwin' ]]; then # detect MacOS
   open $reportPath
elif [[ "$unamestr" == 'Linux' ]]; then # detect Linux
   xdg-open $reportPath
fi
