package com.visioncameramlkit.domain.services

import com.visioncameramlkit.domain.models.ImagePreprocessingOptions
import com.visioncameramlkit.domain.models.ProcessedImage
import java.io.File

interface IImagePreprocessor {
  fun preprocessImage(
    imageFile: File,
    options: ImagePreprocessingOptions,
  ): ProcessedImage
}
