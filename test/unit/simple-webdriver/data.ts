export enum WD_TESTED_Browser {
    Chrome = "chrome",
    //Chromium = "chromium",
    Edge = "msedge",
    Firefox = "firefox",
    Safari = "safari"
}

export enum WD_TESTED_Driver {
    Chrome = "chromedriver",
    Chromium = "chromedriver",
    Edge = "msedgedriver",
    Firefox = "geckodriver",
    Safari = "safaridriver"
}

export let WD_SERVER_URL_HTTP = {
    Chrome : "http://localhost:9515",
    Firefox : "http://localhost:4444",
    Chromium : "http://localhost:9515",
    Edge : "http://localhost:9415",
    Safari : "http://localhost:9315",
}

export let WD_SERVER_URL_HTTPS = {
    Chrome : "https://localhost:9515",
    Firefox : "https://localhost:4444",
    Chromium : "https://localhost:9515",
    Edge : "https://localhost:9415",
    Safari : "https://localhost:9315",
}

export let WD_WEBSITE_URL_HTTP =  "https://simonradier.github.io/node-red-contrib-selenium-wd2/test/"

export let WD_WEBSITE_URL_HTTP_1 =  "https://simonradier.github.io/node-red-contrib-selenium-wd2/test/test1.html"

export let WD_WEBSITE_URL_HTTP_2 =  "https://simonradier.github.io/node-red-contrib-selenium-wd2/test/test2.html"


export let WD_SESSION_ID = "session-test-id-1337"

export let WD_ELEMENT_ID = "element-test-id-1337"

export let WD_ELEMENT_ID_FAKE = "element-FAKE-id-1337"

export let WD_ATTRIBUTE_NAME = "value"

export let WD_CSS_ATTRIBUTE_NAME = "text-align"

export let WD_PROPERTY_NAME = "value"



export let WD_ELEMENT_SEARCH = {
    id : "id_1234",
    name : "input_1234",
    className : "class_1234",
    link : "This is a link to test1.html",
    partialLink : "test2.html",
    css : "#id_1234",
    tag : "h1",
    xpath : "/html/body/span"
}

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
        headers : { "Content-Type" : "application/json" }
    },
    KO : {
        code : 400,
        body : {
            "value" : { 
                "error" : "navigate", 
                "message" : "no such window",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_NAVIGATE_CURRENTURL = {
    OK : {
        code : 200,
        body : {
            "value" : WD_WEBSITE_URL_HTTP
        },
        headers : { "Content-Type" : "application/json" }
    },
    OK_1 : {
        code : 200,
        body : {
            "value" : WD_WEBSITE_URL_HTTP_1
        },
        headers : { "Content-Type" : "application/json" }
    },
    OK_2 : {
        code : 200,
        body : {
            "value" : WD_WEBSITE_URL_HTTP_2
        },
        headers : { "Content-Type" : "application/json" }
    },
    KO : {
        code : 400,
        body : {
            "value" : { 
                "error" : "geturl", 
                "message" : "no such window",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_NAVIGATE_REFRESH_RESPONSE = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            "value" : null
        },
        headers : { "Content-Type" : "application/json" }
    },
    KO : {
        code : 400,
        body : {
            "value" : { 
                "error" : "refresh", 
                "message" : "no such window",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}


export let WD_NAVIGATE_BACK_RESPONSE = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            "value" : null
        },
        headers : { "Content-Type" : "application/json" }
    },
    KO : {
        code : 400,
        body : {
            "value" : { 
                "error" : "back", 
                "message" : "no such window",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}


export let WD_NAVIGATE_FORWARD_RESPONSE = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            "value" : null
        },
        headers : { "Content-Type" : "application/json" }
    },
    KO : {
        code : 400,
        body : {
            "value" : { 
                "error" : "forward", 
                "message" : "no such window",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
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
    },
    KO : {
        code : 404,
        body : {
            "value" : { 
                "error" : "handle", 
                "message" : "no such window",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_WINDOW_HANDLES_RESPONSE = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            "value" : [WD_HANDLE_ID , WD_HANDLE_ID]
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO : {
        code : 500,
        body : {
            "value" : { 
                "error" : "handle", 
                "message" : "internal server error",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_ELEMENT_CLICK = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            "value" : null
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_ELEMENT_CLEAR = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            "value" : null
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_ELEMENT_SENDKEYS = {
    OK : {
        code : 200,
        body : {
            //@ts-ignore
            "value" : null
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_ELEMENT_GETTEXT = {
    OK : {
        code : 200,
        body : {
            "value" : "Hello"
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_ELEMENT_GETVALUE = {
    OK : {
        code : 200,
        body : {
            "value" : "hello"
        },
        headers : { "Content-Type" : "application/json"}
    },
    OK_UPDATED : {
        code : 200,
        body : {
            "value" : "hellototo"
        },
        headers : { "Content-Type" : "application/json"}
    },
    OK_CLEARED : {
        code : 200,
        body : {
            "value" : ""
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}


export let WD_ELEMENT_GETATTRIBUTE = {
    OK : {
        code : 200,
        body : {
            "value" : "hello"
        },
        headers : { "Content-Type" : "application/json"}
    },
    OK_UPDATED : {
        code : 200,
        body : {
            "value" : "hello"
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_ELEMENT_GETPROPERTY = {
    OK : {
        code : 200,
        body : {
            "value" : "hello"
        },
        headers : { "Content-Type" : "application/json"}
    },
    OK_UPDATED : {
        code : 200,
        body : {
            "value" : "hellototo"
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}


export let WD_ELEMENT_GETTAGNAME = {
    OK : {
        code : 200,
        body : {
            "value" : "input"
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_ELEMENT_GETCSSVALUE = {
    OK : {
        code : 200,
        body : {
            "value" : "center"
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_ELEMENT_ISSELECTED = {
    OK : {
        code : 200,
        body : {
            "value" : true
        },
        headers : { "Content-Type" : "application/json"}
    },
    OK_FALSE : {
        code : 200,
        body : {
            "value" : false
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_ELEMENT_ISENABLED= {
    OK : {
        code : 200,
        body : {
            "value" : true
        },
        headers : { "Content-Type" : "application/json"}
    },
    OK_FALSE : {
        code : 200,
        body : {
            "value" : false
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO_NOT_FOUND : {
        code : 404,
        body : {
            "value" : { 
                "error" : "element", 
                "message" : "element not found",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let WD_WINDOW_GETTITLE= {
    OK : {
        code : 200,
        body : {
            "value" : "WD2 Test Page"
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO : {
        code : 500,
        body : {
            "value" : { 
                "error" : "window", 
                "message" : "internal server error",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}

export let  WD_WINDOW_SETSIZE = (width, height) => {
    return {
        OK : {
            code : 200,
            body : {
                "value" :  {
                    "height": width,
                    "width": height,
                    "x": 0,
                    "y": 0
                }
            },
            headers : { "Content-Type" : "application/json"}
        },
        KO : {
            code : 500,
            body : {
                "value" : { 
                    "error" : "window", 
                    "message" : "internal server error",
                    "stacktrace" : "this is a stack\ntrace"
                }
            },
            headers : { "Content-Type" : "application/json" }
        }
    }
}

export let WD_WINDOW_GETSIZE = {
    OK : {
        code : 200,
        body : {
            "value" :  {
                "height": 1280,
                "width": 720,
                "x": 0,
                "y": 0
            }
        },
        headers : { "Content-Type" : "application/json"}
    },
    KO : {
        code : 500,
        body : {
            "value" : { 
                "error" : "window", 
                "message" : "internal server error",
                "stacktrace" : "this is a stack\ntrace"
            }
        },
        headers : { "Content-Type" : "application/json" }
    }
}



