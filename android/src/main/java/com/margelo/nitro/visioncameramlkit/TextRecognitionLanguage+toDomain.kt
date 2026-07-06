package com.margelo.nitro.visioncameramlkit

internal fun TextRecognitionLanguage?.toDomainLanguage(): com.visioncameramlkit.domain.models.TextRecognitionLanguage =
  when (this) {
    TextRecognitionLanguage.CHINESE -> com.visioncameramlkit.domain.models.TextRecognitionLanguage.CHINESE
    TextRecognitionLanguage.DEVANAGARI -> com.visioncameramlkit.domain.models.TextRecognitionLanguage.DEVANAGARI
    TextRecognitionLanguage.JAPANESE -> com.visioncameramlkit.domain.models.TextRecognitionLanguage.JAPANESE
    TextRecognitionLanguage.KOREAN -> com.visioncameramlkit.domain.models.TextRecognitionLanguage.KOREAN
    TextRecognitionLanguage.LATIN,
    null,
    -> com.visioncameramlkit.domain.models.TextRecognitionLanguage.LATIN
  }
