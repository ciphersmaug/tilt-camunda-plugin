import tiltIcon from "../../assets/tilt.svg";
import tiltControllerIcon from "../../assets/controller.svg";
import tiltDataDisclosedIcon from "../../assets/datadisclosed.svg";
import flagIcon from "../../assets/flag.svg";
import tiltDataProtectionOfficerIcon from "../../assets/protection.svg";
import tiltRepresentativeIcon from "../../assets/representative.svg"
import { getBusinessObject } from "bpmn-js/lib/util/ModelUtil";

const events = [
  'commandStack.element.updateModdleProperties.postExecuted',
  'shape.added'
]
const toggleEvents = ['canvas.viewbox.changed']

function addTiltOverlays(overlays,e){
  const element = getElementFromEvent(e);
  const bo = getBusinessObject(element);
  const extensionElements = bo.get("extensionElements");

  // Discover all existing Tilt Extensions
  var arr = [];
  if(extensionElements){
    for(let v in extensionElements.values){
      let t = extensionElements.values[v].$type;
      if(t.startsWith("tilt")){
        if(!arr.includes(t)){
          arr.push(t)
        }
      }
    }
  }

  // Remove existing Overlays
  const currentO = overlays.get({element: element.id});
  for(let o in currentO){
    debugger;
    overlays.remove(currentO[o].id)
  }

  // Add new Overlays
  for(let a in arr){
    switch(arr[a]) {
        case "tilt:Controller":
          addOverlay(overlays,element.id,tiltControllerIcon);
          break;
        case "tilt:DataDisclosed":
          addOverlay(overlays,element.id,tiltDataDisclosedIcon);
          break;
        case "tilt:DataProtectionOfficer":
          addOverlay(overlays,element.id,tiltDataProtectionOfficerIcon);
          break;
        case "tilt:Representative":
          addOverlay(overlays,element.id,tiltRepresentativeIcon);
          break;
        case "tilt:ThirdCountryTransfers":
          //let deltaX = Math.abs(element.waypoints[0].x - element.waypoints[element.waypoints.length-1].x);
          //let deltaY = Math.abs(element.waypoints[0].y - element.waypoints[element.waypoints.length-1].y);
           
          overlays.add(`${element.id}`, {
            html: `<div class="filter-error">${flagIcon}</div>`,
            position: {
              top: 10,//deltaY/2,
              left: 10//deltaX/2
            }
          });
          break;
        default:
          addOverlay(overlays,element.id,tiltIcon)
          break;
          // code block
      }
  }
  return {}
}

function addOverlay(overlays,id,icon, c = "filter-tilt"){
  let g = overlays.get({element: id})
  overlays.add(`${id}`, {
    html: `<div class="${c}">${icon}</div>`,
    position: {
      left: -5+g.length * 24,
      top: -30
    }
  });
}

function getElementFromEvent(e){
  if(e.hasOwnProperty("context")){
    return e.context.element;
  }else{
    return e.element;
  }
}

export default class TiltOverlayProvider {
    constructor(injector,overlays,eventBus,editorActions) {
      //this._injector = injector;
      //this._overlays = overlays;
      window.toggleTilt = true;
      this.addEventListener(eventBus,events,overlays);

      //Whenever there is a viebox change we need to reactivate the toggle.
      toggleEvents.forEach(function(event) {
        eventBus.on(event, function(e) {
          if(window.toggleTilt){
            overlays.show();
          }else{
            overlays.hide()
          }
          //console.log(event +": "+e)
        });
       });

      
      editorActions.register({
        toggleTiltIcons: function() {
          window.toggleTilt = !window.toggleTilt;
          if(window.toggleTilt){
            overlays.show();
          }else{
            overlays.hide()
          }
          //console.log(window.toggleTilt)
        }
      });
      //editorActions.trigger("toggleTiltIcons")
    }
    addEventListener(eventBus,eventList,overlays){
      eventList.forEach(function(event) {
        eventBus.on(event, function(e) {
          addTiltOverlays(overlays,e);
        });
       });
    }
  }
  
  TiltOverlayProvider.$inject = [
    "injector",
    "overlays",
    "eventBus",
    "editorActions"
  ];