const Audio = require("gibber.audio.lib"),
  Gibber = require("gibber.core.lib");
chroma = require("chroma-js");
const pallette = chroma.brewer.Set1;
const set1Scale = chroma.scale(pallette);
console.log("pallette: ", pallette);

// console.log('Chroma: ', Chroma);
for (const key in Audio) {
  if (Object.hasOwnProperty.call(Audio, key)) {
    const element = Audio[key];
    // console.log('key: ', key, (typeof element));
  }
}
const contents = document.createElement("div");
document.body.appendChild(contents);
contents.classList.add("contents");

const leftSide = document.createElement("div");
contents.appendChild(leftSide);
leftSide.classList.add("left-side");
const rightSide = document.createElement("div");
contents.appendChild(rightSide);
rightSide.classList.add("right-side");
const rightSide2 = document.createElement("div");
document.body.appendChild(rightSide2);
rightSide2.classList.add("right-side2");

console.log("Audio: ", Audio);
const instrumentsCategories = Audio.Presets.instruments;
console.log("instrumentsCategories: ", instrumentsCategories);
var categoriesSize = Object.keys(instrumentsCategories).length;
let counter = -1;
let counter2 = -1;
const descriptionsDisplays = [];
const instrumentParameters = {};
const allInstrumentParameters = new Set();
const allInstrumentParameters2 = {};
const allInstruments = {};
const allInstruments2 = {};
const colorsPerCategory = {};

const allPosibleInstrumentsDisplay = document.createElement("div");
allPosibleInstrumentsDisplay.style.position = "absolute";
allPosibleInstrumentsDisplay.style.top = "0";
allPosibleInstrumentsDisplay.style.left = "0";

let allPosibleInstruments = [];
document.body.appendChild(allPosibleInstrumentsDisplay);

for (const category in instrumentsCategories) {
  if (Object.hasOwnProperty.call(instrumentsCategories, category)) {
    counter++;
    const instrumentsInCategory = instrumentsCategories[category];
    const instrumentInCategoryKeys = Object.keys(instrumentsInCategory);

    const iLength = instrumentInCategoryKeys.length;
    // console.log('key: ', key);
    // console.log('element: ', Object.keys(element));
    const categoryDiv = document.createElement("div");
    categoryDiv.className = "instrument-category";
    const categoryTitle = document.createElement("h3");
    categoryTitle.className = "category-name";
    categoryTitle.onclick = () => {
      rightSide.innerHTML = "";
      claerAllDescriptions();
    };
    categoryTitle.innerHTML = `${counter}-${category}---${iLength}`;
    categoryDiv.appendChild(categoryTitle);
    const instrumentDescription = document.createElement("div");
    const bgColor = set1Scale(counter / categoriesSize)
      .darken(2)
      .hex();
    colorsPerCategory[category] = bgColor;
    categoryDiv.style.backgroundColor = bgColor;
    const paramsSet = new Set();
    instrumentParameters[category] = paramsSet;
    for (let i = 0; i < iLength; i++) {
      counter2++;
      const instrument = instrumentInCategoryKeys[i];
      const instrumentObject = instrumentsInCategory[instrument];
      const paramDiv = document.createElement("span");
      paramDiv.classList.add("param");
      const uniqueID = category + instrument;
      allPosibleInstruments.push(`s = ${category}('${instrument}')`);
      allInstruments[uniqueID] = {
        category,
        instrument,
        bgColor,
        paramDiv,
      };
      // paramDiv.classList.add(category);
      // paramDiv.classList.add(key);
      const paramName = document.createElement("span");
      paramName.innerHTML = instrument;
      allInstruments2[instrument] = paramDiv;
      paramDiv.appendChild(paramName);
      paramDiv.onclick = () => {
        onParamaClick(category, instrument);
      };
      const paramValue = document.createElement("span");
      for (const property in instrumentObject) {
        if (Object.hasOwnProperty.call(instrumentObject, property)) {
          const value = instrumentObject[property];
          paramsSet.add(property);
          allInstrumentParameters.add(property);
          if (allInstrumentParameters2[property]) {
            allInstrumentParameters2[property].typeof.add(typeof value);
            allInstrumentParameters2[property].categories.add(category);
            allInstrumentParameters2[property].keys.add(instrument);
          } else {
            allInstrumentParameters2[property] = {
              property,
              typeof: new Set([typeof value]),
              categories: new Set([category]),
              keys: new Set([instrument]),
            };
          }

          const propertyDiv = document.createElement("div");
          propertyDiv.className = "property";
          const propertyName = document.createElement("span");
          propertyName.innerHTML = property + ".";
          propertyDiv.appendChild(propertyName);
          const propertyValue = document.createElement("span");
          propertyValue.innerHTML = value;
          propertyDiv.appendChild(propertyValue);
          paramDiv.appendChild(propertyDiv);
        }
      }
      paramDiv.appendChild(paramValue);
      categoryDiv.appendChild(paramDiv);
    }
    categoryDiv.appendChild(instrumentDescription);
    descriptionsDisplays.push(instrumentDescription);
    leftSide.appendChild(categoryDiv);
    // console.log('instrumentDiv: ', instrumentDiv);
  }
}
// console.log("allInstruments: ", allInstruments);
allPosibleInstruments = allPosibleInstruments.join("<br>");
console.log("allPosibleInstruments: ", allPosibleInstruments);
// allPosibleInstrumentsDisplay.innerHTML = allPosibleInstruments;
const claerAllDescriptions = () => {
  descriptionsDisplays.forEach((display) => {
    display.innerHTML = "";
  });
};
const onParamaClick = (category, instrument) => {
  document.querySelectorAll(".property").forEach((element) => {
    element.onclick = null;
  });
  claerAllDescriptions();
  const bgColor = allInstruments[category + instrument].bgColor;
  const properties = instrumentsCategories[category][instrument];
  let indesOfAAAA = Object.keys(instrumentsCategories[category]).indexOf(
    instrument
  );
  let indesOfBBB = Object.keys(instrumentsCategories).indexOf(category);
  let string = `<div style="background-color:${bgColor};"><span>${indesOfBBB}/${
    Object.keys(instrumentsCategories).length
  }-${category}</span>----<span>${indesOfAAAA}/${
    Object.keys(instrumentsCategories[category]).length
  }-${instrument}</span></div>`;
  allInstrumentParameters.forEach((property) => {
    const value = properties[property];
    const element2 = allInstrumentParameters2[property];
    let categoriesColumn = "";
    Object.keys(instrumentsCategories).forEach((category4Property) => {
      const hasCategory4Property = element2.categories.has(category4Property);
      categoriesColumn += `<div style="border:1px solid ${
        category === category4Property && hasCategory4Property && value
          ? "#aaa"
          : "#555"
      };display:inline-block;width:10px;height:10px;color:#555;background-color:${
        hasCategory4Property
          ? colorsPerCategory[category4Property]
          : "transparent"
      };">&nbsp;</div>`;
    });
    const columnProperty2 = `<span class="column tiny">${element2.categories.size}</span>`;
    const columnProperty3 = `<span class="column tiny">${element2.keys.size}</span>`;
    const columnProperty = `<span class="column small property" onclick="onInstrumentParamClick(this)">${property}</span>`;
    const columnTypeOf = `<span class="column small">${
      element2.typeof ? Array.from(element2.typeof).toString() : "-"
    }</span>`;
    const columnElementValue = `<span class="column element">${
      value ? value : ""
    }</span> `;
    string += `<div>${columnProperty} ${columnTypeOf} ${columnElementValue}${categoriesColumn}${columnProperty2}${columnProperty3}</div>`;
  });
  rightSide.innerHTML = string;
};
onParamaClick("Drums", "earshred");

onInstrumentParamClick = function (e) {
  const parameter = e.textContent;
  console.log("parameter: ", parameter);
  const asdasd = allInstrumentParameters2[parameter];

  console.log("asdasd: ", asdasd);
  rightSide2.innerHTML = Array.from(asdasd.categories)
    .map(
      (category) =>
        `<span style="border:1px solid white;background-color:${colorsPerCategory[category]}">${category}</span>`
    )
    .join("");
  for (const key in allInstruments2) {
    if (Object.hasOwnProperty.call(allInstruments2, key)) {
      const element = allInstruments2[key];
      element.classList.remove("highlight");
    }
  }
  Array.from(asdasd.keys).forEach((key) => {
    console.log("key: ", key);
    const asdasdascxxxx = allInstruments2[key];
    console.log("asdasdascxxxx: ", asdasdascxxxx);
    asdasdascxxxx.classList.add("highlight");
  });
};
function one() {
  let aaaaa = Object.keys(allInstruments);

  setInterval(() => {
    const randomIndex = (aaaaa.length * Math.random()) | 0;
    const randomKey = aaaaa.splice(randomIndex, 1);
    if (aaaaa.length === 0) {
      aaaaa = Object.keys(allInstruments);
    }
    const randomElement = allInstruments[randomKey];
    onParamaClick(randomElement.category, randomElement.instrument);
  }, 100);
}

function two() {
  let index = -1;
  const keys = Object.keys(allInstruments);
  const length = keys.length;
  setInterval(() => {
    index++;
    const nextKey = keys[index % length];
    const nextElement = allInstruments[nextKey];
    onParamaClick(nextElement.category, nextElement.instrument);
  }, 100);
}
// two();
// one();
console.log("counter2: ", counter2);
console.log(Object.keys(allInstruments).length);
