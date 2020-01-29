const http = require("http");
const DOMParser = require('xmldom').DOMParser;

const fs = require("fs");

//create a server object:
http
  .createServer(async function(req, res) {
    const xml_data = fs.readFileSync(__dirname + "/../data.xml", "utf8");
    const areaNode = new DOMParser().parseFromString(xml_data).getElementsByTagName('area');
    let results = {};
    for (let i=0; i < areaNode.length; i++) {
      if (areaNode[i].getAttributeNode('type').value === 'location') {
        const areaDesc = areaNode[i].getAttributeNode('description').value;
        const forecastNode = areaNode[i].getElementsByTagName('forecast-period');
        for(let j=0; j < forecastNode.length; j++) {
          if (forecastNode[j].getAttributeNode('index').value === '3') {
            const text = forecastNode[j].getElementsByTagName('text');
            results[areaDesc] = text[0].textContent;
           // console.log(areaDesc + ":" + text[0].textContent);
          }
        }
      }
    }

  res.write(JSON.stringify(results));
  res.end();
  })
  .listen(8080); //the server object listens on port 8080
