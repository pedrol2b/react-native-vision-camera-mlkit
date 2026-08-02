project(VisionCameraMLKit)
cmake_minimum_required(VERSION 3.9.0)

set(PACKAGE_NAME VisionCameraMLKit)
set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 20)

add_library(${PACKAGE_NAME} SHARED
  src/main/cpp/cpp-adapter.cpp
)

add_definitions(-DBUILDING_VISIONCAMERAMLKIT_WITH_GENERATED_CMAKE_PROJECT)
add_definitions(-DRN_SERIALIZABLE_STATE)

include_directories(
  "../nitrogen/generated/shared/c++"
  "../nitrogen/generated/android/c++"
  "../nitrogen/generated/android/"
  "src/main/cpp"
  "../cpp"
)

target_sources(
  ${PACKAGE_NAME} PRIVATE
  ../nitrogen/generated/shared/c++/HybridBarcodeScannerSpec.cpp
  ../nitrogen/generated/shared/c++/HybridTextRecognizerSpec.cpp
  ../nitrogen/generated/shared/c++/HybridVisionCameraMLKitSpec.cpp
  ../nitrogen/generated/android/c++/JHybridBarcodeScannerSpec.cpp
  ../nitrogen/generated/android/c++/JHybridTextRecognizerSpec.cpp
  ../nitrogen/generated/android/c++/JHybridVisionCameraMLKitSpec.cpp
  ../nitrogen/generated/android/c++/JVariant_NullType_Double.cpp
)

find_library(LOG_LIB log)
find_package(fbjni REQUIRED)
find_package(ReactAndroid REQUIRED)
find_package(react-native-nitro-modules REQUIRED)
find_package(react-native-vision-camera REQUIRED)

target_link_libraries(
  ${PACKAGE_NAME}
  ${LOG_LIB}
  android
  fbjni::fbjni
  ReactAndroid::jsi
  react-native-nitro-modules::NitroModules
  react-native-vision-camera::VisionCamera
)

if(ReactAndroid_VERSION_MINOR GREATER_EQUAL 76)
  target_link_libraries(
    ${PACKAGE_NAME}
    ReactAndroid::reactnative
  )
else()
  target_link_libraries(
    ${PACKAGE_NAME}
    ReactAndroid::react_nativemodule_core
  )
endif()
