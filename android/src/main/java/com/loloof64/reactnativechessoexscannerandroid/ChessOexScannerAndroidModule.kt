package com.loloof64.reactnativechessoexscannerandroid

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class ChessOexScannerAndroidModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ChessOexScannerAndroid"
    }

    var engineUtils: ChessEngineUtils? = null

  @ReactMethod
  fun setupEngineUtils(appId: String) {
    engineUtils = ChessEngineUtils(reactContext, appId)
  }

  @ReactMethod
  fun getMyStoreEnginesNames(promise: Promise) {
    promise.resolve(engineUtils?.getMyStoreEnginesNames() ?: arrayOf<String>())
  }

  @ReactMethod
  fun installEngineFromMyStore(index: Int, promise: Promise) {
    promise.resolve(engineUtils?.installEngineFromMyStore(index))
  }

  @ReactMethod
  fun newVersionAvailableFromMyStoreFor(index: Int, promise: Promise) {
    promise.resolve(engineUtils?.newVersionAvailableFromMyStoreFor(index))
  }

  @ReactMethod
  fun listInstalledEngines(promise: Promise) {
    promise.resolve(engineUtils?.listInstalledEngines())
  }

  @ReactMethod
  fun executeInstalledEngine(index: Int, promise: Promise) {
    val errorHandleCallback = {err: Error ->
      when (err) {
        is EngineNotStarted -> promise.reject("EngineNotStarted", "")
        is CannotStartEngine -> promise.reject("CannotStartEngine", err.msg)
        is CannotCommunicateWithEngine -> promise.reject("CannotCommunicateWithEngine", err.msg)
        is MiscError -> promise.reject("MiscError", err.msg)
      }
    }

    promise.resolve(engineUtils?.executeInstalledEngine(index, errorHandleCallback))
  }

  @ReactMethod
  fun sendCommandToRunningEngine(command: String, promise: Promise) {
    promise.resolve(engineUtils?.sendCommandToRunningEngine(command))
  }

  @ReactMethod
  fun readCurrentEnginePendingOutputs(promise: Promise) {
    promise.resolve(engineUtils?.readCurrentEnginePendingOutputs())
  }

  @ReactMethod
  fun stopCurrentRunningEngine() {
    engineUtils?.stopCurrentRunningEngine()
  }
}
