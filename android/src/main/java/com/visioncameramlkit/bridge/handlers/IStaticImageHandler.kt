package com.visioncameramlkit.bridge.handlers

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReadableMap

interface IStaticImageHandler {
  fun process(
    path: String,
    options: ReadableMap,
    promise: Promise,
  )
}
