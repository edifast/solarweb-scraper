import { cheerio } from "./deps.ts";
import { dotenv } from "./deps.ts";
import { CookieJar, wrapFetch } from "./deps.ts";
import { DOMParser } from "./deps.ts";

console.log(await dotenv.load({ allowEmptyValues: false, export: true }));

const cookieJar = new CookieJar();
const fetch = wrapFetch({ cookieJar });

let isLoggedIn = false;

const name:string = Deno.env.get("SW_USERNAME") as string;
const pw:string = Deno.env.get("SW_PASSWORD") as string;
const rememberme = true
Deno.env.get("SW_PVSYSTEMID") as string;

const token_response = await fetch("https://www.solarweb.com/", {
    method: "GET",
    redirect: "follow" 
});
const body = await token_response.text()

//console.log(body)
const $ = cheerio.load(body)
const token = $('input[type="hidden"]:nth-child(1)').val()
console.log(token); // login form token

const postData = {
    form: {
        __RequestVerificationToken: token,
        UserName: name,
        Password: pw,
        ReturnUrl: "",
        RememberMe: rememberme,
        'X-Requested-With': 'XMLHttpRequest'
    }
};

const form = new FormData();
//form.append("sessionDataKey", token);
//form.append("username", name);
//form.append("password", pw);
//form.append("chkRemember", "on");
form.append("__RequestVerificationToken", token);
form.append("UserName", name);
form.append("Password", pw);
form.append("ReturnUrl", "");
form.append("RememberMe", JSON.stringify(postData.form.RememberMe));
form.append("X-Requested-With", "XMLHttpRequest");

const login_response = await fetch("https://www.solarweb.com/", {
    method: "POST",
    body: form 
});

const json = await login_response.text()
console.log(json)

//console.log(response)

    // const jsonResponse = await fetch("https://www.solarweb.com/Chart/GetChartNew?pvSystemId=4efb7f1a-1feb-4edb-972b-a7c98072b913&year=2023&month=9&day=3&interval=month&view=production&_=1696457391191");
    // const jsonData = await jsonResponse.json();
    // console.log(jsonData);

    // https://www.solarweb.com/Chart/GetChartNew?pvSystemId=4efb7f1a-1feb-4edb-972b-a7c98072b913&year=2022&month=10&day=2&interval=year&view=production&_=1696457391206
    

