import * as http from "http";
import * as https from "https";


export class HttpResponse<T> {
    body : T;
    url : string;
    statusCode : number;
    statusMessage : string;
}


export async function call<T>(url : string, httpOptions : http.RequestOptions | https.RequestOptions, body : any = null) : Promise<HttpResponse<T>> {
    return new Promise<HttpResponse<any>> ((resolve, reject) => {
        let req : http.ClientRequest;
        let sBody = JSON.stringify(body);
        if (body)
            httpOptions.headers['Content-Length'] = sBody.length;
        if (url.startsWith("https://")) {
                req = https.request(url, httpOptions);
        } else {
                req = http.request(url, httpOptions);
        }
        req.on('response', (res) => {
            let data = '';
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                let response = new HttpResponse<T>();
                response.body = JSON.parse(data);
                response.statusCode = res.statusCode;
                response.statusMessage = res.statusMessage
                response.url = url;
                resolve(response);
            });  
            res.on('error', (err) => {
                reject(err);
            });
        });
        req.on('error', (err) => {
            reject(err);
        });
        if (body) {
            req.write(sBody);
        }
        req.end();
    });
}