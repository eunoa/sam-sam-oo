[1mdiff --git a/backend/coordinator/gradlew b/backend/coordinator/gradlew[m
[1mindex b9bb139..ef07e01 100644[m
[1m--- a/backend/coordinator/gradlew[m
[1m+++ b/backend/coordinator/gradlew[m
[36m@@ -57,7 +57,7 @@[m
 #       Darwin, MinGW, and NonStop.[m
 #[m
 #   (3) This script is generated from the Groovy template[m
[31m-#       https://github.com/gradle/gradle/blob/3d91ce3b8caaf77ad09f381f43615b715b53f72c/platforms/jvm/plugins-application/src/main/resources/org/gradle/api/internal/plugins/unixStartScript.txt[m
[32m+[m[32m#       https://github.com/gradle/gradle/blob/HEAD/platforms/jvm/plugins-application/src/main/resources/org/gradle/api/internal/plugins/unixStartScript.txt[m
 #       within the Gradle project.[m
 #[m
 #       You can find Gradle at https://github.com/gradle/gradle/.[m
[36m@@ -114,6 +114,7 @@[m [mcase "$( uname )" in                #([m
   NONSTOP* )        nonstop=true ;;[m
 esac[m
 [m
[32m+[m[32mCLASSPATH="\\\"\\\""[m
 [m
 [m
 # Determine the Java command to use to start the JVM.[m
[36m@@ -171,6 +172,7 @@[m [mfi[m
 # For Cygwin or MSYS, switch paths to Windows format before running java[m
 if "$cygwin" || "$msys" ; then[m
     APP_HOME=$( cygpath --path --mixed "$APP_HOME" )[m
[32m+[m[32m    CLASSPATH=$( cygpath --path --mixed "$CLASSPATH" )[m
 [m
     JAVACMD=$( cygpath --unix "$JAVACMD" )[m
 [m
[36m@@ -210,6 +212,7 @@[m [mDEFAULT_JVM_OPTS='"-Xmx64m" "-Xms64m"'[m
 [m
 set -- \[m
         "-Dorg.gradle.appname=$APP_BASE_NAME" \[m
[32m+[m[32m        -classpath "$CLASSPATH" \[m
         -jar "$APP_HOME/gradle/wrapper/gradle-wrapper.jar" \[m
         "$@"[m
 [m
