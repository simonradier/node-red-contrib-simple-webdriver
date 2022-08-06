# node-red-contrib-simplewebdriver
[![Coverage Status](https://coveralls.io/repos/github/simonradier/node-red-contrib-simplewebdriver/badge.svg)](https://coveralls.io/github/simonradier/node-red-contrib-simplewebdriver)

Simplewebdriver nodes for Node-Red allow web browser automation initially based on the [Selenium-Webdriver](https://www.selenium.dev/documentation/) API. Based on [node-red-contrib-selenium-webdriver](https://flows.nodered.org/node/node-red-contrib-selenium-webdriver) library and forked from node-red-contrib-selenium-wd2, it was rewritten in Typescript to ease its maintenance, improve the overall stability and upgrade a little bit the set of features.

![wd2 workflow example](https://raw.githubusercontent.com/simonradier/node-red-contrib-selenium-wd2/master/doc/img/workflow.png "wd2 workflow example")

## Prerequisite
In order to use node-red-contrib-selenium-wd2, you must fullfill the following prerequisite :
* Install a webdriver server : `npm install -g chromedriver` (can be replaced with geckodriver, edgedriver, safaridriver)
* Install a node-red server : `npm install -g --unsafe-perm node-red`


## Installation
* Install node-red-contrib-simple-webdriver library : `npm install -g node-red-contrib-simplewebdriver` and that's all!

## Run
Launch Node-red `node-red` and the simplewebdriver nodes will be loaded automatically. You should see the list of node under the simplewebdriver section.

![simplewebdriver section overview](https://raw.githubusercontent.com/simonradier/node-red-contrib-simplewebdriver/master/doc/img/wd2.png "simplewebdriver section")


## Develop
If you want to contribute, you can install clone the project and run the following command :
* `npm run clean && npm run prepublishOnly` (linux only)

To test it, you will have to : 
* Install a node-red locally (in another folder) `npm install -g node-red`
* Launch, from the `node-red` folder, the following command to debug :

    `npm install [PATH_TO_CONTRIB_SIMPLEWEBDRIVER] && node --inspect node_modules/node-red/red.js`

## Behavior
You will always have to start with an 
Some nodes will provide two outputs a success and a failure one.
* Success output is used if the node execution is successful and if the flow execution can continue (i.e. the driver is still ok)
* Failure ouput is used in case of "soft" error (an element can't be found or an expected value is not correct). It aims to support dysfonctional use cases. (If something can't be clicked or found)
* Error is launched in case of "critical" error (i.e. the driver can't be used anymore). It means you will have to handle yourselft the cleaning on the selenium-driver side in this case.

## Documentation
All nodes provides their own documentation directly inside node-red.

![wd2 help overview](https://raw.githubusercontent.com/simonradier/node-red-contrib-selenium-wd2/master/doc/img/node-help.png "wd2 help")
