package com.loloof64.reactnativechessoexscannerandroid

import com.facebook.react.bridge.*

fun List<String>.convertToJsArray() : WritableNativeArray {
  val result = WritableNativeArray()
  for (elem in this) {
    result.pushString(elem)
  }
  return result
}

class ChessOexScannerAndroidModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ChessOexScannerAndroid"
    }

    var engineUtils: ChessEngineUtils? = null

  @ReactMethod
  fun setupEngineUtils(appId: String, promise: Promise) {
    try {
      engineUtils = ChessEngineUtils(reactContext, appId)
      promise.resolve(true)
    }
    catch (err: Exception) {
      promise.reject(err)
    }
  }

  @ReactMethod
  fun getMyStoreEnginesNames(promise: Promise) {
    val results = engineUtils?.getMyStoreEnginesNames() ?: listOf()
    promise.resolve(results.convertToJsArray())
  }

  @ReactMethod
  fun installEngineFromMyStore(index: Int, promise: Promise) {
    engineUtils?.installEngineFromMyStore(index)
    promise.resolve(true)
  }

  @ReactMethod
  fun newVersionAvailableFromMyStoreFor(index: Int, promise: Promise) {
    promise.resolve(engineUtils?.newVersionAvailableFromMyStoreFor(index))
  }

  @ReactMethod
  fun listInstalledEngines(promise: Promise) {
    val results = engineUtils?.listInstalledEngines() ?: listOf()
    promise.resolve(results.convertToJsArray())
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

    engineUtils?.executeInstalledEngine(index, errorHandleCallback)
    promise.resolve(true)
  }

  @ReactMethod
  fun sendCommandToRunningEngine(command: String, promise: Promise) {
    ///////////////////////////
    println("Command is $command")
    ///////////////////////////
    engineUtils?.sendCommandToRunningEngine(command)
    promise.resolve(true)
  }

  @ReactMethod
  fun readCurrentEnginePendingOutputs(promise: Promise) {
    val outputs = engineUtils?.readCurrentEnginePendingOutputs() ?: listOf()
    promise.resolve(outputs.convertToJsArray())
  }

  @ReactMethod
  fun stopCurrentRunningEngine(promise: Promise) {
    try {
      engineUtils?.stopCurrentRunningEngine()
      promise.resolve(true)
    }
    catch (err: Exception) {
      promise.reject(err)
    }
  }
}
