const Audio = require("gibber.audio.lib"),
Gibber = require("gibber.core.lib")
chroma = require("chroma-js");
const pallette =  chroma.brewer.Set1
console.log('pallette: ', pallette);

// console.log('Chroma: ', Chroma);
for (const key in Audio) {
  if (Object.hasOwnProperty.call(Audio, key)) {
    const element = Audio[key];
    // console.log('key: ', key, (typeof element));
    
    
  }
}
console.log('Audio: ', Audio);
const instruments = Audio.Presets.instruments;
console.log('instruments: ', instruments);
let counter =-1
const descriptionsDisplays  = [];
for (const name in instruments) {
  if (Object.hasOwnProperty.call(instruments, name)) {
    counter++
    const instrumentTypes = instruments[name];
    // console.log('key: ', key);
    // console.log('element: ', Object.keys(element));
    const instrumentDiv = document.createElement('div');
    instrumentDiv.className = 'instrument';
    const instrumentName = document.createElement('h3');
    instrumentName.className = 'instrument-name';
    instrumentName.onclick=()=>{
       instrumentDescription.innerHTML=''
claerAllDescriptions()
    }
    instrumentName.innerHTML = name+'---';
    instrumentDiv.appendChild(instrumentName);    
    const instrumentDescription = document.createElement('h3');
    instrumentDiv.style.backgroundColor = chroma(pallette[counter%pallette.length]).darken(2).hex();
    const instrumentKeys = Object.keys(instrumentTypes);
    // if(false)
    
    for (let i = 0; i < instrumentKeys.length; i++) {
      const key = instrumentKeys[i];
      const properties = instrumentTypes[key];
      // console.log('properties: ', properties);
      const paramDiv = document.createElement('span');
      paramDiv.className = 'param';
      const paramName = document.createElement('span');
      paramName.innerHTML = key;
      console.log('key: ',name,' - ', key);
      paramDiv.appendChild(paramName);
      paramDiv.onclick = ()=>{
        claerAllDescriptions()
        console.log(key,'', name);
        const properties = instruments[name][key];
        console.log('properties: ', properties);
        let string = '';
        for (const property in properties) {
          if (Object.hasOwnProperty.call(properties, property)) {
            const element = properties[property];
            console.log('property: ', property, (typeof element));
            string += `${property}: ${element}<br>`;
            
          }
        }
        instrumentDescription.innerHTML = string;

      }
      const paramValue = document.createElement('span');
      // paramValue.innerHTML = properties;
      // if(false)
      for (const property in properties) {
        if (Object.hasOwnProperty.call(properties, property)) {
          const value = properties[property];
          // console.log('property: ', property);
          // console.log('value: ', value);
          const propertyDiv = document.createElement('div');
          propertyDiv.className = 'property';
          const propertyName = document.createElement('span');
          propertyName.innerHTML = property+'.';
          propertyDiv.appendChild(propertyName);
          const propertyValue = document.createElement('span');
          propertyValue.innerHTML = value;
          propertyDiv.appendChild(propertyValue);
          paramDiv.appendChild(propertyDiv);

          
        }
      }
      paramDiv.appendChild(paramValue);
      instrumentDiv.appendChild(paramDiv);
    }
    instrumentDiv.appendChild(instrumentDescription);
descriptionsDisplays.push(instrumentDescription)
    document.body.appendChild(instrumentDiv);
    // console.log('instrumentDiv: ', instrumentDiv);
    
  }
}
const claerAllDescriptions = ()=>{
         descriptionsDisplays.forEach(display=>{
         display.innerHTML=''
       })
}
/*
//   window.onclick = function() {
    Audio.init({workletPath:'./out/gibberish_worklet.js'},Gibber).then( () => {

      const syn = Synth()
      syn.note.seq( [0,1], 1/4 )

      window.onclick = null
    })
//   }
*/