export function test_if_properties_exists(node, tilt_type, propertiesToTest){
    if ("extensionElements" in node){
        for (let i = 0; i < node["extensionElements"]["values"].length; i++) {
            if (node["extensionElements"]["values"][i].$type == tilt_type){
                if (propertiesToTest.every(function(x) { return x in node["extensionElements"]["values"][i]})){
                    return true;
                }
            }
          }
    };
    return false;
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