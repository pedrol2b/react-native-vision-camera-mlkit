package com.visioncameramlkit.plugins

import android.util.Log
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.Tasks
import com.google.mlkit.common.MlKitException
import com.google.mlkit.vision.objects.DetectedObject
import com.google.mlkit.vision.objects.ObjectDetection
import com.google.mlkit.vision.objects.ObjectDetector
import com.google.mlkit.vision.objects.defaults.ObjectDetectorOptions
import com.mrousavy.camera.core.FrameInvalidError
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createBoundsMap
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createInputImageFromFrame
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createInvertedInputImageFromFrame
import java.util.ArrayList

private const val TAG = "VisionCameraMLkitObjectDetectionPlugin"

/**
 * A plugin for detecting objects in images using ML Kit.
 *
 * @property proxy The VisionCameraProxy instance.
 * @property options The options for the object detector.
 */
@Suppress("KDocUnresolvedReference")
class VisionCameraMLkitObjectDetectionPlugin(
    @Suppress(
        "UNUSED_PARAMETER"
    ) proxy: VisionCameraProxy,
    options: Map<String, Any>?
) : FrameProcessorPlugin() {
    private var objectDetector: ObjectDetector
    private var invertColors: Boolean = false

    init {
        val enableMultipleObjects = options?.get("enableMultipleObjects") as? Boolean ?: false
        val enableClassification = options?.get("enableClassification") as? Boolean ?: false

        val objectDetectorOptionsBuilder = ObjectDetectorOptions.Builder()

        // Live detection and tracking
        objectDetectorOptionsBuilder.setDetectorMode(ObjectDetectorOptions.STREAM_MODE)

        if (enableMultipleObjects) {
            objectDetectorOptionsBuilder.enableMultipleObjects()
        }

        if (enableClassification) {
            objectDetectorOptionsBuilder.enableClassification()
        }

        this.objectDetector = ObjectDetection.getClient(objectDetectorOptionsBuilder.build())
        this.invertColors = options?.get("invertColors") as? Boolean ?: false
    }

    /**
     * Process the frame and return the detected objects.
     *
     * @param frame The frame to process.
     * @param arguments The arguments for the frame processor.
     * @returns An ArrayList of detected objects.
     */
    override fun callback(frame: Frame, arguments: Map<String, Any>?): ArrayList<Any> {
        try {
            val inputImage = if (this.invertColors) {
                createInvertedInputImageFromFrame(frame)
            } else {
                createInputImageFromFrame(frame)
            }
            val task: Task<List<DetectedObject>> = this.objectDetector.process(inputImage)

            val detectedObjects: List<DetectedObject> = Tasks.await(task)
            val array = createDetectedObjectsArray(detectedObjects)

            return array.toArrayList()
        } catch (e: FrameInvalidError) {
            Log.e(TAG, "FrameInvalidError occurred while processing the frame", e)
        } catch (e: MlKitException) {
            Log.e(TAG, "MlKitException occurred while processing the image with ML Kit", e)
        } catch (@Suppress("TooGenericExceptionCaught") e: Exception) {
            Log.e(TAG, "Unexpected error occurred while detecting objects", e)
        }

        return arrayListOf()
    }

    /**
     * Creates a WritableNativeArray from a list of labels.
     *
     * @param labels The list of labels.
     * @return A WritableNativeArray of labels.
     */
    private fun createLabelsArray(labels: List<DetectedObject.Label>): WritableNativeArray {
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

    /**
     * Creates a WritableNativeArray from a list of detected objects.
     *
     * @param detectedObjects The list of detected objects.
     * @return A WritableNativeArray of detected objects.
     */
    private fun createDetectedObjectsArray(detectedObjects: List<DetectedObject>): WritableNativeArray {
        return WritableNativeArray().apply {
            detectedObjects.map { detectedObject ->
                WritableNativeMap().apply {
                    detectedObject.trackingId?.let { trackingId ->
                        putInt("trackingId", trackingId)
                    }

                    putMap("bounds", createBoundsMap(detectedObject.boundingBox))
                    putArray("labels", createLabelsArray(detectedObject.labels))
                }
            }.forEach { pushMap(it) }
        }
    }
}
