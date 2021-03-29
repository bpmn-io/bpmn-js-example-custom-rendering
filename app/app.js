import BpmnModeler from 'bpmn-js/lib/Modeler';

import customRendererModule from './custom';

import diagramXML from '../resources/diagram.bpmn';

const containerEl = document.getElementById('container');

// create modeler
const bpmnModeler = new BpmnModeler({
  container: containerEl,
  additionalModules: [
    customRendererModule
  ]
});

// import XML
bpmnModeler.importXML(diagramXML).catch((err) => {
  if (err) {
    console.error(err);
  }
});