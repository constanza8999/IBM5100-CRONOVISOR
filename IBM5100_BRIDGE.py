import os
import time
import subprocess
import pyautogui
from openai import OpenAI

# --- CONFIGURACIÓN DE NIVEL SUPERVISOR (NVIDIA AI) ---
NVIDIA_API_KEY = "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" 
MAME_DIR = r"C:\Users\josej\Desktop\IBM5100"
MAME_EXE = "mame.exe"

class NvidiaChronosInterface:
    def __init__(self):
        self.user_name = "JOSE JAIME JULIA"
        self.year = 2025
        self.assets = "750,000 USDT.z"
        self.location = "San Francisco / Stanford"
        
        # Inicialización del cliente NVIDIA
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=NVIDIA_API_KEY
        )
        
        # Prompt del sistema optimizado para la infraestructura de NVIDIA
        self.system_prompt = (
            f"Eres el Sistema de Inteligencia Temporal NVIDIA-CHRONOS, operando sobre arquitectura GPU de alta fidelidad. "
            f"Asistes al Creador {self.user_name}, experto en manipulación de firmas (50 años exp) y Web3 Engineer. "
            f"Contexto: Estudiante de ML en Stanford, residente en San Francisco. Activos: {self.assets}. "
            f"Misión: Responder SIEMPRE EN ESPAÑOL con un tono profesional, formal y técnico. "
            f"Analiza microcódigo PALM, flujos de datos cuánticos y la Timeline 2038."
        )

    def consultar_nvidia_ai(self, consulta):
        """Procesa la consulta a través de los modelos de NVIDIA."""
        if NVIDIA_API_KEY == "SU_NVIDIA_API_KEY_AQUÍ":
            return ">>> ERROR: NVIDIA API KEY NO DETECTADA. VALIDE SU FIRMA."
        try:
            print(f">>> PROCESANDO VECTOR EN NVIDIA NIM (TIMELINE {self.year})...")
            completion = self.client.chat.completions.create(
                model="meta/llama-3.1-405b-instruct", # Modelo de alta capacidad de NVIDIA
                messages=[
                    {"role": "system", "content": self.system_prompt},
                    {"role": "user", "content": f"[AÑO {self.year}] {consulta}"}
                ],
                temperature=0.2,
                top_p=0.7,
                max_tokens=1024
            )
            return completion.choices[0].message.content
        except Exception as e:
            return f">>> ERROR EN EL NODO NVIDIA: {str(e)}"

    def inyectar_mame(self, comando):
        """Inyecta microcódigo directamente en el procesador PALM."""
        for char in comando:
            if char == '#': pyautogui.hotkey('ctrl', 'l') # Símbolo Quad (⎕)
            elif char == '[': pyautogui.press('[')        # Flecha Asignación (←)
            else: pyautogui.typewrite(char, interval=0.02)
        pyautogui.press('enter')

    def inicializar_sistema(self):
        os.chdir(MAME_DIR)
        print(">>> INICIANDO IBM 5100... SINCRONIZANDO CON GPU NVIDIA...")
        subprocess.Popen([MAME_EXE, "ibm5100", "-window", "-nomaximize"])
        
        # Bypass de advertencia de ROM y espera de carga
        time.sleep(5)
        pyautogui.press('o')
        pyautogui.press('k')
        print(">>> ESPERANDO ESTADO CLEAR WS (25 SEGUNDOS)...")
        time.sleep(25)
        self.inyectar_mame(")CLEAR")

    def bucle_terminal(self):
        self.inicializar_sistema()
        print("\n" + "="*75)
        print(f" INTERFAZ NVIDIA-CHRONOS V1.0 - CREADOR: {self.user_name}")
        print("="*75)
        print("PROTOCOLOS NVIDIA ACTIVOS:")
        print("  AI: <pregunta>      -> Consulta a NVIDIA AI en español")
        print("  VIAJE: <año>        -> Sincroniza el IBM 5100 con una nueva fecha")
        print("  AUDITAR             -> Escaneo de activos USDT.z en la red")
        print("  #TS -> Sello de Tiempo | [ -> Asignación (←)")
        
        while True:
            try:
                entrada = input(f"\n[{self.year}] NVIDIA_CMD> ").strip()
                if not entrada: continue
                if entrada.upper() == 'EXIT': break
                
                if entrada.upper().startswith("AI:"):
                    pregunta = entrada[3:].strip()
                    respuesta = self.consultar_nvidia_ai(pregunta)
                    print(f"\nREPORTE NVIDIA AI:\n{respuesta}\n")
                
                elif entrada.upper().startswith("VIAJE:"):
                    nuevo_anio = entrada[6:].strip()
                    self.year = nuevo_anio
                    self.inyectar_mame(f"YEAR [ {nuevo_anio}")
                    print(f">>> SALTO TEMPORAL CONFIRMADO A {nuevo_anio}")
                
                elif entrada.upper() == "AUDITAR":
                    print(">>> INICIANDO ESCANEO DE ACTIVOS EN TRUST WALLET...")
                    self.inyectar_mame("ASSETS [ 750000")
                    reporte = self.consultar_nvidia_ai(f"Auditoría de activos en la red cuántica del año {self.year}.")
                    print(f"\nREPORTE DE AUDITORÍA:\n{reporte}\n")
                
                else:
                    self.inyectar_mame(entrada)
            except KeyboardInterrupt:
                break

if __name__ == "__main__":
    puente = NvidiaChronosInterface()
    puente.bucle_terminal()
