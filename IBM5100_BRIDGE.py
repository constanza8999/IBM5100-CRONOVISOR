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
    # ── ERAS PREDEFINIDAS ────────────────────────────────────────
    ERAS = {
        "antiguo": {
            "name": "Antigüedad (3000 AC - 500 DC)",
            "desc": "Egipcios, Romanos, Griegos", 
            "prompt": "ancient civilization, pyramids, roman forum, greek temple, marble columns, torches, scrolls, ancient technology"
        },
        "medieval": {
            "name": "Medieval (500 - 1500)",
            "desc": "Castillos, caballeros, alquimia",
            "prompt": "medieval castle, knights in armor, alchemist laboratory, candlelight, stone walls, manuscripts, astrolabe"
        },
        "renacimiento": {
            "name": "Renacimiento (1400 - 1600)",
            "desc": "Arte, ciencia, descubrimientos",
            "prompt": "renaissance workshop, da vinci style, artistic studio, scientific instruments, globe, paintings, frescoes"
        },
        "victoriano": {
            "name": "Era Victoriana (1837 - 1901)",
            "desc": "Industria, vapor, inventos",
            "prompt": "victorian era, steam punk, industrial revolution, brass gears, telegraph, gas lamps, top hats, factories"
        },
        "1970": {
            "name": "Años 70 (1970 - 1979)",
            "desc": "Computación primitiva, disco, retro",
            "prompt": "1970s retro, primitive computers, punch cards, disco era, neon colors, vinyl records, early programming"
        },
        "1980": {
            "name": "Años 80 (1980 - 1989)",
            "desc": "PCs, arcade, synthwave",
            "prompt": "1980s aesthetic, personal computers, arcade machines, synthwave, cassette tapes, bitmap graphics, neon"
        },
        "1990": {
            "name": "Años 90 (1990 - 1999)",
            "desc": "Internet, web, multimedia",
            "prompt": "1990s era, early internet, dial-up modem, windows 95, cd-rom, grunge, web 1.0, pixel art"
        },
        "2000": {
            "name": "Años 2000 (2000 - 2009)",
            "desc": "Móviles, blogs, redes sociales",
            "prompt": "2000s era, flip phones, myspace, early smartphones, mp3 players, blogs, y2k aesthetic"
        },
        "2020": {
            "name": "Años 2020 (2020 - 2029)",
            "desc": "IA, crypto, metaverso",
            "prompt": "2020s modern, ai robots, cryptocurrency, virtual reality, smart home, autonomous vehicles, quantum computing"
        },
        "2030": {
            "name": "Futuro 2030 (2030 - 2039)",
            "desc": "Futuro cercano, nano-tecnología",
            "prompt": "futuristic 2030s, nano technology, brain computer interface, flying cars, space colonies, ai companions"
        },
        "2050": {
            "name": "Futuro 2050 (2050 - 2099)",
            "desc": "Ciencia ficción, espacio",
            "prompt": "futuristic 2050s, space exploration, cyberpunk, holographic displays, genetic engineering, fusion energy"
        },
        "3000": {
            "name": "Futuro Lejano (3000+)",
            "desc": "Civilización intergaláctica",
            "prompt": "far future 3000+, interstellar civilization, Dyson sphere, warp drive, alien contact, post-singularity"
        }
    }
    
    # ── PERSONAJES PREDEFINIDOS ──────────────────────────────────
    CHARACTERS = {
        "cientifico": {
            "name": "Científico",
            "prompt": "a brilliant scientist in white lab coat, holding advanced device, surrounded by holographic screens"
        },
        "hacker": {
            "name": "Hacker",
            "prompt": "a mysterious hacker in dark hoodie, multiple monitors with code, neon lighting, cyberpunk aesthetic"
        },
        "viajero": {
            "name": "Viajero del Tiempo",
            "prompt": "a time traveler with futuristic gadget, temporal distortion effect, glowing portal"
        },
        "inventor": {
            "name": "Inventor",
            "prompt": "a creative inventor in workshop, surrounded by prototypes, gears and mechanical devices"
        },
        "programador": {
            "name": "Programador",
            "prompt": "a skilled programmer at vintage terminal, lines of code, dark room with screen glow"
        },
        "explorador": {
            "name": "Explorador",
            "prompt": "an explorer with futuristic equipment, discovering unknown terrain, dramatic lighting"
        },
        "robot": {
            "name": "Robot/Android",
            "prompt": "a sophisticated android with human-like features, advanced robotics, glowing eyes"
        },
        "alienigena": {
            "name": "Extraterrestre",
            "prompt": "an alien being with advanced technology, otherworldly appearance, cosmic background"
        }
    }
    
    # ── ESTILOS VISUALES ─────────────────────────────────────────
    STYLES = {
        "realista": "photorealistic, 8k, detailed, professional photography",
        "cinematic": "cinematic lighting, movie scene, dramatic, film grain, anamorphic",
        "cyberpunk": "cyberpunk aesthetic, neon lights, rain, dark atmosphere, blade runner style",
        "retro": "retro vintage style, faded colors, film grain, nostalgic, analog",
        "fantasia": "fantasy art, magical, ethereal, dreamlike, painterly",
        "anime": "anime style, vibrant colors, detailed, studio ghibli inspired",
        "noir": "film noir, black and white, shadows, mystery, detective aesthetic",
        "steampunk": "steampunk aesthetic, brass, gears, steam, victorian industrial"
    }
    
    def __init__(self):
        self.user_name = "JOSE JAIME JULIA"
        self.year = 2025
        self.assets = "750,000 USDT.z"
        self.location = "San Francisco / Stanford"
        
        # Estado de personalización
        self.current_era = "2020"
        self.current_character = "cientifico"
        self.current_style = "realista"
        self.custom_prompt = ""
        
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

    def construir_prompt(self, custom=None):
        """Construye un prompt completo usando era, personaje y estilo actuales."""
        era_data = self.ERAS.get(self.current_era, self.ERAS["2020"])
        char_data = self.CHARACTERS.get(self.current_character, self.CHARACTERS["cientifico"])
        style = self.STYLES.get(self.current_style, self.STYLES["realista"])
        
        parts = [
            f"Era: {era_data['prompt']}",
            f"Character: {char_data['prompt']}",
        ]
        
        if custom:
            parts.append(f"Scene: {custom}")
        elif self.custom_prompt:
            parts.append(f"Scene: {self.custom_prompt}")
        
        parts.append(f"Style: {style}")
        
        return ", ".join(parts)
    
    def listar_eras(self):
        """Lista todas las eras disponibles."""
        print("\n=== ERAS DISPONIBLES ===")
        for key, era in self.ERAS.items():
            marker = " [ACTUAL]" if key == self.current_era else ""
            print(f"  {key:15} - {era['name']}{marker}")
            print(f"                  {era['desc']}")
        print()
    
    def listar_personajes(self):
        """Lista todos los personajes disponibles."""
        print("\n=== PERSONAJES DISPONIBLES ===")
        for key, char in self.CHARACTERS.items():
            marker = " [ACTUAL]" if key == self.current_character else ""
            print(f"  {key:15} - {char['name']}{marker}")
        print()
    
    def listar_estilos(self):
        """Lista todos los estilos visuales disponibles."""
        print("\n=== ESTILOS VISUALES ===")
        for key, desc in self.STYLES.items():
            marker = " [ACTUAL]" if key == self.current_style else ""
            print(f"  {key:15} - {desc[:50]}...{marker}")
        print()
    
    def generar_imagen_temporal(self, prompt=None, year=None, era=None, character=None, style=None):
        """Genera una imagen visualizando un momento en el tiempo con personalización completa."""
        if year is not None:
            self.year = year
        if era and era in self.ERAS:
            self.current_era = era
        if character and character in self.CHARACTERS:
            self.current_character = character
        if style and style in self.STYLES:
            self.current_style = style
        
        # Construir el prompt completo
        full_prompt = self.construir_prompt(prompt)
        
        print(f">>> GENERANDO VISUALIZACIÓN PERSONALIZADA...")
        print(f"    Era: {self.ERAS[self.current_era]['name']}")
        print(f"    Personaje: {self.CHARACTERS[self.current_character]['name']}")
        print(f"    Estilo: {self.current_style}")
        
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
            filename = f"{self.current_era}_{self.current_character}_{self.year}_{timestamp}.png"
            filepath = self.visualizations_dir / filename
            
            img_response = requests.get(image_url)
            img_response.raise_for_status()
            
            with open(filepath, "wb") as f:
                f.write(img_response.content)
            
            print(f">>> IMAGEN GENERADA: {filepath}")
            print(f">>> URL: {image_url}")
            
            # Abrir automáticamente la imagen
            self.abrir_archivo(filepath)
            
            return str(filepath)
        except requests.exceptions.RequestException as e:
            return f">>> ERROR DE CONEXIÓN: {str(e)}"
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
    
    def generar_video_temporal(self, prompt=None, year=None, era=None, character=None, style=None, duration=4):
        """Genera un video visualizando un momento en el tiempo con personalización completa."""
        if year is not None:
            self.year = year
        if era and era in self.ERAS:
            self.current_era = era
        if character and character in self.CHARACTERS:
            self.current_character = character
        if style and style in self.STYLES:
            self.current_style = style
        
        # Construir el prompt completo
        full_prompt = self.construir_prompt(prompt)
        
        print(f">>> GENERANDO VIDEO PERSONALIZADO...")
        print(f"    Era: {self.ERAS[self.current_era]['name']}")
        print(f"    Personaje: {self.CHARACTERS[self.current_character]['name']}")
        print(f"    Estilo: {self.current_style}")
        print(f"    Duración: {duration}s")
        print(f">>> ESTO PUEDE TARDAR 1-3 MINUTOS...")
        
        try:
            # Usar NVIDIA NIM API para video via requests directamente
            headers = {
                "Authorization": f"Bearer {NVIDIA_API_KEY}",
                "Content-Type": "application/json"
            }
            
            # Agregar movimiento de cámara al prompt
            video_prompt = f"{full_prompt}, smooth cinematic camera movement, dolly shot, professional cinematography"
            
            payload = {
                "model": "nvidia/cosmos-transfer1",
                "prompt": video_prompt,
                "num_frames": duration * 24,  # 24 fps
                "fps": 24
            }
            
            response = requests.post(
                "https://integrate.api.nvidia.com/v1/video/generations",
                headers=headers,
                json=payload,
                timeout=180
            )
            response.raise_for_status()
            
            result = response.json()
            video_url = result.get("data", [{}])[0].get("url")
            
            if not video_url:
                return ">>> ERROR: No se obtuvo URL del video"
            
            # Descargar y guardar el video
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"video_{self.current_era}_{self.current_character}_{self.year}_{timestamp}.mp4"
            filepath = self.visualizations_dir / filename
            
            vid_response = requests.get(video_url, stream=True, timeout=120)
            vid_response.raise_for_status()
            
            with open(filepath, "wb") as f:
                for chunk in vid_response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f">>> VIDEO GENERADO: {filepath}")
            print(f">>> URL: {video_url}")
            
            # Abrir automáticamente el video
            self.abrir_archivo(filepath)
            
            return str(filepath)
        except requests.exceptions.RequestException as e:
            return f">>> ERROR DE CONEXIÓN EN VIDEO: {str(e)}"
        except Exception as e:
            return f">>> ERROR EN GENERACIÓN DE VIDEO: {str(e)}"
    
    def generar_live_image(self, prompt=None, era=None, character=None, style=None):
        """Genera una imagen en tiempo real con estilo 'live photo' animado."""
        if era and era in self.ERAS:
            self.current_era = era
        if character and character in self.CHARACTERS:
            self.current_character = character
        if style and style in self.STYLES:
            self.current_style = style
        
        # Prompt optimizado para live image con efecto de movimiento sutil
        live_prompt = self.construir_prompt(prompt)
        live_prompt += ", subtle motion effect, parallax animation, depth of field, cinematic still with movement"
        
        print(f">>> GENERANDO LIVE IMAGE...")
        print(f"    Efecto: Movimiento sutil tipo parallax")
        
        try:
            # Generar imagen base
            response = self.client.images.generate(
                model="stabilityai/stable-diffusion-3-5-large",
                prompt=live_prompt,
                size="1024x1024",
                n=1,
                response_format="url"
            )
            
            image_url = response.data[0].url
            
            # Descargar imagen
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"live_{self.current_era}_{self.current_character}_{self.year}_{timestamp}.png"
            filepath = self.visualizations_dir / filename
            
            img_response = requests.get(image_url)
            img_response.raise_for_status()
            
            with open(filepath, "wb") as f:
                f.write(img_response.content)
            
            # Generar versión animada (live photo) con efecto parallax
            mp4_filename = f"live_{self.current_era}_{self.current_character}_{self.year}_{timestamp}.mp4"
            mp4_filepath = self.visualizations_dir / mp4_filename
            
            # Crear video con efecto parallax usando ffmpeg si está disponible
            try:
                subprocess.run([
                    "ffmpeg", "-y",
                    "-loop", "1",
                    "-i", str(filepath),
                    "-vf", "scale=8000:-1,zoompan=z='min(zoom+0.001,1.5)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1024x1024:fps=30",
                    "-t", "4",
                    "-c:v", "libx264",
                    "-pix_fmt", "yuv420p",
                    str(mp4_filepath)
                ], capture_output=True, check=True)
                print(f">>> LIVE IMAGE ANIMADO: {mp4_filepath}")
                self.abrir_archivo(mp4_filepath)
            except (subprocess.CalledProcessError, FileNotFoundError):
                print(f">>> Live image estática guardada (ffmpeg no disponible): {filepath}")
                self.abrir_archivo(filepath)
            
            print(f">>> URL: {image_url}")
            return str(filepath)
        except Exception as e:
            return f">>> ERROR EN LIVE IMAGE: {str(e)}"
    
    def viajar_y_visualizar(self, year=None, tema=None, era=None, character=None, style=None):
        """Viaja a un año y genera una visualización completa de ese momento."""
        if year is not None:
            self.year = year
        if era:
            self.current_era = era
        if character:
            self.current_character = character
        if style:
            self.current_style = style
        
        self.inyectar_mame(f"YEAR [ {self.year}")
        print(f">>> SALTO TEMPORAL CONFIRMADO A {self.year}")
        
        # Generar imagen del momento con configuración actual
        resultado_img = self.generar_imagen_temporal(tema)
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
        print("  LIVE: <tema>        -> Genera live image con efecto parallax")
        print("  EXPLORAR: <ini> <fin> -> Explora timeline con visualizaciones")
        print("  AUDITAR             -> Escaneo de activos USDT.z en la red")
        print("")
        print("PERSONALIZACIÓN:")
        print("  ERAS                -> Lista eras disponibles")
        print("  ERA: <nombre>       -> Selecciona era (ej: medieval, 1980, 2050)")
        print("  PERSONAJES          -> Lista personajes disponibles")
        print("  PERSONAJE: <nombre> -> Selecciona personaje (ej: hacker, robot)")
        print("  ESTILOS             -> Lista estilos visuales")
        print("  ESTILO: <nombre>    -> Selecciona estilo (ej: cyberpunk, retro)")
        print("  TEMA: <descripcion> -> Define escena personalizada")
        print("  PREVIEW             -> Vista previa del prompt actual")
        print("  RESET               -> Restaura configuración por defecto")
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
                    resultado = self.generar_imagen_temporal(tema, anio)
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
                
                elif entrada.upper().startswith("LIVE:"):
                    tema = entrada[5:].strip() or None
                    resultado = self.generar_live_image(tema)
                    print(f"\n{resultado}\n")
                
                elif entrada.upper() == "ERAS":
                    self.listar_eras()
                
                elif entrada.upper().startswith("ERA:"):
                    era_key = entrada[4:].strip().lower()
                    if era_key in self.ERAS:
                        self.current_era = era_key
                        print(f">>> ERA SELECCIONADA: {self.ERAS[era_key]['name']}")
                    else:
                        print(">>> ERA NO ENCONTRADA. Usa ERAS para ver opciones.")
                
                elif entrada.upper() == "PERSONAJES":
                    self.listar_personajes()
                
                elif entrada.upper().startswith("PERSONAJE:"):
                    char_key = entrada[10:].strip().lower()
                    if char_key in self.CHARACTERS:
                        self.current_character = char_key
                        print(f">>> PERSONAJE SELECCIONADO: {self.CHARACTERS[char_key]['name']}")
                    else:
                        print(">>> PERSONAJE NO ENCONTRADO. Usa PERSONAJES para ver opciones.")
                
                elif entrada.upper() == "ESTILOS":
                    self.listar_estilos()
                
                elif entrada.upper().startswith("ESTILO:"):
                    style_key = entrada[7:].strip().lower()
                    if style_key in self.STYLES:
                        self.current_style = style_key
                        print(f">>> ESTILO SELECCIONADO: {style_key}")
                    else:
                        print(">>> ESTILO NO ENCONTRADO. Usa ESTILOS para ver opciones.")
                
                elif entrada.upper().startswith("TEMA:"):
                    self.custom_prompt = entrada[5:].strip()
                    if self.custom_prompt:
                        print(f">>> TEMA PERSONALIZADO: {self.custom_prompt}")
                        print(f">>> Prompt preview: {self.construir_prompt()}")
                    else:
                        print(">>> TEMA LIMPIADO (usando configuración de era/personaje)")
                
                elif entrada.upper() == "RESET":
                    self.current_era = "2020"
                    self.current_character = "cientifico"
                    self.current_style = "realista"
                    self.custom_prompt = ""
                    print(">>> CONFIGURACIÓN RESTAURADA A VALORES POR DEFECTO")
                    print(f"    Era: {self.ERAS[self.current_era]['name']}")
                    print(f"    Personaje: {self.CHARACTERS[self.current_character]['name']}")
                    print(f"    Estilo: {self.current_style}")
                
                elif entrada.upper() == "PREVIEW":
                    print("\n=== VISTA PREVIA DEL PROMPT ===")
                    print(f"Era: {self.ERAS[self.current_era]['name']}")
                    print(f"Personaje: {self.CHARACTERS[self.current_character]['name']}")
                    print(f"Estilo: {self.current_style}")
                    if self.custom_prompt:
                        print(f"Tema: {self.custom_prompt}")
                    print(f"\nPrompt completo:")
                    print(self.construir_prompt())
                    print()
                
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
