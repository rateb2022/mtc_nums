
const puppeteer = require('puppeteer');
const fs = require("fs/promises");
var FCM = require('fcm-node')
var serverKey = "AAAAEW_q8QU:APA91bHH6ba2lZ-Ihw5kKw778yxH0z0Rh3vp9A5zb2iJoYTlong2Id4GuMmtwtPs_hwgczmSnZXg1iSff8sxRErwYaIHGjgEHhq0LR1XB3eSrS6_EzyyCyCMJBLrPGy7yLK11OxkRfz3"
var fcm = new FCM(serverKey)
if (typeof localStorage === "undefined" || localStorage === null) {
   var LocalStorage = require('node-localstorage').LocalStorage;
   localStorage = new LocalStorage('./scratch');
}
let nums = [];
let whatsappNums = [];
let storedNums = [];
let getNumbers = async () => {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();

   try{

      await page.goto('https://www.touch.com.lb/autoforms/portal/touch/onlinereservation', { waitUntil: 'networkidle2', timeout: 0 });

      await page.click("#numbers > input[type=button]:nth-child(10)"),
      page.setViewport({
         width: 1000,
         height: 10000,
         deviceScaleFactor: 1
       });
         await page.waitForNavigation(),
   
         nums = await page.evaluate(() => {
            return Array.from(document.querySelectorAll("#available-Numbers > div > select > option")).map(x => x.text);
         })
      if (localStorage.getItem("nums") != null) {
         storedNums = JSON.parse(localStorage.getItem("nums"));
         console.log("length " + storedNums.length)
   
         for (let i = 0; i < nums.length; i++) {
            if (!storedNums.includes(nums[i])) { whatsappNums.push(nums[i]); storedNums.push(nums[i]) }
         }
   
         localStorage.setItem("nums", JSON.stringify(storedNums));
      } else {
         whatsappNums = nums;
         localStorage.setItem("nums", JSON.stringify(nums));
   
      }
   
   
      await browser.close();
      return new Promise(function (resolve) {
         setTimeout(resolve, 1);
      });
   }catch(e){
      console.log;
      await browser.close()
      await browser.close();
      return new Promise(function (resolve) {
         setTimeout(resolve, 1);
      });
   }

 




}

let x = 0;
setInterval(() => {

   getNumbers().then(() => {
      if (whatsappNums.length != 0)
         sendNote();
      console.log(x++ + "\n");
      console.log(whatsappNums + "\n\n")

   })



   whatsappNums = [];
   nums = [];
   storedNums = [];



}, 25000)

let sendNote = () => {

   let c = 0
   let notBody = "";
   if (whatsappNums.length < 40 && whatsappNums.length != 0) {
      for (let i = 0; i < whatsappNums.length; i++) {
         notBody += whatsappNums[i] + " ";
         if (i % 4 == 0) notBody += "\n";
      }
      var message = {
         to: 'cdi2pFxpRJK1IHLS1z88hP:APA91bHLhqoMmpIFG8D6TJN-5kRlj1iXYRtGw3zS8Wp0FyVXWTWy8bYXk8D4M_VPMIG8UphZdP4PO7T8GRhVdiVwiq1cE7yyp4v16OziJA3YBZX2xey8FjruJf3MMHcnX-JhlCuaLrRR',         
         // to: 'eP5FhlLbQ_Sg4pe7U_9-DW:APA91bGhyhx5W2cXub2CoYYPpLMPGt7tgJ1QBUPkRVGkkGL5f17DnONIMp03Md5RBjdGNE-JRpNwiEdJjheIclkyzNtQKuKEXXdvuJEkOm0p4a6eKog4d0nU2Z2ZqpZrPjTqqsNvO7Td',
         collapse_key: 'your_collapse_key',
         notification: {
            title: "Touch",
            body: notBody
         },
         data: {
            my_key: 'my value',
            my_another_key: 'my another value'
         }
      }
      fcm.send(message, (err, response) => {
         if (err) {
            console.log("Something has gone wrong!")
         } else {
            console.log("Successfully sent with response: ", response)
         }
      })


   }
   else {
      for (let i = 0; i < whatsappNums.length; i++) {
         notBody += whatsappNums[i] + " ";
         if (i % 5 == 0) notBody += "\n";


         if (c == 40) {
            var message = {
               to: 'cdi2pFxpRJK1IHLS1z88hP:APA91bHLhqoMmpIFG8D6TJN-5kRlj1iXYRtGw3zS8Wp0FyVXWTWy8bYXk8D4M_VPMIG8UphZdP4PO7T8GRhVdiVwiq1cE7yyp4v16OziJA3YBZX2xey8FjruJf3MMHcnX-JhlCuaLrRR',         
               // to: 'eP5FhlLbQ_Sg4pe7U_9-DW:APA91bGhyhx5W2cXub2CoYYPpLMPGt7tgJ1QBUPkRVGkkGL5f17DnONIMp03Md5RBjdGNE-JRpNwiEdJjheIclkyzNtQKuKEXXdvuJEkOm0p4a6eKog4d0nU2Z2ZqpZrPjTqqsNvO7Td',
               collapse_key: 'your_collapse_key',
               notification: {
                  title: "Touch",
                  body: notBody
               },
               data: {
                  my_key: 'my value',
                  my_another_key: 'my another value'
               }
            }
            fcm.send(message, (err, response) => {
               if (err) {
                  console.log("Something has gone wrong!")
               } else {
                  console.log("Successfully sent with response: ", response)
               }
            })
            c = 0;
            notBody = "";


         }
         c++;
      }
   }




}
