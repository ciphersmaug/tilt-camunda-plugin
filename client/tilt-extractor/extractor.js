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
export function filterObjectsWithTiltProperty(businessObjects,tiltProperty){
    let tiltProperties = [];
    let extensionElements;
    for(let bo in businessObjects){
        extensionElements = businessObjects[bo].get("extensionElements");
        if(extensionElements){
            tiltProperties.push(...extensionElements.values.filter(e => e.$type == tiltProperty))
        }
    }
    debugger;
    return tiltProperties;
}
export function cleanPropertyThroughSchema(tiltProperty,tiltSchema = schema){
    var propertyName = tiltProperty.$type.split(":")[1];
    propertyName = propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
    var schemaProperties = getSchemaProperty(propertyName,tiltSchema).properties;
    if(!schemaProperties){
        console.error("cant find Property in Tilt schema")
    }
    var cleanObject = {};
    for(let s in schemaProperties){
        if(schemaProperties[s].type=="object"){
            if(tiltProperty.get(s) instanceof Array && tiltProperty.get(s).length == 1){
                cleanObject[s] = cleanPropertyThroughSchema(...tiltProperty.get(s),tiltSchema)
            }else{
                debugger;
                var arr = tiltProperty.get(s);
                cleanObject[s] = [];
                for(let a in arr){
                    cleanObject[s].push(cleanPropertyThroughSchema(arr[a],tiltSchema))
                }
            }
        }else if(schemaProperties[s].type=="array"){
            debugger;
            console.error("Not implemented yet.")
        }else{
            cleanObject[s] = tiltProperty.get(s)
        }
        if(!cleanObject[s]){
            cleanObject[s] = null;
        }
    }
    return cleanObject
}

export function getSchemaProperty(propertyName, tiltSchema = schema){
    for(let p in tiltSchema.properties){
        if(p == propertyName){
            return tiltSchema.properties[p];
        }else{
            var result = getSchemaProperty(propertyName,tiltSchema.properties[p]);
            if(Object.keys(result).length != 0){
                return result;
             }
        }
    }
    return {};
}

function extractSingleField(singleArray){
    if(!((singleArray instanceof Array) && (singleArray.length == 1))){
        alert(`TILT Extractor error on ${singleArray[0]} field.`)
        debugger;
        return {};
    }
    return cleanPropertyThroughSchema(singleArray[0]);
}
function extractMultipleFields(multipleArray){
    if(!((multipleArray instanceof Array) && (multipleArray.length > 1))){
        alert(`TILT Extractor error on ${multipleArray[0]} field.`)
        debugger;
        return {};
    }
    var r = [];
    for(let a in multipleArray){
        r.push(cleanPropertyThroughSchema(multipleArray[a]))
    }
    return r;
}

export function buildTiltDocument(canvas){
    const businessObjects = getBusinessObjectsFromCanvas(canvas);
    var tiltDocument = {};
    tiltDocument["meta"] = extractSingleField(filterObjectsWithTiltProperty(businessObjects,"tilt:Meta"));
    tiltDocument["controller"] = extractSingleField(filterObjectsWithTiltProperty(businessObjects,"tilt:Controller"));
    tiltDocument["dataProtectionOfficer"] = extractSingleField(filterObjectsWithTiltProperty(businessObjects,"tilt:DataProtectionOfficer"));
    tiltDocument["dataDisclosed"] = extractMultipleFields(filterObjectsWithTiltProperty(businessObjects,"tilt:DataDisclosed"));
    return tiltDocument;
}