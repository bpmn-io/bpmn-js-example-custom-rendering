> > This example is part of our [:notebook: custom elements guide](https://github.com/bpmn-io/bpmn-js-examples/tree/master/custom-elements). Checkout the final result [here](https://github.com/bpmn-io/bpmn-js-example-custom-elements).


# bpmn-js Example: Custom Rendering

An example of creating custom rendering for [bpmn-js](https://github.com/bpmn-io/bpmn-js). Custom rendering allows you to render any shape or connection the way you want.


## About

This example renders `bpmn:Task` and `bpmn:Event` elements differently.

![Screenshot](docs/screenshot.png)

### Creating a Custom Renderer

In order to render `bpmn:Task` and `bpmn:Event` elements differently we'll create a custom renderer. By extending [BaseRenderer](https://github.com/bpmn-io/diagram-js/blob/master/lib/draw/BaseRenderer.js) we make sure our renderer will be called whenever a shape or connection is to be rendered. Note that we also specify a priority higher than the default priority of 1000 so our renderer will be called first.

```javascript
const HIGH_PRIORITY = 1500;

export default class CustomRenderer extends BaseRenderer {
  constructor(eventBus) {
    super(eventBus, HIGH_PRIORITY);

    ...
  }
  ...
}
```

Whenever our renderer is called we need to decide whether we want to render an element or if the [default renderer](https://github.com/bpmn-io/bpmn-js/blob/master/lib/draw/BpmnRenderer.js) should render it. We're only interested in rendering `bpmn:Task` and `bpmn:Event` elements:

```javascript
canRender(element) {

  // only render tasks and events (ignore labels)
  return isAny(element, [ 'bpmn:Task', 'bpmn:Event' ]) && !element.labelTarget;
}
```

Once we've decided to render an element depending on the element's type our renderers `drawShape` or `drawConnection` will be called. Since we only render shapes, we don't need to implement `drawConnection`. We don't want to render tasks and events entirely different, so we'll let the default renderer do the heavy lifting of rendering the shape and then change it afterward:

```javascript
drawShape(parentNode, element) {
    const shape = this.bpmnRenderer.drawShape(parentNode, element);

    if (is(element, 'bpmn:Task')) {
      const rect = drawRect(parentNode, 100, 80, TASK_BORDER_RADIUS, '#52B415');

      prependTo(rect, parentNode);

      svgRemove(shape);

      return shape;
    }

    const rect = drawRect(parentNode, 30, 20, TASK_BORDER_RADIUS, '#cc0000');

    svgAttr(rect, {
      transform: 'translate(-20, -10)'
    });

    return shape;
  }
```

If the element is a `bpmn:Task` we render the task first and then replace its rectangle with our own rectangle. Therefore, we don't have to render labels and markers ourselves.

In the case of `bpmn:Event` elements we let the default renderer render the element first before we render an additional rectangle on top of it.

You can also decide to take care of the rendering entirely on your own without using the default renderer at all.

Finally, since we are rendering shapes we need to implement a `getShapePath` method which will be called whenever a connection is to be cropped:

```javascript
getShapePath(shape) {
  if (is(shape, 'bpmn:Task')) {
    return getRoundRectPath(shape, TASK_BORDER_RADIUS);
  }

  return this.bpmnRenderer.getShapePath(shape);
}
```

See the entire renderer [here](app/custom/CustomRenderer.js).

Next, let's add our custom renderer to bpmn-js.

### Adding the Custom Renderer to bpmn-js

When creating a new instance of bpmn-js we need to add our custom renderer using the `additionalModules` property:

```javascript
import BpmnModeler from 'bpmn-js/lib/Modeler';

import customRendererModule from './custom';

const bpmnModeler = new BpmnModeler({
  additionalModules: [
    customRendererModule
  ]
});
```

Our custom renderer will now render all task and event shapes.

## Run the Example

You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project.

To install all project dependencies execute

```sh
npm install
```

To start the example execute

```sh
npm start
```

To build the example into the `public` folder execute

```sh
npm run all
```


## License

MIT
