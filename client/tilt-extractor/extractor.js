import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";
import schema from "../descriptors/tilt-schema.json";

export function getBusinessObjectsFromCanvas(canvas){
    let businessObjects = []
    let elements = canvas._elementRegistry._elements
    for(let e in elements){
        businessObjects.push(getBusinessObject(elements[e].element));
    }
    return businessObjects;
}
export function filterObjectsWithTiltProperty(businessObjects,tiltProperty,maxOne = false){
    let tiltProperties = [];
    let extensionElements;
    for(let bo in businessObjects){
        extensionElements = businessObjects[bo].get("extensionElements");
        if(extensionElements){
            if(!extensionElements.hasOwnProperty("values")){
                //console.log(extensionElements)
                continue;
            }
            tiltProperties.push(...extensionElements.values.filter(e => e.$type == tiltProperty))
        }
    }
    
    if(maxOne && tiltProperties.length > 1){
        for(let i in tiltProperties){
            if(tiltProperties[i].hasOwnProperty("main") && tiltProperties[i].main){
                return [tiltProperties[i]];
            }
        }
        alert(`TILT Error: ${tiltProperties[0].$type} must exists exactly once. Skipping this TILT-Field.`)
        return [];
    }
    return tiltProperties;
}
export function cleanPropertyThroughSchema(tiltProperty,tiltSchema = schema){
    if(Array.isArray(tiltProperty)){
        let l = [];
        for(let a in tiltProperty){
            l.push(cleanPropertyThroughSchema(tiltProperty[a],tiltSchema))
        }
        return l
    }
    var propertyName = tiltProperty.$type.split(":")[1];
    propertyName = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
    var schemaProperties = getSchemaProperty(propertyName,tiltSchema).properties;
    if(!schemaProperties){
        try{
            schemaProperties = getSchemaProperty(propertyName,tiltSchema).items.anyOf[0].properties
        }catch{
            debugger;
            console.error("cant find Property in Tilt schema")
        }
        
    }
    var cleanObject = {};
    for(let s in schemaProperties){
        if(schemaProperties[s].type=="object"){
            if(tiltProperty.get(s) instanceof Array && tiltProperty.get(s).length == 1){
                cleanObject[s] = cleanPropertyThroughSchema(...tiltProperty.get(s),tiltSchema)
            }else{
                var arr = tiltProperty.get(s);
                cleanObject[s] = [];
                for(let a in arr){
                    cleanObject[s].push(cleanPropertyThroughSchema(arr[a],tiltSchema))
                }
            }
        }else if(schemaProperties[s].type=="array"){
            var arr = tiltProperty.get(s);
                cleanObject[s] = [];
                for(let a in arr){
                    cleanObject[s].push(cleanPropertyThroughSchema(arr[a],tiltSchema))
                }
        }else{
            cleanObject[s] = tiltProperty.get(s)
        }
        if(!cleanObject[s]){
            cleanObject[s] = null;
        }
    }
    return cleanObject
}

//else if(tiltSchema.hasOwnProperty("items")){
//    debugger;
//    result = getSchemaProperty(propertyName,tiltSchema.items.anyOf[0])
//}

export function getSchemaProperty(propertyName, tiltSchema = schema){
    if(tiltSchema.hasOwnProperty("items")){
        tiltSchema = tiltSchema.items.anyOf[0];
    }
    for(let p in tiltSchema.properties){
        if(p == propertyName){
            return tiltSchema.properties[p];
        }else{
            var result;
            result = getSchemaProperty(propertyName,tiltSchema.properties[p]);
            if(Object.keys(result).length != 0){
                return result;
            }
        }
    }
    //console.log(propertyName)
    return {};
}

export function buildTiltDocument(canvas){
    const businessObjects = getBusinessObjectsFromCanvas(canvas);
    const fieldsToExtract = {
        "tilt:Meta":true,
        "tilt:Controller":true,
        "tilt:DataProtectionOfficer":true,
        "tilt:DataDisclosed":false,
        "tilt:ThirdCountryTransfers":false,
        "tilt:AccessAndDataPortability":true,
        "tilt:Sources":false,
        "tilt:RightToInformation":true,
        "tilt:RightToRectificationOrDeletion":true,
        "tilt:RightToDataPortability":true,
        "tilt:RightToWithdrawConsent":true,
        "tilt:RightToComplain":true,
        "tilt:AutomatedDecisionMaking":false,
        "tilt:ChangesOfPurpose":true
    }
    var tiltDocument = {};
    for(let i in fieldsToExtract){
        tiltDocument[i] = cleanPropertyThroughSchema(
            filterObjectsWithTiltProperty(
                businessObjects,
                i,
                fieldsToExtract[i]));
    }
    return tiltDocument;
}

export function saveFile(canvas){
    var object = buildTiltDocument(canvas)
    var json_string = JSON.stringify(object, undefined, 2);
    var link = document.createElement('a');
    link.download = 'NewTiltDocument.tilt.json';
    var blob = new Blob([json_string], {type: 'application/json'});
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }