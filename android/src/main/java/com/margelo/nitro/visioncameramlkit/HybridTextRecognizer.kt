package com.margelo.nitro.visioncameramlkit

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.margelo.nitro.camera.HybridFrameSpec

@DoNotStrip
@Keep
class HybridTextRecognizer(
  private val options: TextRecognizerOptions,
) : HybridTextRecognizerSpec() {
  override fun recognize(frame: HybridFrameSpec, args: MLKitBaseArguments?): TextRecognitionResult {
    throw Error("VisionCamera v5 text recognition frame processing is not implemented yet.")
  }
}
