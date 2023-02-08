const { filterObjectsWithTiltProperty, getBusinessObjectsFromCanvas } = require("../client/tilt-extractor/extractor");

export function test_if_properties_exists(node, tilt_type, propertiesToTest){
    if ("extensionElements" in node){
        for (let i = 0; i < node["extensionElements"]["values"].length; i++) {
            if (node["extensionElements"]["values"][i].$type == tilt_type){
                if (propertiesToTest.every(function(x) { return (x in node["extensionElements"]["values"][i]) && node["extensionElements"]["values"][i][x] != null})){
                    return true;
                }
            }
          }
    };
    return false;
}
export function tiltMustExistOnlyOnce(tilt_type){
    let arr = filterObjectsWithTiltProperty(getBusinessObjectsFromCanvas(bpmnjsInjector.get("canvas")),tilt_type)
    let counter = 0;
    //debugger;
    for(let a in arr){
        if(arr[a].hasOwnProperty("main")&&arr[a].main){
            counter++
        }
    }
    return arr.length == 1 || counter == 1;
 }

export function getTiltFromElementIfExists(node, tilt_type){
    if(node.hasOwnProperty("extensionElements")){
        for(var e in node.extensionElements.values){
            if(node.extensionElements.values[e].$type == tilt_type){
                return node.extensionElements.values[e]                
            }
        }
    }
    return false
}

export function test_if_is_tilt(node, tilt_type){
    if ("extensionElements" in node){
        for (let i = 0; i < node["extensionElements"]["values"].length; i++) {
            if (node["extensionElements"]["values"][i].$type == tilt_type){
                return true;
            }
          }
    };
    return false;
}
export function test(){
    return false;
}