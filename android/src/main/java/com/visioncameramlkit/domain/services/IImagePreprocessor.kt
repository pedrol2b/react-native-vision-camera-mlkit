package com.visioncameramlkit.domain.services

import com.mrousavy.camera.frameprocessors.Frame
import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.ProcessedImage
import java.io.File

interface IImagePreprocessor {
  fun preprocessFrame(
    frame: Frame,
    options: ImagePreprocessingOptions,
  ): ProcessedImage

  fun preprocessImage(
    imageFile: File,
    options: ImagePreprocessingOptions,
  ): ProcessedImage
}
