export const pythonDiff = `
diff --git a/src/app.py b/src/app.py
index 1111111..3333333 100644
--- a/src/app.py
+++ b/src/app.py
@@ -1,6 +1,8 @@
-import sys
+import sys
+import os
+import logging

-def main():
-    print("Hello World")
+def main():
+    count = 0
+    print("Hello Python Diff")

 if __name__ == "__main__":
-    main()
+    main()
+
+# ===== huge unchanged block =====
+for i in range(1, 21):
+    print(f"Line {i}")
+
@@ -25,6 +45,10 @@
+ # ===== second hunk =====
+def new_feature():
+    print("New feature added")
+
+ # ===== another huge unchanged block =====
+for i in range(21, 61):
+    print(f"Line {i}")
+
@@ -65,3 +89,7 @@
-# old_feature = lambda: print("Old feature")
+ # ===== third hunk =====
+final_message = "Diff Python test completed!"
+print(final_message)
+
+ # ===== extra unchanged lines =====
+for i in range(61, 81):
+    print(f"Line {i}")
`;
