import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import PropertyBlueprint from "../tilt-properties/property-blueprint";
import { addFactory } from "../tilt-properties/props/tilt-property-groups";
const EVENTS = [
  'commandStack.element.updateModdleProperties.postExecuted',
  "commandStack.connection.create.postExecuted"
];

export function getExtensionObject(element,objectType){
  let bo = getBusinessObject(element);
  let extensionElements = bo.get("extensionElements");
  let foundExtensions = [];
  if(extensionElements && extensionElements.hasOwnProperty("values")){
    for(let v in extensionElements.values){
      if(extensionElements.values[v].$type == objectType){
        foundExtensions.push(extensionElements.values[v])
      }
    }
  }
  if(foundExtensions.length > 0){
    return foundExtensions[0]
  }
  return null
}

export function findElements(element = null, elementType, alreadySearched = [], searchLayer = 0, maxLayer = 4){
  searchLayer++
  
  if(alreadySearched.includes(element.id) || searchLayer > maxLayer){
    return []
  }

  var bo = getBusinessObject(element);
  if(bo.hasOwnProperty("$type") && bo.$type == elementType){
    return [element];
  }else if(bo.hasOwnProperty("$type") && bo.$type == "bpmn:ExtensionElements"){
    return [];
  }
  console.log(element.id,searchLayer)
  var elementProperties = [];
  var foundElements = [];

  if(element instanceof Object && !(element instanceof Array || element instanceof Function)){
    elementProperties = Object.getOwnPropertyNames(element);
    elementProperties = elementProperties.filter(e =>
      !e.startsWith("$") &&
      !['di','messageFlows','sourceRef','targetRef','flowNodeRef'].includes(e))
  }else if(Array.isArray(element)){
    for(let i in element){
      foundElements.push(...findElements(element[i],elementType,alreadySearched,searchLayer));
      if(element[i].hasOwnProperty("id")){
        alreadySearched.push(element[i].id)
      }
    }
    return foundElements;
  }else{
    return foundElements;
  }
  
  for(let p in elementProperties){
    if(element[elementProperties[p]] instanceof Object && typeof(element[elementProperties[p]]) != "string"){
      foundElements.push(...findElements(element[elementProperties[p]],elementType,alreadySearched,searchLayer));
      if(element[elementProperties[p]].hasOwnProperty("id")){
        alreadySearched.push(element[elementProperties[p]].id)
      }
    }
  }
  return foundElements;
};

export function getPropertyOfObject(element,objectType,propertyName){
  let bo = getBusinessObject(element);
  let extensionElements = bo.get("extensionElements");
  let foundExtensions = [];
  if(extensionElements && extensionElements.hasOwnProperty("values")){
    for(let v in extensionElements.values){
      if(extensionElements.values[v].$type == objectType){
        foundExtensions.push(extensionElements.values[v])
      }
    }
  }
  if(foundExtensions.length == 0){
    return null
  }else if(foundExtensions[0].hasOwnProperty(propertyName)){
    return foundExtensions[0][propertyName]
  }else{
    console.log("The Property in Question doesn't exist.")
    return null
  }

}

//export function getObjectByType(extensionElements, type){
//  let objects = []
//  if(extensionElements){
//    for(let i in extensionElements.values){
//      if(extensionElements.values[i].$type == type){
//        objects.push(extensionElements.values[i])
//      }
//    }
//  }
//  if(objects.length == 0){
//    return new Object()
//  }
//  return objects[0]
//}

export function modifyCountryTransfer(element, injector){
  var bo = getBusinessObject(element)
  if(bo && "$type" in bo && bo.$type == "bpmn:MessageFlow"){
    let sourceCountry = getPropertyOfObject(element.source.parent,"tilt:Controller","country");
    let targetCountry = getPropertyOfObject(element.target.parent,"tilt:Controller","country");
    if(sourceCountry != targetCountry && sourceCountry != null && targetCountry != null){
      let thirdCountries = getExtensionObject(element,"tilt:ThirdCountryTransfers")
      if(!thirdCountries){
        addFactory(element,injector,[new PropertyBlueprint("tilt:ThirdCountryTransfers",{country:targetCountry})]).call()
      }else{
        var modeling = injector.get("modeling");
        modeling.updateModdleProperties(element,thirdCountries, {country:targetCountry});
      }
    }else{
      let thirdCountries = getExtensionObject(element,"tilt:ThirdCountryTransfers")
      if(thirdCountries){
        var modeling = injector.get("modeling");
        modeling.updateModdleProperties(element,thirdCountries, {country:null});
      }
    }
  }
}

export default class Assistant {
    constructor(injector,eventBus,canvas) {
      eventBus.on("commandStack.connection.create.postExecuted", function(e) {
        var element = e.context.connection
        modifyCountryTransfer(element,injector)
      });
      eventBus.on('commandStack.element.updateModdleProperties.postExecuted', function(e) {
        if(e.context.oldProperties.hasOwnProperty("country") && e.context.moddleElement.$type == "tilt:Controller"){
          var element = e.context.element
          var foundElements = findElements(element,"bpmn:MessageFlow")
          for(let i in foundElements){
            modifyCountryTransfer(foundElements[i],injector)
          } 
        }
      });
    }
  }
  
Assistant.$inject = [
    "injector",
    "eventBus",
    "canvas"
  ];