#!/bin/sh 

# Absolute path to this script, e.g. /home/user/bin/foo.sh
SCRIPT=$(readlink -f "$0")
# Absolute path this script is in, thus /home/user/bin
SCRIPTPATH=$(dirname "$SCRIPT")

newman run "$SCRIPTPATH/newman/init.json"
if [ $? -ne 0 ]; then 
    "Error during init of flows in node-red"
    exit 1;
fi

newman run "$SCRIPTPATH/newman/test-suite1.json"
if [ $? -ne 0 ]; then 
    "Error during validation if test-suite1"
    exit 2;
fi