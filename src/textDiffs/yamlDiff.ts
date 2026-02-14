export const yamldiff = `
diff --git a/config/settings.yaml b/config/settings.yaml
index 1111111..3333333 100644
--- a/config/settings.yaml
+++ b/config/settings.yaml
@@ -1,6 +1,8 @@
-environment: production
+environment: development
+debug: true
 logging:
   level: info
   format: json

@@ -10,5 +12,9 @@
-database:
-  host: db.example.com
-  port: 5432
+database:
+  host: localhost
+  port: 5432
+  username: user
+  password: pass
+
+// ===== huge unchanged block =====
+services:
+  service1: enabled
+  service2: enabled
+  service3: enabled
+  service4: enabled
+  service5: enabled
+  service6: enabled
+  service7: enabled
+  service8: enabled
+  service9: enabled
+  service10: enabled
+  service11: enabled
+  service12: enabled
+  service13: enabled
+  service14: enabled
+  service15: enabled
+  service16: enabled
+  service17: enabled
+  service18: enabled
+  service19: enabled
+  service20: enabled
+
@@ -30,6 +54,10 @@
+// ===== second hunk =====
+features:
+  newFeature: true
+
+// ===== another huge unchanged block =====
+plugins:
+  - plugin1
+  - plugin2
+  - plugin3
+  - plugin4
+  - plugin5
+  - plugin6
+  - plugin7
+  - plugin8
+  - plugin9
+  - plugin10
+  - plugin11
+  - plugin12
+  - plugin13
+  - plugin14
+  - plugin15
+  - plugin16
+  - plugin17
+  - plugin18
+  - plugin19
+  - plugin20
+
@@ -65,3 +89,7 @@
-# oldFeature: disabled
+// ===== third hunk =====
+finalMessage: "Diff YAML test completed!"
+
+// ===== extra unchanged lines =====
+misc:
+  setting1: true
+  setting2: false
+  setting3: true
+  setting4: false
+  setting5: true
+  setting6: false
+  setting7: true
+  setting8: false
`;
