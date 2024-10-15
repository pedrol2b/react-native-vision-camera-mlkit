package com.visioncameramlkit.plugins

import android.util.Log
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.Tasks
import com.google.mlkit.common.MlKitException
import com.google.mlkit.vision.text.Text
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.TextRecognizer
import com.google.mlkit.vision.text.chinese.ChineseTextRecognizerOptions
import com.google.mlkit.vision.text.devanagari.DevanagariTextRecognizerOptions
import com.google.mlkit.vision.text.japanese.JapaneseTextRecognizerOptions
import com.google.mlkit.vision.text.korean.KoreanTextRecognizerOptions
import com.google.mlkit.vision.text.latin.TextRecognizerOptions
import com.mrousavy.camera.core.FrameInvalidError
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createBoundsMap
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createCornersArray
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createInputImageFromFrame
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createInvertedInputImageFromFrame
import java.util.HashMap

private const val TAG = "VisionCameraMLkitTextRecognitionPlugin"

/**
 * A plugin for recognizing text using ML Kit.
 *
 * @property proxy The VisionCameraProxy instance.
 * @property options The options for the text recognizer.
 */
@Suppress("KDocUnresolvedReference")
class VisionCameraMLkitTextRecognitionPlugin(
    @Suppress(
        "UNUSED_PARAMETER"
    ) proxy: VisionCameraProxy,
    options: Map<String, Any>?
) : FrameProcessorPlugin() {
    private var textRecognizer: TextRecognizer
    private var invertColors: Boolean = false

    init {
        val language = options?.get("language") as? String ?: "LATIN"

        val textRecognizerOptions = when (language) {
            "LATIN" -> TextRecognizerOptions.DEFAULT_OPTIONS
            "CHINESE" -> ChineseTextRecognizerOptions.Builder().build()
            "DEVANAGARI" -> DevanagariTextRecognizerOptions.Builder().build()
            "JAPANESE" -> JapaneseTextRecognizerOptions.Builder().build()
            "KOREAN" -> KoreanTextRecognizerOptions.Builder().build()
            else -> TextRecognizerOptions.DEFAULT_OPTIONS
        }

        this.textRecognizer = TextRecognition.getClient(textRecognizerOptions)
        this.invertColors = options?.get("invertColors") as? Boolean ?: false
    }

    /**
     * Processes the frame and returns the recognized text.
     *
     * @param frame The frame to process.
     * @param arguments The arguments for the frame processor.
     * @return A HashMap of recognized text.
     */
    override fun callback(frame: Frame, arguments: Map<String, Any>?): HashMap<String, Any> {
        try {
            val inputImage = if (this.invertColors) {
                createInvertedInputImageFromFrame(frame)
            } else {
                createInputImageFromFrame(frame)
            }
            val task: Task<Text> = this.textRecognizer.process(inputImage)

            val text: Text? = Tasks.await(task)
            val map = WritableNativeMap()

            map.putString("text", text?.text)
            map.putArray("blocks", createBlocksArray(text?.textBlocks ?: emptyList()))

            return map.toHashMap()
        } catch (e: FrameInvalidError) {
            Log.e(TAG, "FrameInvalidError occurred while processing the frame", e)
        } catch (e: MlKitException) {
            Log.e(TAG, "MlKitException occurred while processing the image with ML Kit", e)
        } catch (@Suppress("TooGenericExceptionCaught") e: Exception) {
            Log.e(TAG, "Unexpected error occurred while recognizing the text", e)
        }

        return hashMapOf()
    }

    /**
     * Creates a WritableNativeArray from a list of symbols.
     *
     * @param symbols The list of symbols.
     * @return A WritableNativeArray of symbols.
     */
    private fun createSymbolsArray(symbols: List<Text.Symbol>): WritableNativeArray {
        return WritableNativeArray().apply {
            symbols.map { symbol ->
                WritableNativeMap().apply {
                    symbol.boundingBox?.let { bounds ->
                        putMap("bounds", createBoundsMap(bounds))
                    }

                    symbol.cornerPoints?.let { corners ->
                        putArray("corners", createCornersArray(corners))
                    }

                    putDouble("confidence", symbol.confidence.toDouble())
                    putDouble("angle", symbol.angle.toDouble())

                    putString("text", symbol.text)
                    putArray("languages", WritableNativeArray().apply { pushString(symbol.recognizedLanguage) })
                }
            }.forEach { pushMap(it) }
        }
    }

    /**
     * Creates a WritableNativeArray from a list of elements.
     *
     * @param elements The list of elements.
     * @return A WritableNativeArray of elements.
     */
    private fun createElementsArray(elements: List<Text.Element>): WritableNativeArray {
        return WritableNativeArray().apply {
            elements.map { element ->
                WritableNativeMap().apply {
                    element.boundingBox?.let { bounds ->
                        putMap("bounds", createBoundsMap(bounds))
                    }

                    element.cornerPoints?.let { corners ->
                        putArray("corners", createCornersArray(corners))
                    }

                    putArray("symbols", createSymbolsArray(element.symbols))

                    putDouble("confidence", element.confidence.toDouble())
                    putDouble("angle", element.angle.toDouble())

                    putString("text", element.text)
                    putArray("languages", WritableNativeArray().apply { pushString(element.recognizedLanguage) })
                }
            }.forEach { pushMap(it) }
        }
    }

    /**
     * Creates a WritableNativeArray from a list of lines.
     *
     * @param lines The list of lines.
     * @return A WritableNativeArray of lines.
     */
    private fun createLinesArray(lines: List<Text.Line>): WritableNativeArray {
        return WritableNativeArray().apply {
            lines.map { line ->
                WritableNativeMap().apply {
                    line.boundingBox?.let { bounds ->
                        putMap("bounds", createBoundsMap(bounds))
                    }

                    line.cornerPoints?.let { corners ->
                        putArray("corners", createCornersArray(corners))
                    }

                    putArray("elements", createElementsArray(line.elements))

                    putDouble("confidence", line.confidence.toDouble())
                    putDouble("angle", line.angle.toDouble())

                    putString("text", line.text)
                    putArray("languages", WritableNativeArray().apply { pushString(line.recognizedLanguage) })
                }
            }.forEach { pushMap(it) }
        }
    }

    /**
     * Creates a WritableNativeArray from a list of text blocks.
     *
     * @param blocks The list of text blocks.
     * @return A WritableNativeArray of text blocks.
     */
    private fun createBlocksArray(blocks: List<Text.TextBlock>): WritableNativeArray {
        return WritableNativeArray().apply {
            blocks.map { block ->
                WritableNativeMap().apply {
                    block.boundingBox?.let { bounds ->
                        putMap("bounds", createBoundsMap(bounds))
                    }

                    block.cornerPoints?.let { corners ->
                        putArray("corners", createCornersArray(corners))
                    }

                    putArray("lines", createLinesArray(block.lines))

                    putString("text", block.text)
                    putArray("languages", WritableNativeArray().apply { pushString(block.recognizedLanguage) })
                }
            }.forEach { pushMap(it) }
        }
    }
}
