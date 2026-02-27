import { getToastContainer } from "./ui/Containers/ToastContainer";
import { ToastOptions, BeepType } from "./types";
import { playSound } from "./sound";

export function toast({
  title,
  message,
  type = "info",
  position = "bottom-right",
  duration = null,
  sound = false,
  options,
}: ToastOptions): void {
  const borderColor: Record<BeepType, string> = {
    success: "var(--color-border-success)",
    error: "var(--color-border-error)",
    info: "var(--color-border-info)",
    warning: "var(--color-border-warning)",
    danger: "var(--color-border-danger)",
  };

  // Crear contenedor si no existe
  const container = getToastContainer(position);
  const positionName =
    container.style.top && container.style.top !== "" ? "top" : "bottom";
  // Crear notificación
  const notif = document.createElement("div");
  notif.className = `beep-notification ${type} ${positionName}`;
  notif.style.borderLeft = `7px solid ${borderColor[type] || "#000000"}`;
  notif.style.pointerEvents = "auto";

  // Contenedor interno flex: icono a la izquierda, texto a la derecha
  const inner = document.createElement("div");
  inner.className = "beep-inner";

  // Icono
  const iconSpan = document.createElement("span");
  iconSpan.className = "beep-icon";
  iconSpan.innerHTML = getIconSVG(type);

  // Texto
  const textSpan = document.createElement("div");
  textSpan.className = "beep-text";

  // botón de cerrar
  if (options?.closeButton) {
    const closeBtn = document.createElement("span");
    closeBtn.className = "beep-close";
    closeBtn.innerHTML = "x";

    closeBtn.addEventListener("click", () => {
      notif.classList.add("fade-out");
      notif.addEventListener("animationend", () => notif.remove(), {
        once: true,
      });
    });

    inner.appendChild(closeBtn);
  }

  if (options && options.html) {
    textSpan.innerHTML = message;
  } else {
    textSpan.textContent = message;
  }

  if (title) {
    const titleSpan = document.createElement("div");
    titleSpan.className = "beep-title";

    if (options?.html) {
      titleSpan.innerHTML = title;
    } else {
      titleSpan.textContent = title;
    }

    textSpan.prepend(titleSpan);
  }

  // Montamos todo
  inner.appendChild(iconSpan);
  inner.appendChild(textSpan);
  notif.appendChild(inner);

  // **Agregar notificación al contenedor**
  container.appendChild(notif);

  // Sonido
  if (sound) {
    playSound();
  }

  let timeoutId: ReturnType<typeof setTimeout>;
  let startTime: number;
  let remaining = duration ?? 0;
  let totalDuration = duration ?? 0;
  let totalElapsed: number = 0;
  let progressBar: HTMLDivElement;
  let progressInterval: ReturnType<typeof setTimeout>;
  let counterInterval: ReturnType<typeof setTimeout>;

  if (duration != null) {
    function startTimer() {
      startTime = Date.now();

      timeoutId = setTimeout(() => {
        notif.classList.add("fade-out");
        notif.addEventListener("animationend", () => notif.remove(), {
          once: true,
        });
      }, remaining);

      if (options?.showProgressBar) {
        // barra de progreso
        progressBar = document.createElement("div");
        progressBar.className = "beep-progress";
        progressBar.style.width = "100%";
        notif.appendChild(progressBar);

        progressInterval = setInterval(() => {
          const currentElapsed = totalElapsed + (Date.now() - startTime);
          const progress = Math.max(
            0,
            ((totalDuration - currentElapsed) / totalDuration) * 100,
          );
          progressBar.style.width = progress + "%";
        }, 50);

        counterInterval = setInterval(() => {
          const currentElapsed = totalElapsed + (Date.now() - startTime);
          const timeLeft = Math.max(0, totalDuration - currentElapsed);

          if (timeLeft <= 0) {
            clearInterval(counterInterval);
          }
        }, 100);
      }
    }

    function pauseTimer() {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      clearInterval(counterInterval);

      const elapsedThisSession = Date.now() - startTime;
      totalElapsed += elapsedThisSession;
      remaining -= elapsedThisSession;
    }

    function resumeTimer() {
      startTime = Date.now();

      timeoutId = setTimeout(() => {
        notif.classList.add("fade-out");
        notif.addEventListener("animationend", () => notif.remove(), {
          once: true,
        });
      }, remaining);

      if (options?.showProgressBar) {
        progressInterval = setInterval(() => {
          const currentElapsed = totalElapsed + (Date.now() - startTime);
          const progress = Math.max(
            0,
            ((totalDuration - currentElapsed) / totalDuration) * 100,
          );
          progressBar.style.width = progress + "%";
        }, 50);

        counterInterval = setInterval(() => {
          const currentElapsed = totalElapsed + (Date.now() - startTime);
          const timeLeft = Math.max(0, totalDuration - currentElapsed);

          if (timeLeft <= 0) {
            clearInterval(counterInterval);
          }
        }, 100);
      }
    }

    startTimer();

    if (options?.stopOnHover) {
      notif.addEventListener("mouseenter", pauseTimer);
      notif.addEventListener("mouseleave", resumeTimer);
    }
  }
}

// Función de iconos
function getIconSVG(type: BeepType): string {
  switch (type) {
    case "success":
      return `<svg style="color:#65a30d" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" fill-rule="evenodd" d="M256 42.667C138.18 42.667 42.667 138.18 42.667 256S138.18 469.334 256 469.334S469.334 373.82 469.334 256S373.821 42.667 256 42.667m0 384c-94.105 0-170.666-76.561-170.666-170.667S161.894 85.334 256 85.334S426.667 161.894 426.667 256S350.106 426.667 256 426.667m80.336-246.886l30.167 30.167l-131.836 132.388l-79.083-79.083l30.166-30.167l48.917 48.917z"/></svg>`;
    case "error":
    case "danger":
      return `<svg style="color:#dc2626" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M6 18L18 6"/></svg>`;
    case "info":
      return `<svg style="color:#0284c7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></g></svg>`;
    case "warning":
      return `<svg style="color:#ea580c" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 22h20L12 2z"/><line x1="12" y1="8" x2="12" y2="14"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>`;
    default:
      return "";
  }
}