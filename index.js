import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import xml2js from "xml2js";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {notFound: false});
});

app.post("/find", async(req, res)=>{
  const artist = req.body["author"];
  const title = req.body["tytle"];
  try{
    const response = await axios.get(`http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=${artist}&song=${title}`);
    xml2js.parseString(response.data, (err, result) => {
      const lyrics = result.GetLyricResult.Lyric[0];
      console.log(lyrics);
      if (!lyrics.trim()) {
        return res.render("index.ejs", { notFound: true });
      }
      res.render("lyrics.ejs", {lyrics: lyrics});
    });
  }
  catch(error){
    console.error(`fail to find song ${artist}/${title}`);
    res.render("index.ejs", {notFound: true});
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
