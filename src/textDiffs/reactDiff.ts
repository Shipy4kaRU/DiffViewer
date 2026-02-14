export const reactDiff = `
diff --git a/src/App.tsx b/src/App.tsx
index 1111111..3333333 100644
--- a/src/App.tsx
+++ b/src/App.tsx
@@ -1,6 +1,8 @@
-import React from 'react';
+import React, { useState, useEffect } from 'react';
 import './App.css';

-function App() {
-  return <div className="App">Hello World</div>;
+function App() {
+  const [count, setCount] = useState(0);
+  return <div className="App">Hello React Diff</div>;
 }

 export default App;
+
+// ===== huge unchanged block =====
+console.log('Line 1');
+console.log('Line 2');
+console.log('Line 3');
+console.log('Line 4');
+console.log('Line 5');
+console.log('Line 6');
+console.log('Line 7');
+console.log('Line 8');
+console.log('Line 9');
+console.log('Line 10');
+console.log('Line 11');
+console.log('Line 12');
+console.log('Line 13');
+console.log('Line 14');
+console.log('Line 15');
+console.log('Line 16');
+console.log('Line 17');
+console.log('Line 18');
+console.log('Line 19');
+console.log('Line 20');
+
@@ -25,6 +45,10 @@
+// ===== second hunk =====
+const newFeature = () => {
+  console.log('New feature added');
+};
+
+// ===== another huge unchanged block =====
+for (let i = 21; i <= 60; i++) {
+  console.log('Line ' + i);
+}
+
@@ -65,3 +89,7 @@
-// const oldFeature = () => { console.log('Old feature'); };
+// ===== third hunk =====
+const finalMessage = 'Diff test completed!';
+console.log(finalMessage);
+
+// ===== extra unchanged lines =====
+for (let i = 61; i <= 80; i++) {
+  console.log('Line ' + i);
+}
`;
