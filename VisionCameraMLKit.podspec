require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

# Load MLKit configuration from global variable set in Podfile
# Default configuration
default_config = {
  'textRecognition' => true,
  'textRecognitionChinese' => true,
  'textRecognitionDevanagari' => true,
  'textRecognitionJapanese' => true,
  'textRecognitionKorean' => true,
  'faceDetection' => false,
  'poseDetection' => false,
  'poseDetectionAccurate' => false,
  'selfieSegmentation' => false,
  'barcodeScanning' => false,
  'imageLabeling' => false,
  'objectDetection' => false,
  'digitalInkRecognition' => false,
}

# Read from global variable set in Podfile
if defined?($VisionCameraMLKit)
  mlkit_config = default_config.merge($VisionCameraMLKit)
  puts "VisionCameraMLKit: Using custom configuration from Podfile"
else
  mlkit_config = default_config
  puts "VisionCameraMLKit: Using default configuration"
end

Pod::Spec.new do |s|
  s.name         = "VisionCameraMLKit"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/pedrol2b/react-native-vision-camera-mlkit.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift,cpp}"
  s.private_header_files = "ios/**/*.h"

  s.dependency "VisionCamera"

  # Generate Swift compiler flags for conditional compilation
  swift_flags = []
  swift_flags << "MLKIT_TEXT_RECOGNITION" if mlkit_config['textRecognition']
  swift_flags << "MLKIT_TEXT_RECOGNITION_CHINESE" if mlkit_config['textRecognitionChinese']
  swift_flags << "MLKIT_TEXT_RECOGNITION_DEVANAGARI" if mlkit_config['textRecognitionDevanagari']
  swift_flags << "MLKIT_TEXT_RECOGNITION_JAPANESE" if mlkit_config['textRecognitionJapanese']
  swift_flags << "MLKIT_TEXT_RECOGNITION_KOREAN" if mlkit_config['textRecognitionKorean']
  swift_flags << "MLKIT_FACE_DETECTION" if mlkit_config['faceDetection']
  swift_flags << "MLKIT_POSE_DETECTION" if mlkit_config['poseDetection']
  swift_flags << "MLKIT_POSE_DETECTION_ACCURATE" if mlkit_config['poseDetectionAccurate']
  swift_flags << "MLKIT_SELFIE_SEGMENTATION" if mlkit_config['selfieSegmentation']
  swift_flags << "MLKIT_BARCODE_SCANNING" if mlkit_config['barcodeScanning']
  swift_flags << "MLKIT_IMAGE_LABELING" if mlkit_config['imageLabeling']
  swift_flags << "MLKIT_OBJECT_DETECTION" if mlkit_config['objectDetection']
  swift_flags << "MLKIT_DIGITAL_INK_RECOGNITION" if mlkit_config['digitalInkRecognition']

  # Generate preprocessor definitions for Objective-C/C++ files
  preprocessor_definitions = swift_flags.map { |flag| "#{flag}=1" }.join(' ')

  s.pod_target_xcconfig = {
    'SWIFT_ACTIVE_COMPILATION_CONDITIONS' => swift_flags.join(' '),
    'GCC_PREPROCESSOR_DEFINITIONS' => "$(inherited) #{preprocessor_definitions}"
  }

  # ===== GoogleMLKit Vision =====
  # Only include dependencies for enabled features

  # Text recognition v2
  # https://developers.google.com/ml-kit/vision/text-recognition/v2/ios
  if mlkit_config['textRecognition']
    s.dependency "GoogleMLKit/TextRecognition"
  end
  if mlkit_config['textRecognitionChinese']
    s.dependency "GoogleMLKit/TextRecognitionChinese"
  end
  if mlkit_config['textRecognitionDevanagari']
    s.dependency "GoogleMLKit/TextRecognitionDevanagari"
  end
  if mlkit_config['textRecognitionJapanese']
    s.dependency "GoogleMLKit/TextRecognitionJapanese"
  end
  if mlkit_config['textRecognitionKorean']
    s.dependency "GoogleMLKit/TextRecognitionKorean"
  end

  # Face detection
  # https://developers.google.com/ml-kit/vision/face-detection/ios
  if mlkit_config['faceDetection']
    s.dependency "GoogleMLKit/FaceDetection"
  end

  # Face mesh detection (Beta) -> !NOT SUPPORTED ON IOS!

  # Pose detection (Beta)
  # https://developers.google.com/ml-kit/vision/pose-detection/ios
  if mlkit_config['poseDetection']
    s.dependency "GoogleMLKit/PoseDetection"
  end
  if mlkit_config['poseDetectionAccurate']
    s.dependency "GoogleMLKit/PoseDetectionAccurate"
  end

  # Selfie segmentation (Beta)
  # https://developers.google.com/ml-kit/vision/selfie-segmentation/ios
  if mlkit_config['selfieSegmentation']
    s.dependency "GoogleMLKit/SegmentationSelfie"
  end

  # Subject segmentation (Beta) -> !NOT SUPPORTED ON IOS!

  # Document scanner -> !NOT SUPPORTED ON IOS!

  # Barcode scanning
  # https://developers.google.com/ml-kit/vision/barcode-scanning/ios
  if mlkit_config['barcodeScanning']
    s.dependency "GoogleMLKit/BarcodeScanning"
  end

  # Image labeling (Base Model) -> Custom models will be added soon
  # https://developers.google.com/ml-kit/vision/image-labeling/ios
  if mlkit_config['imageLabeling']
    s.dependency "GoogleMLKit/ImageLabeling"
  end

  # Object detection and tracking (Base Model) -> Custom models will be added soon
  # https://developers.google.com/ml-kit/vision/object-detection/ios
  if mlkit_config['objectDetection']
    s.dependency "GoogleMLKit/ObjectDetection"
  end

  # Digital ink recognition
  # https://developers.google.com/ml-kit/vision/digital-ink-recognition/ios
  if mlkit_config['digitalInkRecognition']
    s.dependency "GoogleMLKit/DigitalInkRecognition"
  end

  # ===== GoogleMLKit Vision =====

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
  s.dependency "React-Core"
  end
end
