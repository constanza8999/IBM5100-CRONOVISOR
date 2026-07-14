import os
import time
import subprocess
import pyautogui
import requests
from openai import OpenAI
from pathlib import Path
from datetime import datetime

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
        
        # Directorio para guardar visualizaciones temporales
        self.visualizations_dir = Path(MAME_DIR) / "visualizations"
        self.visualizations_dir.mkdir(exist_ok=True)
        
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

    def generar_imagen_temporal(self, prompt, year=None):
        """Genera una imagen visualizando un momento en el tiempo."""
        if year is None:
            year = self.year
        
        full_prompt = (
            f"Historical visualization of {year}: {prompt}. "
            f"Photorealistic, cinematic lighting, detailed, 8k quality, "
            f"vintage film grain, period-accurate details"
        )
        
        print(f">>> GENERANDO VISUALIZACIÓN TEMPORAL DEL AÑO {year}...")
        
        try:
            response = self.client.images.generate(
                model="stabilityai/stable-diffusion-3-5-large",
                prompt=full_prompt,
                size="1024x1024",
                n=1,
                response_format="url"
            )
            
            image_url = response.data[0].url
            
            # Descargar y guardar la imagen
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"timeline_{year}_{timestamp}.png"
            filepath = self.visualizations_dir / filename
            
            img_response = requests.get(image_url)
            with open(filepath, "wb") as f:
                f.write(img_response.content)
            
            print(f">>> IMAGEN GENERADA: {filepath}")
            print(f">>> URL TEMPORAL: {image_url}")
            
            # Abrir automáticamente la imagen
            self.abrir_archivo(filepath)
            
            return str(filepath)
        except Exception as e:
            return f">>> ERROR EN GENERACIÓN VISUAL: {str(e)}"
    
    def abrir_archivo(self, filepath):
        """Abre un archivo de forma cross-platform."""
        import platform
        try:
            if platform.system() == 'Windows':
                os.startfile(str(filepath))
            elif platform.system() == 'Darwin':  # macOS
                subprocess.Popen(['open', str(filepath)])
            else:  # Linux
                subprocess.Popen(['xdg-open', str(filepath)])
        except Exception as e:
            print(f">>> No se pudo abrir automáticamente: {e}")
    
    def generar_video_temporal(self, prompt, year=None):
        """Genera un video visualizando un momento en el tiempo."""
        if year is None:
            year = self.year
        
        full_prompt = (
            f"Cinematic visualization of {year}: {prompt}. "
            f"Smooth camera movement, atmospheric, detailed environment, "
            f"vintage film aesthetic, period-accurate details"
        )
        
        print(f">>> GENERANDO VIDEO TEMPORAL DEL AÑO {year}...")
        print(f">>> ESTO PUEDE TARDAR 1-2 MINUTOS...")
        
        try:
            # Usar NVIDIA NIM API para video via requests directamente
            headers = {
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Content-Type": "application/json"
            }
            
            payload = {
                "model": "nvidia/cosmos-transfer1",
                "prompt": full_prompt,
                "num_frames": 120,
                "fps": 24
            }
            
            response = requests.post(
                "https://integrate.api.nvidia.com/v1/video/generations",
                headers=headers,
                json=payload,
                timeout=120
            )
            response.raise_for_status()
            
            result = response.json()
            video_url = result.get("data", [{}])[0].get("url")
            
            if not video_url:
                return ">>> ERROR: No se obtuvo URL del video"
            
            # Descargar y guardar el video
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"timeline_{year}_{timestamp}.mp4"
            filepath = self.visualizations_dir / filename
            
            vid_response = requests.get(video_url, stream=True, timeout=60)
            vid_response.raise_for_status()
            
            with open(filepath, "wb") as f:
                for chunk in vid_response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f">>> VIDEO GENERADO: {filepath}")
            print(f">>> URL TEMPORAL: {video_url}")
            
            # Abrir automáticamente el video
            self.abrir_archivo(filepath)
            
            return str(filepath)
        except requests.exceptions.RequestException as e:
            return f">>> ERROR DE CONEXIÓN EN VIDEO: {str(e)}"
        except Exception as e:
            return f">>> ERROR EN GENERACIÓN DE VIDEO: {str(e)}"
    
    def viajar_y_visualizar(self, year, tema=None):
        """Viaja a un año y genera una visualización de ese momento."""
        self.year = year
        self.inyectar_mame(f"YEAR [ {year}")
        print(f">>> SALTO TEMPORAL CONFIRMADO A {year}")
        
        if tema is None:
            tema = f"IBM 5100 computer in use, retro technology, vintage office"
        
        # Generar imagen del momento
        resultado_img = self.generar_imagen_temporal(tema, year)
        print(f">>> VISUALIZACIÓN TEMPORAL COMPLETADA")
        
        return resultado_img
    
    def explorar_timeline(self, year_inicio, year_fin, tema=None):
        """Explora un rango de tiempo generando visualizaciones."""
        print(f">>> EXPLORANDO TIMELINE: {year_inicio} -> {year_fin}")
        
        resultados = []
        for year in range(int(year_inicio), int(year_fin) + 1, 5):  # Cada 5 años
            print(f"\n--- AÑO {year} ---")
            resultado = self.viajar_y_visualizar(year, tema)
            resultados.append((year, resultado))
            time.sleep(1)  # Pausa entre generaciones
        
        print(f">>> EXPLORACIÓN TEMPORAL COMPLETADA: {len(resultados)} visualizaciones")
        return resultados
    
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
        print("  VISUAL: <año> <tema> -> Genera imagen del momento en el tiempo")
        print("  VIDEO: <año> <tema>  -> Genera video del momento en el tiempo")
        print("  EXPLORAR: <ini> <fin> -> Explora timeline con visualizaciones")
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
                
                elif entrada.upper().startswith("VISUAL:"):
                    partes = entrada[7:].strip().split(" ", 1)
                    try:
                        anio = int(partes[0])
                    except ValueError:
                        print(">>> ERROR: El año debe ser un número")
                        continue
                    tema = partes[1] if len(partes) > 1 else None
                    resultado = self.viajar_y_visualizar(anio, tema)
                    print(f"\n{resultado}\n")
                
                elif entrada.upper().startswith("VIDEO:"):
                    partes = entrada[6:].strip().split(" ", 1)
                    try:
                        anio = int(partes[0])
                    except ValueError:
                        print(">>> ERROR: El año debe ser un número")
                        continue
                    tema = partes[1] if len(partes) > 1 else None
                    resultado = self.generar_video_temporal(tema, anio)
                    print(f"\n{resultado}\n")
                
                elif entrada.upper().startswith("EXPLORAR:"):
                    partes = entrada[9:].strip().split(" ")
                    if len(partes) >= 2:
                        try:
                            anio_inicio = int(partes[0])
                            anio_fin = int(partes[1])
                        except ValueError:
                            print(">>> ERROR: Los años deben ser números")
                            continue
                        if anio_inicio > anio_fin:
                            anio_inicio, anio_fin = anio_fin, anio_inicio
                        resultados = self.explorar_timeline(anio_inicio, anio_fin)
                    else:
                        print(">>> USO: EXPLORAR: <año_inicio> <año_fin>")
                
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
