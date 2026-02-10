require("dotenv").config();
const express = require("express");
const axios = require("axios");
// axios.get(
//   "https://generativelanguage.googleapis.com/v1/models?key=" + process.env.GEMINI_KEY
// ).then(r=>{
//   console.log(r.data);
// }).catch(e=>{
//   console.log(e.response.data);
// });
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const EMAIL = "yourname@chitkara.edu.in";
console.log("GEMINI:", process.env.GEMINI_KEY);

/* HEALTH */
app.get("/health",(req,res)=>{
  res.json({
    is_success:true,
    official_email:EMAIL
  });
});

/* helpers */

const fibonacci = n=>{
  let a=0,b=1,r=[];
  for(let i=0;i<n;i++){
    r.push(a);
    [a,b]=[b,a+b];
  }
  return r;
};

const isPrime = n=>{
  if(n<2) return false;
  for(let i=2;i*i<=n;i++) if(n%i===0) return false;
  return true;
};

const gcd=(a,b)=>b===0?a:gcd(b,a%b);
const lcm=(a,b)=>(a*b)/gcd(a,b);

/* BFHL */

// const value = req.body[key];

app.post("/bfhl", async(req,res)=>{
  try{

    if(!req.body || Object.keys(req.body).length!==1)
      return res.status(400).json({is_success:false});

    const key = Object.keys(req.body)[0];
    const value = req.body[key];
// console.log("KEY:", key);
// console.log("VALUE:", value);
    let data;

    switch(key){

      case "fibonacci":
        data = fibonacci(value);
        break;

      case "prime":
        data = value.filter(isPrime);
        break;

      case "lcm":
        data = value.reduce((a,b)=>lcm(a,b));
        break;

      case "hcf":
        data = value.reduce((a,b)=>gcd(a,b));
        break;

    //   case "AI":
    //     data = "Mumbai";   // TEMP (Gemini later)
    //     break;
case "AI":

const ai = await axios.post(
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent",
  {
    contents: [
      {
        role: "user",
        parts: [{ text: value }]
      }
    ]
  },
  {
    params: {
      key: process.env.GEMINI_KEY
    }
  }
);

data = ai.data.candidates[0].content.parts[0].text;

break;



      default:
        return res.status(400).json({is_success:false});
    }

    res.json({
      is_success:true,
      official_email:EMAIL,
      data
    });

 }catch(e){
  console.log(e.response?.data || e.message);
  res.status(500).json({is_success:false});
}

});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
