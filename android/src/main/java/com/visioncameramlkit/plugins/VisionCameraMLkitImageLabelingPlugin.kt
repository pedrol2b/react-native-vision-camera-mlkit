package com.visioncameramlkit.plugins

import android.util.Log
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.Tasks
import com.google.mlkit.common.MlKitException
import com.google.mlkit.vision.label.ImageLabel
import com.google.mlkit.vision.label.ImageLabeler
import com.google.mlkit.vision.label.ImageLabeling
import com.google.mlkit.vision.label.defaults.ImageLabelerOptions
import com.mrousavy.camera.core.FrameInvalidError
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createInputImageFromFrame
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createInvertedInputImageFromFrame
import java.util.ArrayList

private const val TAG = "VisionCameraMLkitImageLabelingPlugin"

/**
 * A plugin for labeling images using ML Kit.
 *
 * @property proxy The VisionCameraProxy instance.
 * @property options The options for the image labeler.
 */
@Suppress("KDocUnresolvedReference", "MagicNumber")
class VisionCameraMLkitImageLabelingPlugin(
    @Suppress(
        "UNUSED_PARAMETER"
    ) proxy: VisionCameraProxy,
    options: Map<String, Any>?
) : FrameProcessorPlugin() {
    private var imageLabeler: ImageLabeler
    private var invertColors: Boolean = false

    init {
        var confidenceThreshold = options?.get("confidenceThreshold") as? Int
        confidenceThreshold = when {
            confidenceThreshold == null || confidenceThreshold !in 0..100 -> 50
            else -> confidenceThreshold
        }
        val confidenceThresholdFloat = confidenceThreshold.toFloat() / 100

        val imageLabelerOptionsBuilder = ImageLabelerOptions.Builder()
            .setConfidenceThreshold(confidenceThresholdFloat)
            .build()

        this.imageLabeler = ImageLabeling.getClient(imageLabelerOptionsBuilder)
        this.invertColors = options?.get("invertColors") as? Boolean ?: false
    }

    /**
     * Processes the frame and returns the labels found.
     *
     * @param frame The frame to process.
     * @param arguments The arguments for the frame processor.
     * @returns An ArrayList of labels found.
     */
    override fun callback(frame: Frame, arguments: Map<String, Any>?): ArrayList<Any> {
        try {
            val inputImage = if (this.invertColors) {
                createInvertedInputImageFromFrame(frame)
            } else {
                createInputImageFromFrame(frame)
            }
            val task: Task<List<ImageLabel>> = this.imageLabeler.process(inputImage)

            val labels: List<ImageLabel> = Tasks.await(task)
            val array = createLabelsArray(labels)

            return array.toArrayList()
        } catch (e: FrameInvalidError) {
            Log.e(TAG, "FrameInvalidError occurred while processing the frame", e)
        } catch (e: MlKitException) {
            Log.e(TAG, "MlKitException occurred while processing the image with ML Kit", e)
        } catch (@Suppress("TooGenericExceptionCaught") e: Exception) {
            Log.e(TAG, "Unexpected error occurred while labeling the image", e)
        }

        return arrayListOf()
    }

    /**
     * Creates a WritableNativeArray from a list of labels.
     *
     * @param labels The list of labels.
     * @return A WritableNativeArray of labels.
     */
    private fun createLabelsArray(labels: List<ImageLabel>): WritableNativeArray {
        return WritableNativeArray().apply {
            labels.map { label ->
                WritableNativeMap().apply {
                    putString("text", label.text)
                    putDouble("confidence", label.confidence.toDouble())
                    putInt("index", label.index)
                }
            }.forEach { pushMap(it) }
        }
    }
}
