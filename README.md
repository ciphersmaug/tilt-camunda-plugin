# TILT Camunda Modeler Plug-in

## Building

Install dependencies:
npm14
```sh
npm install
```

Package plugin to `dist/client.js`:

```sh
npm run bundle


To test a git Change
# or

npm run bundle:watch
```
```xml
<bpmn:extensionElements>
  <tilt:properties>
    <tilt:meta name="input:" value="String;MyWorld 123" />
  </tilt:properties>
</bpmn:extensionElements>
```
## Licence

MIT
