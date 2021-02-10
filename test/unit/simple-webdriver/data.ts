export let WD_SERVER_URL_HTTP = "http://localhost:9515"

export let WD_SERVER_URL_HTTPS = "https://localhost:9515"

export let WD_SESSION_ID = "session-test-id-1337"

export let WD_ELEMENT_ID = "element-test-id-1337"

export let WD_HANDLE_ID = "window-test-id-1337"

export let WD_CAPABILITIES = {
    "acceptInsecureCerts": false,
    "browserName": "chrome",
    "browserVersion": "88.0.4324.146",
    "networkConnectionEnabled": false,
    "pageLoadStrategy": "normal",
    "platformName": "mac os x",
    "proxy": {},
    "setWindowRect": true,
    "strictFileInteractability": false,
    "timeouts": {
        "implicit": 0,
        "pageLoad": 300000,
        "script": 30000
    },
    "unhandledPromptBehavior": "dismiss and notify",
    "webauthn:virtualAuthenticators": true
}

export let WD_START_SESSION_RESPONSE = { 
    OK : {
        code : 200,
        body : {
            value : {
                sessionId : WD_SESSION_ID,
                capabilities : WD_CAPABILITIES
            }
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_EMPTY : {
        code : 200,
        body : { },
        headers : { "Content-Type" : "application/json"}
    },
    KO_VALUE_NULL : {
        code : 200,
        body : {
            //@ts-ignore
            value  : null
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_VALUE_EMPTY : {
        code : 200,
        body : {
            value  : {}
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_VALUE_NO_CAPA : {
        code : 200,
        body : {
            value  : {
                'sessionId' : WD_SESSION_ID
            }
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_VALUE_NO_TIMEOUTS : {
        code : 200,
        body : {
            value  : {
                'sessionId' : WD_SESSION_ID,
                'capabilities' : {

                }
            }
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOJSON : {
        code : 200,
        body : "<div>Hello World</div>",
        headers : { "Content-Type" : "application/json"}
    },
    KO_HTML : {
        code : 200,
        body : "<div>Hello World</div>",
        headers : { "Content-Type" : "application/html"}
    },
    KO_500 : {
        code : 500,
        body : {
            "value" : { 
                "error" : "session", 
                "message" : "can't create a session, test of CI",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json"}        
    }
}

export let WD_STOP_SESSION_RESPONSE = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            value : null
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_ERROR : {
        code : 500,
        body : {
            "value" : { 
                "error" : "session", 
                "message" : "this is an unknown error",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json"}       
    }  
}

export let WD_FIND_ELEMENT_RESPONSE = {
    OK : {
        code : 200,
        body : {
            "value" : { 
                "element-6066-11e4-a52e-4f735466cecf": WD_ELEMENT_ID
            }
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error": "no such element",
                "message": "no such element: Unable to locate element: {\"method\":\"method\",\"selector\":\"value\"}\n",
                "stacktrace" : "test stacktrace"
            }
        },
        headers : { "Content-Type" : "application/json"}        
    },
    KO_ERROR : {
        code : 500,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "this is an unknown error",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json"}       
    }
}

export let WD_EXECUTE_SYNC_RESPONSE = {
    OK_ELEMENT : {
        code : 200,
        body : {
            "value" : { 
                "element-6066-11e4-a52e-4f735466cecf": WD_ELEMENT_ID
            }
        },
        headers : { "Content-Type" : "application/json"}
    }
}

export let WD_NAVIGATE_TO_RESPONSE = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            "value" : null
        },
        headers : { "Content-Type" : "application/json"}
    }
}

export let WD_WINDOW_HANDLE_RESPONSE = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            "value" : WD_HANDLE_ID
        },
        headers : { "Content-Type" : "application/json"}
    }
}