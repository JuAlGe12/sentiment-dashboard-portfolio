# Plataforma de Análisis de Sentimiento de Marcas

Un dashboard full-stack que rastrea y analiza el sentimiento de menciones de marcas, construido con Node.js, React y PostgreSQL, y desplegado en la nube.

**Ver Demo en vivo:** [https://TU_PROYECTO.vercel.app](https://TU_PROYECTO.vercel.app)

![Screenshot del Dashboard](./screenshot.png) ---

## Características

* **Análisis de Sentimiento:** Clasifica menciones como positivas, negativas o neutrales usando `sentiment`.
* **Dashboard Interactivo:** Visualiza datos con gráficos de Chart.js.
* **Filtrado Dinámico:** Filtra resultados por marca.
* **API RESTful:** Backend robusto con Express.js.
* **Diseño Responsivo:** Interfaz adaptable a móviles y escritorio.

## Stack Tecnológico

* **Backend:** Node.js, Express.js, PostgreSQL
* **Frontend:** React (Vite), Axios, Chart.js
* **Despliegue:**
    * API & Base de Datos: **Render**
    * Frontend: **Vercel**
    * Desarrollo local: **Docker**

---

## Ejecución Local

1.  **Clonar:** `git clone https://github.com/tu-usuario/tu-repositorio.git`
2.  **Backend:**
    ```bash
    cd backend
    npm install
    cp .env.example .env # Rellena .env con tus credenciales
    docker-compose up -d # Inicia la base de datos
    npm run dev
    ```
3.  **Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
