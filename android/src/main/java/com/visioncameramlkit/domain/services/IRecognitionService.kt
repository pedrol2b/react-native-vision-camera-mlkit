package com.visioncameramlkit.domain.services

import com.visioncameramlkit.domain.models.ProcessedImage

interface IRecognitionService<T> : AutoCloseable {
  fun recognize(image: ProcessedImage): T
}
