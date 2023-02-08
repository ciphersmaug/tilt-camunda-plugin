import { Group, ListGroup } from "@bpmn-io/properties-panel";
import PropertyBlueprint from "../property-blueprint";
import { createTextField, createCheckBox, createNumberField, removeFactory, addFactory } from "./tilt-property-groups";

export function getPropertyFromModdle(propertyName,moddle){
    let propertyShortName = propertyName;
    if(propertyName.includes(":")){
        propertyShortName = propertyName.split(":")[1];
    }
    
    let foundModdleProperty = moddle.types.filter(n => n.name == propertyShortName);
    if(foundModdleProperty.length && foundModdleProperty.length == 1){
        foundModdleProperty = foundModdleProperty[0];
        return foundModdleProperty;
    }else{
        //console.error("There is not a valid moddle in the description file.")
        debugger;
        return null;
    }
}

export function createPropertyGroupFromModdle(propertyName, element, injector, moddle, properties, index = 1){
    let entries = [];
    let foundModdleProperty = getPropertyFromModdle(propertyName,moddle)
    if(!foundModdleProperty){
        return
    }
    let p;
    let l;
    let addButton;
    for(let i in foundModdleProperty.properties){
        p = foundModdleProperty.properties[i];
        switch (p.type) {
            case "String":
                entries.push({
                    id: `${foundModdleProperty.name.toLowerCase()}-${p.ns.localName}`,
                    component: createTextField,
                    properties: properties,
                    element: element,
                    name: p.ns.localName,
                    label: p.label,
                    description: p.description,
                    regex: new RegExp(p.regex),
                    errMsg: p.errMsg
                  })
              break;
            case "Integer":
                entries.push({
                    id: `${foundModdleProperty.name.toLowerCase()}-${p.ns.localName}`,
                    component: createNumberField,
                    properties: properties,
                    element: element,
                    name: p.ns.localName,
                    label: p.label,
                    description: p.description,
                    regex: new RegExp(p.regex),
                    errMsg: p.errMsg
                  })
              break;
            case "Boolean":
                entries.push({
                    id: `${foundModdleProperty.name.toLowerCase()}-${p.ns.localName}`,
                    component: createCheckBox,
                    properties: properties,
                    element: element,
                    name: p.ns.localName,
                    label: p.label,
                    description: p.description,
                    regex: new RegExp(p.regex),
                    errMsg: p.errMsg
                  })
              break;
            default:
                l = [];
                for(let j in properties[p.ns.localName]){
                    l.push(createPropertyGroupFromModdle(`${p.type}`, element, injector, moddle, properties[p.ns.localName][j],parseInt(j)+1));
                  }
                addButton = null;
                if(l.length < p.max || p.max < 0){
                    addButton = addFactory(element, injector,[new PropertyBlueprint(`${p.type}`, {}, properties)]);
                }
                // Liste
                if(l.length == 1 && p.max <= l.length && p.max > 0){
                    entries.push({
                        id: `${foundModdleProperty.name.toLowerCase()}-${p.ns.localName}`,
                        label: p.label,
                        entries: l[0].entries,
                        component: Group                        
                    });
                }else{
                    entries.push({
                        id: `${foundModdleProperty.name.toLowerCase()}-${p.ns.localName}`,
                        label: p.label,
                        component: ListGroup,
                        add: addButton,
                        items: l
                    });
                }
        }
    }

    return {
        id: `${element.id}-${foundModdleProperty.name}-${index}`,
        label: `${foundModdleProperty.label} ${index}`,
        entries,
        remove: removeFactory(element, properties, injector.get('modeling'))
    };
}