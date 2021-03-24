package com.loloof64.reactnativechessoexscannerandroid

import kotlinx.coroutines.*
import java.io.*
import java.util.*

sealed class Error
object EngineNotStarted : Error()
data class CannotStartEngine(val msg: String) : Error()
data class CannotCommunicateWithEngine(val msg: String) : Error()
data class MiscError(val msg: String) : Error()

class ChessEngineRunner(
  private val engineFile: File,
  val errorCallback: (Error) -> Unit
) {

  private var mainJob: Job? = null
  private var process: Process? = null
  private var outputQueue = LinkedList<String>()
  private var processBufferedReader: BufferedReader? = null
  private var processOutputStream: OutputStream? = null

  fun run() = runBlocking {
    outputQueue.clear()

    // running engine coroutine
    mainJob = GlobalScope.launch {
      try {
        getProcess()
        if (process == null) {
          errorCallback(CannotCommunicateWithEngine(""))
          return@launch
        }

        val inputStream = process!!.inputStream
        val inputSteamReader = InputStreamReader(inputStream)
        processBufferedReader = BufferedReader(inputSteamReader, 8192)
        processOutputStream = process!!.outputStream

        try {
          GlobalScope.launch {
            runCatching {
              var line: String? = ""
              while (isActive) {
                while (line != null) {
                  line = processBufferedReader?.readLine()
                  outputQueue.add(line!!)
                }
              }
            }
          }
        } catch (ignore: IOException) {
        } catch (ex: Exception) {
          errorCallback(MiscError(ex.message ?: ""))
        }
      } catch (ex: Exception) {
        when (ex) {
          is SecurityException -> errorCallback(CannotStartEngine(ex.message ?: ""))
          is IOException -> errorCallback(CannotCommunicateWithEngine(ex.message ?: ""))
          else -> errorCallback(MiscError(ex.message ?: ""))
        }

      }
    }
  }

  private fun getProcess() {
    val engineAbsolutePath = engineFile.absolutePath
    process = ProcessBuilder(engineAbsolutePath).start()
  }

  fun sendCommand(command: String) {
    val carriageReturnTerminatedCmd = "$command\n"
    try {
      if (process != null) {
        processOutputStream?.write(carriageReturnTerminatedCmd.toByteArray())
        processOutputStream?.flush()
      }
    } catch (ignore: IOException) {
    }
  }

  fun readPendingOutputs(): List<String> {
    val results = mutableListOf<String>()
    while (true) {
      val next = outputQueue.poll() ?: break
      if (next.isEmpty()) break
      results.add(next)
    }
    return results
  }

  fun stop() {
    mainJob?.cancel()
    processBufferedReader?.close()
    processOutputStream?.close()
  }
}
