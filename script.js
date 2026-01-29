// Terminal state
let commandHistory = [];
let historyIndex = -1;
let messages = {};
let currentImageIndex = 0;
let galleryImages = [];

// Load messages from JSON
async function loadMessages() {
  try {
    const response = await fetch("messages.json");
    messages = await response.json();
  } catch (error) {
    console.error("Error loading messages:", error);
    messages = {
      error:
        "No se pudieron cargar los mensajes. Por favor, recarga la página.",
    };
  }
}

// Load gallery images - Auto-detect images in img folder
async function loadGalleryImages() {
    try {
        const detectedImages = [];
        const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        let consecutiveMissing = 0;
        const maxConsecutiveMissing = 2; // Stop after 2 consecutive missing numbers
        
        // Check for numbered photos starting from 1
        for (let i = 1; i <= 50; i++) {
            let foundImage = false;
            
            for (const ext of extensions) {
                const imagePath = `img/photo${i}.${ext}`;
                try {
                    const response = await fetch(imagePath, { method: 'HEAD' });
                    if (response.ok) {
                        detectedImages.push(imagePath);
                        foundImage = true;
                        consecutiveMissing = 0; // Reset counter
                        break; // Found this number, move to next
                    }
                } catch (e) {
                    // Image doesn't exist, continue
                }
            }
            
            if (!foundImage) {
                consecutiveMissing++;
                // If we haven't found any images yet and photo1 is missing, stop
                if (i === 1 && consecutiveMissing === 1) {
                    break;
                }
                // If we've missed several consecutive numbers, assume we're done
                if (consecutiveMissing >= maxConsecutiveMissing) {
                    break;
                }
            }
        }
        
        if (detectedImages.length > 0) {
            galleryImages = detectedImages;
            console.log(`✅ Gallery loaded: ${detectedImages.length} image(s) found`);
        } else {
            // Fallback to default if no images detected
            galleryImages = ['img/photo1.jpg'];
            console.log('⚠️ No images detected, using default photo1.jpg');
        }
    } catch (error) {
        console.error('Error loading gallery images:', error);
        // Fallback to default
        galleryImages = ['img/photo1.jpg'];
    }
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await loadMessages();
  loadGalleryImages();

  const input = document.getElementById("commandInput");
  const output = document.getElementById("output");

  // Handle command input
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const command = input.value.trim();
      if (command) {
        executeCommand(command);
        commandHistory.push(command);
        historyIndex = commandHistory.length;
        input.value = "";
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = "";
      }
    }
  });

  // Keep input focused
  document.addEventListener("click", () => {
    input.focus();
  });
});

// Execute command
function executeCommand(command) {
  const output = document.getElementById("output");

  // Echo command
  const commandEcho = document.createElement("div");
  commandEcho.className = "command-echo";
  commandEcho.textContent = `guest@birthday:~$ ${command}`;
  output.appendChild(commandEcho);

  // Parse command
  const parts = command.toLowerCase().split(" ");
  const cmd = parts[0];
  const args = parts.slice(1);

  // Execute based on command
  switch (cmd) {
    case "help":
      showHelp();
      break;
    case "msg":
      if (args.length === 0) {
        printOutput("Uso: msg <nombre>", "error");
        printOutput("Ejemplo: msg jordi", "info");
      } else {
        showMessage(args[0]);
      }
      break;
    case "gallery":
    case "galeria":
      openGallery();
      break;
    case "clear":
    case "cls":
      clearTerminal();
      break;
    case "about":
      showAbout();
      break;
    case "ls":
      listCommands();
      break;
    case "whoami":
      printOutput("guest", "success");
      break;
    case "date":
      printOutput(new Date().toLocaleString("es-ES"), "success");
      break;
    case "secret":
    case "easteregg":
    case "hidden":
      showMessage("secret_message");
      break;
    case "":
      break;
    default:
      printOutput(`bash: ${cmd}: comando no encontrado`, "error");
      printOutput('Escribe "help" para ver los comandos disponibles', "info");
  }

  // Scroll to bottom
  const terminalBody = document.querySelector(".terminal-body");
  terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Show help
function showHelp() {
  const helpText = `
Comandos disponibles:

  <span class="command-highlight">help</span>        Muestra esta ayuda
  <span class="command-highlight">msg</span> &lt;nombre&gt; Muestra un mensaje de cumpleaños
  <span class="command-highlight">gallery</span>    Abre la galería de fotos
  <span class="command-highlight">clear</span>      Limpia la terminal
  <span class="command-highlight">about</span>      Información sobre esta terminal
  <span class="command-highlight">ls</span>         Lista los mensajes disponibles
  <span class="command-highlight">whoami</span>     Muestra el usuario actual
  <span class="command-highlight">date</span>       Muestra la fecha y hora actual

Ejemplos:
  msg jordi
  gallery
    `;
  printOutput(helpText, "success");
}

// Show message
function showMessage(name) {
  const message = messages[name.toLowerCase()];
  if (message) {
    printOutput("─".repeat(60), "info");
    printOutput(message, "success");
    printOutput("─".repeat(60), "info");
  } else {
    printOutput(`No se encontró ningún mensaje de "${name}"`, "error");
    printOutput('Usa "ls" para ver los mensajes disponibles', "info");
  }
}

// List available messages
function listCommands() {
  const names = Object.keys(messages).filter(
    (name) => name !== "secret_message",
  );
  printOutput("Mensajes disponibles:", "info");
  names.forEach((name) => {
    printOutput(`  • ${name}`, "success");
  });
}

// Show about
function showAbout() {
  const aboutText = `
╔════════════════════════════════════════════════════════╗
║     Terminal de Cumpleaños - Versión 1.0              ║
║     Creado especialmente para Alex 🎂                  ║
║                                                        ║
║     Un terminal bash interactivo para celebrar         ║
║     tu día especial de una forma única y geek.         ║
║                                                        ║
║     ¡Feliz Cumpleaños! 🎉🎈🎊                          ║
╚════════════════════════════════════════════════════════╝
    `;
  printOutput(aboutText, "success");
}

// Clear terminal
function clearTerminal() {
  const output = document.getElementById("output");
  output.innerHTML = "";
}

// Print output
function printOutput(text, type = "success") {
  const output = document.getElementById("output");
  const line = document.createElement("div");
  line.className = `output-line ${type}`;
  line.innerHTML = text;
  output.appendChild(line);
}

// Gallery functions
function openGallery() {
  if (galleryImages.length === 0) {
    printOutput(
      'La galería está vacía. Agrega imágenes a la carpeta "img"',
      "error",
    );
    return;
  }

  currentImageIndex = 0;
  showImage(currentImageIndex);

  const modal = document.getElementById("galleryModal");
  modal.style.display = "block";

  printOutput("Galería abierta. Presiona ESC para cerrar.", "success");
}

function showImage(index) {
  const img = document.getElementById("galleryImage");
  const counter = document.getElementById("imageCounter");

  img.src = galleryImages[index];
  counter.textContent = `${index + 1} / ${galleryImages.length}`;
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
  showImage(currentImageIndex);
}

function prevImage() {
  currentImageIndex =
    (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentImageIndex);
}

function closeGallery() {
  const modal = document.getElementById("galleryModal");
  modal.style.display = "none";
}

// Gallery event listeners
document.getElementById("nextBtn").addEventListener("click", nextImage);
document.getElementById("prevBtn").addEventListener("click", prevImage);
document.querySelector(".close-modal").addEventListener("click", closeGallery);

// Close modal when clicking outside
document.getElementById("galleryModal").addEventListener("click", (e) => {
  if (e.target.id === "galleryModal") {
    closeGallery();
  }
});

// Keyboard navigation for gallery
document.addEventListener("keydown", (e) => {
  const modal = document.getElementById("galleryModal");
  if (modal.style.display === "block") {
    if (e.key === "ArrowRight") {
      nextImage();
    } else if (e.key === "ArrowLeft") {
      prevImage();
    } else if (e.key === "Escape") {
      closeGallery();
    }
  }
});
