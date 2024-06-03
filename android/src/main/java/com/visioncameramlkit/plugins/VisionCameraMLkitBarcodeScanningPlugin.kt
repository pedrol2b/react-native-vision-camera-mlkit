package com.visioncameramlkit.plugins

import android.util.Log
import com.facebook.react.bridge.WritableNativeArray
import com.facebook.react.bridge.WritableNativeMap
import com.google.android.gms.tasks.Task
import com.google.android.gms.tasks.Tasks
import com.google.mlkit.common.MlKitException
import com.google.mlkit.vision.barcode.BarcodeScanner
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.mrousavy.camera.core.FrameInvalidError
import com.mrousavy.camera.frameprocessors.Frame
import com.mrousavy.camera.frameprocessors.FrameProcessorPlugin
import com.mrousavy.camera.frameprocessors.VisionCameraProxy
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createBoundsMap
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createCornersArray
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createInputImageFromFrame
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.createInvertedInputImageFromFrame
import com.visioncameramlkit.utils.VisionCameraMLkitUtils.getReversedMap
import java.util.ArrayList

private const val TAG = "VisionCameraMLkitBarcodeScanningPlugin"

/**
 * A plugin for scanning barcodes using ML Kit.
 *
 * @property proxy The VisionCameraProxy instance.
 * @property options The options for the barcode scanner.
 */
@Suppress("KDocUnresolvedReference")
class VisionCameraMLkitBarcodeScanningPlugin(
    @Suppress(
        "UNUSED_PARAMETER"
    ) proxy: VisionCameraProxy,
    options: Map<String, Any>?
) : FrameProcessorPlugin() {
    private var barcodeScanner: BarcodeScanner
    private var invertColors: Boolean = false

    init {
        val formats = options?.get("formats") as? List<*> ?: listOf("ALL")
        val enableAllPotentialBarcodes = options?.get("enableAllPotentialBarcodes") as? Boolean ?: false

        val barcodeFormats = formats.fold(0) { acc, format ->
            acc or (barcodeFormatsMap[format] ?: 0)
        }

        val barcodeScannerOptionsBuilder = BarcodeScannerOptions.Builder()
            .setBarcodeFormats(barcodeFormats)

        if (enableAllPotentialBarcodes) {
            barcodeScannerOptionsBuilder.enableAllPotentialBarcodes()
        }

        this.barcodeScanner = BarcodeScanning.getClient(barcodeScannerOptionsBuilder.build())
        this.invertColors = options?.get("invertColors") as? Boolean ?: false
    }

    /**
     * Processes the frame and returns the barcodes found.
     *
     * @param frame The frame to process.
     * @param arguments The arguments for the frame processor.
     * @return An ArrayList of barcodes found.
     */
    override fun callback(frame: Frame, arguments: Map<String, Any>?): ArrayList<Any> {
        try {
            val inputImage = if (this.invertColors) {
                createInvertedInputImageFromFrame(frame)
            } else {
                createInputImageFromFrame(frame)
            }
            val task: Task<List<Barcode>> = this.barcodeScanner.process(inputImage)

            val barcodes: List<Barcode> = Tasks.await(task)
            val array = createBarcodesArray(barcodes)

            return array.toArrayList()
        } catch (e: FrameInvalidError) {
            Log.e(TAG, "FrameInvalidError occurred while processing the frame", e)
        } catch (e: MlKitException) {
            Log.e(TAG, "MlKitException occurred while processing the image with ML Kit", e)
        } catch (@Suppress("TooGenericExceptionCaught") e: Exception) {
            Log.e(TAG, "Unexpected error occurred while scanning the barcode", e)
        }

        return arrayListOf()
    }

    /**
     * Creates a WritableNativeArray from a list of barcodes.
     *
     * @param barcodes The list of barcodes.
     * @return A WritableNativeArray of barcodes.
     */
    private fun createBarcodesArray(barcodes: List<Barcode>): WritableNativeArray {
        return WritableNativeArray().apply {
            barcodes.map { barcode ->
                WritableNativeMap().apply {
                    barcode.boundingBox?.let { bounds ->
                        putMap("bounds", createBoundsMap(bounds))
                    }

                    barcode.cornerPoints?.let { corners ->
                        putArray("corners", createCornersArray(corners))
                    }

                    putString("rawValue", barcode.rawValue)
                    putString("displayValue", barcode.displayValue)
                    putString("format", barcodeFormatsMap.getReversedMap()[barcode.format] ?: "UNKNOWN")
                    putString("valueType", barcodeTypesMap.getReversedMap()[barcode.valueType] ?: "UNKNOWN")
                }
            }.forEach { pushMap(it) }
        }
    }

    companion object {
        private val barcodeFormatsMap = mapOf(
            "UNKNOWN" to Barcode.FORMAT_UNKNOWN,
            "ALL" to Barcode.FORMAT_ALL_FORMATS,
            "CODE_128" to Barcode.FORMAT_CODE_128,
            "CODE_39" to Barcode.FORMAT_CODE_39,
            "CODE_93" to Barcode.FORMAT_CODE_93,
            "CODABAR" to Barcode.FORMAT_CODABAR,
            "DATA_MATRIX" to Barcode.FORMAT_DATA_MATRIX,
            "EAN_13" to Barcode.FORMAT_EAN_13,
            "EAN_8" to Barcode.FORMAT_EAN_8,
            "ITF" to Barcode.FORMAT_ITF,
            "QR_CODE" to Barcode.FORMAT_QR_CODE,
            "UPC_A" to Barcode.FORMAT_UPC_A,
            "UPC_E" to Barcode.FORMAT_UPC_E,
            "PDF417" to Barcode.FORMAT_PDF417,
            "AZTEC" to Barcode.FORMAT_AZTEC
        )

        private val barcodeTypesMap = mapOf(
            "UNKNOWN" to Barcode.TYPE_UNKNOWN,
            "CONTACT_INFO" to Barcode.TYPE_CONTACT_INFO,
            "EMAIL" to Barcode.TYPE_EMAIL,
            "ISBN" to Barcode.TYPE_ISBN,
            "PHONE" to Barcode.TYPE_PHONE,
            "PRODUCT" to Barcode.TYPE_PRODUCT,
            "SMS" to Barcode.TYPE_SMS,
            "TEXT" to Barcode.TYPE_TEXT,
            "URL" to Barcode.TYPE_URL,
            "WIFI" to Barcode.TYPE_WIFI,
            "GEO" to Barcode.TYPE_GEO,
            "CALENDAR_EVENT" to Barcode.TYPE_CALENDAR_EVENT,
            "DRIVER_LICENSE" to Barcode.TYPE_DRIVER_LICENSE,
        )
    }
}
