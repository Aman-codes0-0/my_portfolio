// Switch theme functionality with persistence
document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.querySelector(".switch-theme");

    // Check for saved theme preference or use system preference
    const currentTheme = localStorage.getItem("theme");

    // Apply initial theme
    if (currentTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeBtn) themeBtn.textContent = "☀";
    }

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            // Toggle dark mode class on body
            document.body.classList.toggle("dark-mode");

            // Toggle icon and save preference
            let theme = "light";
            if (document.body.classList.contains("dark-mode")) {
                theme = "dark";
                themeBtn.textContent = "☀";
            } else {
                themeBtn.textContent = "☾";
            }

            localStorage.setItem("theme", theme);
            console.log(`Theme switched to ${theme}!`);
        });
    }

    // Hamburger Menu Logic
    const siteHeader = document.querySelector(".site-header");
    if (siteHeader) {
        // Dynamically inject the hamburger button if the header exists
        const hamburgerBtn = document.createElement("button");
        hamburgerBtn.className = "hamburger-btn";
        hamburgerBtn.innerHTML = `
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        `;
        siteHeader.appendChild(hamburgerBtn);

        // Toggle nav-open class on click
        hamburgerBtn.addEventListener("click", () => {
            siteHeader.classList.toggle("nav-open");
            // Prevent body scroll when menu is open
            document.body.style.overflow = siteHeader.classList.contains("nav-open") ? "hidden" : "";
        });

        // Close menu when a navigation link is clicked
        const navLinks = siteHeader.querySelectorAll(".main-nav a");
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                siteHeader.classList.remove("nav-open");
                document.body.style.overflow = "";
            });
        });
    }

    // Terminal Logic
    const terminalInput = document.getElementById("terminal-input");
    const terminalOutput = document.getElementById("terminal-output");

    // Command history for ↑↓ navigation
    const cmdHistory = [];
    let historyIndex = -1;

    // Boot sequence (only on terminal page)
    const terminalLines = document.getElementById("terminal-lines") || terminalOutput;
    if (terminalLines) {
        const bootLines = [
            { html: '<span style="color:#00ff41;font-weight:bold;">AmanOS v2.0 (Brutalist Edition)</span> <span style="color:#888;">—</span> <span style="color:#5cc2e6;">Kernel: Linux 6.8.0</span>', delay: 120 },
            { html: '<span style="color:#aaa;">Loading modules... [</span><span style="color:#00ff41;">████████████████████</span><span style="color:#aaa;">] </span><span style="color:#28c840;">100%</span>', delay: 260 },
            { html: '<span style="color:#aaa;">Memory: <span style="color:#28c840;">OK</span> &nbsp;|&nbsp; Network: <span style="color:#28c840;">OK</span> &nbsp;|&nbsp; Shell: <span style="color:#5cc2e6;">bash</span></span>', delay: 380 },
            { html: '', delay: 460 },
            { html: '<span style="color:#444;">─────────────────────────────────────────────────────────</span>', delay: 500 },
            { html: 'Welcome to <b style="color:#00ff41;">Aman\'s Portfolio Terminal</b> &nbsp;<span style="color:#555;">v2.0</span>', delay: 580 },
            { html: 'Type <span style="color:#ffbd2e;font-weight:bold;">help</span> to see available commands.', delay: 660 },
            { html: '<span style="color:#444;">─────────────────────────────────────────────────────────</span>', delay: 720 },
            { html: '', delay: 760 },
        ];
        bootLines.forEach(({ html, delay }) => {
            setTimeout(() => {
                const d = document.createElement('div');
                d.className = 'line';
                d.innerHTML = html;
                terminalLines.appendChild(d);
                if (terminalOutput) terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }, delay);
        });
    }

    if (terminalInput) {
        terminalInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const command = terminalInput.value.trim().toLowerCase();
                if (command) {
                    cmdHistory.unshift(command);
                    historyIndex = -1;
                }
                processCommand(command);
                terminalInput.value = "";
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                if (historyIndex < cmdHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = cmdHistory[historyIndex];
                }
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = cmdHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    terminalInput.value = "";
                }
            }
        });

        // Refocus terminal on click anywhere in output
        if (terminalOutput) {
            terminalOutput.addEventListener('click', () => terminalInput.focus());
        }
        terminalInput.focus();
    }

    function processCommand(cmd) {
        if (!cmd) return;

        // Add command echo to output
        const line = document.createElement("div");
        line.className = 'line c-cmd';
        line.innerHTML = `<span class="prompt">aman@portfolio:~$</span> ${cmd}`;
        terminalLines.appendChild(line);

        let response = "";
        switch (cmd) {
            case "help":
                response = `Available commands:

  <span style="color:#ffbd2e">── General ──────────────────────────────</span>
  <span class="prompt">whoami</span>         - About Aman
  <span class="prompt">skills</span>         - Technical capabilities
  <span class="prompt">achievements</span>   - Hackathon wins &amp; honors
  <span class="prompt">certifications</span> - Professional certificates
  <span class="prompt">education</span>      - Academic background
  <span class="prompt">socials</span>        - Professional links
  <span class="prompt">contact</span>        - Get in touch
  <span class="prompt">neofetch</span>       - System information
  <span class="prompt">date</span>           - Current date &amp; time
  <span class="prompt">theme</span>          - Toggle terminal color theme
  <span class="prompt">clear</span>          - Clear terminal window
  <span class="prompt">exit</span>           - Exit terminal

  <span style="color:#ffbd2e">── Navigation ───────────────────────────</span>
  <span class="prompt">ls</span>             - List available files
  <span class="prompt">gui</span>            - Return to graphical interface
  <span class="prompt">projects</span>       - View portfolio projects`;
                break;
            case "neofetch":
                response = `<div class="neofetch-container">
    <pre style="color: #e06c75; margin: 0; font-family: monospace; font-size: 0.65rem; line-height: 1.1;">
            ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣤⣤⣤⣤⣤⣤⣄⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠛⠻⠿⢿⣿⣿⣿⣿⣿⣶⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⣿⣿⣿⣿⣿⣿⣶⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣷⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⣀⣀⣙⢿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣶⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠻⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⠀⠀⢹⣿⣿⣿⣿⣿⣿⣿⣆⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣿⣿⣿⣿⡟⠹⠿⠟⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⡆⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡿⠋⡬⢿⣿⣷⣤⣤⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠀⠀⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⡀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠰⡇⢸⡇⢸⣿⣿⣿⠟⠁⢀⣬⢽⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣼⣧⣈⣛⣿⣿⣿⡇⠀⠀⣾⠁⢀⢻⣿⣿⣿⣿⠇⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣿⣿⣿⣿⣿⣧⣄⣀⠙⠷⢋⣼⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇
⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁
⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀
⠸⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⢀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⠀
⠀⢹⣿⣿⣧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀
⠀⠀⠹⣿⣿⣿⣷⣄⠀⠀⠀⠀⠀⠀⠀⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠀⠀
⠀⠀⠀⠙⣿⣿⣿⣿⣿⣶⣤⣀⠀⠀⠀⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠋⠀⠀⠀⠀
⠀⠀⠀⠀⠈⠻⣿⣿⣿⣿⣿⣿⣿⣷⣶⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠉⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠛⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⠻⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠛⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠛⠛⠛⠛⠛⠛⠛⠋⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    </pre>
    <div>
        <b style="color: #e06c75;">aman</b>@<b style="color: #e06c75;">portfolio</b>
        <br>-------------------
        <br><b style="color: #d19a66;">OS</b>: AmanOS v2.0 (System-Dev Edition)
        <br><b style="color: #d19a66;">Host</b>: Kanpur Institute of Technology
        <br><b style="color: #d19a66;">Kernel</b>: Linux Enthusiast / B.Tech CSE
        <br><b style="color: #d19a66;">Uptime</b>: 20 years
        <br><b style="color: #d19a66;">Packages</b>: 15 (Advanced Skills)
        <br><b style="color: #d19a66;">Shell</b>: zsh (Custom TUI)
        <br><b style="color: #d19a66;">Resolution</b>: 1920x1080 (Brutalist)
        <br><b style="color: #d19a66;">Theme</b>: Neo-Retro
        <br>
        <br><span style="background: #e06c75; color: #e06c75;">███</span><span style="background: #98c379; color: #98c379;">███</span><span style="background: #d19a66; color: #d19a66;">███</span><span style="background: #61afef; color: #61afef;">███</span><span style="background: #c678dd; color: #c678dd;">███</span><span style="background: #56b6c2; color: #56b6c2;">███</span>
    </div>
</div>`;
                break;
            case "whoami":
                response = `<b>Aman Kumar</b>
Passionate developer building efficient and meaningful digital experiences.
Strong interest in system-level programming, terminal-based applications, and modern web development.
Currently pursuing B.Tech in CSE (2023–2027) @ KIT.

<i>"Finalist at Smart India Hackathon 2025 and Top 10 at Aviothic 2.0."</i>`;
                break;
            case "skills":
                response = `<b>Technical Expertise:</b>
<span style="color:var(--accent-yellow)">[Programming]:</span> Python (Adv), C++, Shell, JS
<span style="color:var(--accent-green)">[System Dev]:</span> Memory Mgmt, Low-level Opt, TUI Design
<span style="color:var(--accent-blue)">[Expertise]:</span> DSA, UI Frameworks, System-level Prog
<span style="color:var(--accent-pink)">[Linux/Tools]:</span> System Admin, Server Mgmt, Security, Git
<span style="color:var(--accent-yellow)">[Web & AI]:</span> React, HTML/CSS, Generative AI
<span style="color:var(--accent-green)">[Frameworks]:</span> FastAPI, Next.js, Node/Express, Textual (TUI), Socket.io`.replace(/\n/g, '<br>');
                break;
            case "achievements":
                response = `<b>Major Achievements:</b>
- Finalist: Smart India Hackathon (SIH) 2025 <a href="source/SIH.jpg" target="_blank" style="color:#00ff41">[View Certificate]</a>
- Top 10: Aviothic 2.0 Hackathon <a href="source/Aviothic2.0.jpg" target="_blank" style="color:#00ff41">[View Certificate]</a>`;
                break;
            case "certifications":
                response = `<b>Verified Certifications:</b>
- Advanced Python Programming (DSA Mastery)
- Linux System Administration Specialist
- C++ System Development`;
                break;
            case "projects":
                response = `<b>Recent Projects:</b>
1. [TenderIQ Backend] - Node.js/SQLite
2. [Ludo Timer] - Automated turn logic
3. [Retro Portfolio] - This site!
4. [AI Innovation] - Python/GenAI
5. [Software Tool] - C++/Linux
<i>Type 'projects --open' to see the full project showcase.</i>`;
                break;
            case "projects --open":
                response = "Navigating to Projects showcase...";
                setTimeout(() => window.location.href = "projects.html", 2000);
                break;
            case "ls":
            case "dir":
                response = `<span style="color:#5cc2e6">about.txt</span>  <span style="color:#28c840">skills.sh</span>  <span style="color:#ffbd2e">projects/</span>  <span style="color:#5cc2e6">education.md</span>  <span style="color:#f45b7a">socials.link</span>  <span style="color:#28c840">gui.exe</span>`;
                break;

            // ── File open commands (from ls) ──
            case "about.txt":
            case "cat about.txt":
                response = `<b>about.txt</b> — Aman Kumar
────────────────────────────────────────
A passionate developer who enjoys building efficient
and meaningful digital experiences.

Strong interest in system-level programming,
terminal-based applications, and modern web development.

Currently pursuing B.Tech in CSE (2023–2027) @ KIT.
Apart from coding: exploring new tech, solving logical
problems, and continuously improving dev skills.`;
                break;

            case "skills.sh":
            case "./skills.sh":
            case "bash skills.sh":
                response = `<span style="color:#28c840">$ Running skills.sh...</span>
────────────────────────────────────────
[Languages]  Python (Adv) · C++ · Shell · JavaScript
[System]     Memory Mgmt · Low-level Opt · TUI Design
[Web & AI]   React · HTML/CSS · Generative AI
[Tools]      Linux Admin · Server Mgmt · Git & GitHub
[Expertise]  DSA · UI Frameworks · System-level Prog.
<span style="color:#28c840">$ Done.</span>`;
                break;

            case "projects/":
            case "cd projects/":
            case "open projects/":
                response = `<span style="color:#ffbd2e">Opening projects directory...</span>
Navigating to Projects showcase in 2s.`;
                setTimeout(() => window.location.href = "projects.html", 2000);
                break;

            case "education.md":
            case "cat education.md":
                response = `<b>education.md</b>
────────────────────────────────────────
# Bachelor in Technology — Computer Science Engineering
  Kanpur Institute of Technology
  📍 Kanpur, Uttar Pradesh
  📅 2023 – 2027

## Achievements
  • SIH 2025 National Finalist
  • Local TUI Design Hackathon — Winner
  • Aviothic 2.0 — Top 10`;
                break;

            case "socials.link":
            case "open socials.link":
                response = `<b>socials.link</b>
────────────────────────────────────────
<span style="color:#5cc2e6">LinkedIn :</span> <a href="https://www.linkedin.com/in/aman-kumar-44b4183a0" target="_blank" style="color:#00ff41">aman-kumar-44b4183a0</a>
<span style="color:#5cc2e6">GitHub   :</span> <a href="https://github.com/Aman-codes0-0" target="_blank" style="color:#00ff41">Aman-codes0-0</a>
<span style="color:#5cc2e6">Contact  :</span> <a href="contact.html" style="color:#00ff41">contact.html</a>`;
                break;

            case "gui.exe":
            case "./gui.exe":
            case "open gui.exe":
                response = `<span style="color:#28c840">Launching graphical interface...</span>
Switching to GUI in 2s.`;
                setTimeout(() => window.location.href = "home.html", 2000);
                break;
            case "education":
                response = `<b>Bachelor in Technology, CSE</b>
Kanpur Institute of Technology (2023 - 2027)
📍 Kanpur, Uttar Pradesh`;
                break;
            case "socials":
                response = `<b>Connect with me:</b>
<span style="color:#5cc2e6">LinkedIn :</span> <a href="https://www.linkedin.com/in/aman-kumar-44b4183a0" target="_blank" style="color:#00ff41">aman-kumar-44b4183a0</a>
<span style="color:#5cc2e6">GitHub   :</span> <a href="https://github.com/Aman-codes0-0" target="_blank" style="color:#00ff41">Aman-codes0-0</a>
<span style="color:#5cc2e6">Contact  :</span> <a href="contact.html" style="color:#00ff41">contact.html</a>`;
                break;
            case "journey":
                response = "Navigating to Journey page...";
                setTimeout(() => window.location.href = "journey.html", 2000);
                break;
            case "repo":
                response = "Opening source code...";
                window.open("https://github.com/Aman-codes0-0", "_blank");
                break;
            case "sudo":
                response = "<span style='color: #ff5555;'>user is not in the sudoers file. This incident will be reported.</span>";
                break;
            case "about":
                response = `Aman Kumar — B.Tech CSE student @ KIT.
I enjoy working with Linux environments and exploring how software works under the hood.
From command-line tools to APIs and UI frameworks — I build things that are practical and elegant.
Apart from coding, I like exploring new technologies and solving logical problems.
Type 'whoami' for the full profile.`;
                break;
            case "contact":
                response = "Navigating to Contact page...";
                setTimeout(() => window.location.href = "contact.html", 2000);
                break;
            case "theme": {
                const crtEl = document.querySelector('.crt');
                if (crtEl) {
                    // Terminal page — toggle amber phosphor
                    document.body.classList.toggle("terminal-amber");
                    const isAmber = document.body.classList.contains("terminal-amber");
                    localStorage.setItem("terminal-theme", isAmber ? "amber" : "green");
                    response = `Switched to <b style="color:${isAmber ? '#ffb300' : '#00ff41'}">${isAmber ? 'Amber Phosphor' : 'Green Phosphor'}</b> mode.`;
                } else {
                    // Regular page — toggle dark/light
                    document.body.classList.toggle("dark-mode");
                    const newTheme = document.body.classList.contains("dark-mode") ? "dark" : "light";
                    localStorage.setItem("theme", newTheme);
                    response = `Theme switched to <b>${newTheme}</b> mode.`;
                }
                break;
            }
            case "terminal":
                response = "You are already here!";
                break;
            case "exit":
            case "gui":
                response = "Returning to Graphical Interface...";
                setTimeout(() => window.location.href = "home.html", 2000);
                break;
            case "clear":
                terminalLines.innerHTML = "";
                return;
            case "date":
                response = new Date().toString();
                break;
            case (cmd.startsWith("echo ") ? cmd : "---"):
                response = cmd.replace("echo ", "");
                break;
            default:
                response = `Command not found: ${cmd}. Type 'help' for assistance.`;
        }

        const resLine = document.createElement("div");
        resLine.className = "line";
        // Convert newlines to <br> so multiline responses render correctly
        resLine.innerHTML = response.replace(/\n/g, '<br>');
        terminalLines.appendChild(resLine);
        if (terminalOutput) terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // GitHub Repository Fetcher
    const projectsContainer = document.getElementById("github-projects-container");
    if (projectsContainer) {
        fetchGitHubRepos("Aman-codes0-0");
    }

    async function fetchGitHubRepos(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
            const repos = await response.json();
            
            if (response.ok) {
                renderRepos(repos);
            } else {
                throw new Error("Failed to fetch");
            }
        } catch (error) {
            console.error("Error fetching repos:", error);
            projectsContainer.innerHTML = `<p class='text-center' style='grid-column: 1/-1;'>Failed to load projects. <a href='https://github.com/${username}' target='_blank'>View on GitHub</a></p>`;
        }
    }

    function renderRepos(repos) {
        projectsContainer.innerHTML = ""; // Clear loading state
        
        const colors = ["bg-light-blue", "bg-pink", "bg-green", "bg-yellow"];
        
        repos.forEach((repo, index) => {
            if (repo.fork) return; // Skip forks

            const colorClass = colors[index % colors.length];
            const projectCard = document.createElement("div");
            projectCard.className = "project-card brutalist-box box-shadow-main";
            
            // Format technical badges from repo topics or language
            let techBadges = "";
            if (repo.language) {
                techBadges += `<span class="badge brutalist-box">${repo.language}</span>`;
            }
            if (repo.topics) {
                repo.topics.slice(0, 2).forEach(topic => {
                    techBadges += `<span class="badge brutalist-box">${topic}</span>`;
                });
            }

            projectCard.innerHTML = `
                <div class="project-image-placeholder ${colorClass} border-bottom">
                    <span class="handwritten">${repo.name}</span>
                </div>
                <div class="project-info">
                    <h4 class="project-title">${repo.name.replace(/-/g, ' ')}</h4>
                    <p class="project-description">${repo.description || "No description provided. Click the GitHub link to learn more about this repository."}</p>
                    <div class="project-tech">
                        ${techBadges || '<span class="badge brutalist-box">Software</span>'}
                    </div>
                    <div class="project-links">
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="btn btn-blue box-shadow-small">Live Demo</a>` : ''}
                        <a href="${repo.html_url}" target="_blank" class="btn box-shadow-small">GitHub</a>
                    </div>
                </div>
            `;
            projectsContainer.appendChild(projectCard);
        });
    }

    console.log("Retro Portfolio Initialized.");

    // Hide Preloader
    window.addEventListener("load", () => {
        const preloader = document.getElementById("preloader");
        if (preloader) {
            // Add a small delay for better visual effect
            setTimeout(() => {
                preloader.classList.add("loaded");
                console.log("Preloader hidden.");
            }, 1000);
        }
    });
    
    // EmailJS Contact Form Logic
    if (typeof emailjs !== 'undefined') {
        emailjs.init({
            publicKey: 'qCAC_Qbq2i8pKa9Zw',
        });
    }

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const statusDiv = document.getElementById('formStatus');
            const originalBtnText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = 'Sending... <span style="animation: spin 1s linear infinite; display: inline-block;">⚙️</span>';
            submitBtn.disabled = true;
            statusDiv.style.display = 'none';

            // Send the form using EmailJS
            emailjs.sendForm('service_twg8dem', 'template_oqsgrqj', this)
                .then(() => {
                    statusDiv.innerHTML = 'Message Sent Successfully! ✅<br>I will get back to you soon.';
                    statusDiv.style.backgroundColor = 'var(--accent-green)';
                    statusDiv.style.color = '#1a1a1a';
                    statusDiv.style.display = 'block';
                    contactForm.reset();
                }, (error) => {
                    console.error('EmailJS Error:', error);
                    statusDiv.innerHTML = 'Failed to send message. Please try again later.';
                    statusDiv.style.backgroundColor = 'var(--accent-pink)';
                    statusDiv.style.color = '#1a1a1a';
                    statusDiv.style.display = 'block';
                })
                .finally(() => {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    setTimeout(() => { statusDiv.style.display = 'none'; }, 5000);
                });
        });
    }

    // Spinner CSS keyframes
    if (!document.getElementById("spinner-css")) {
        const styleSheet = document.createElement("style");
        styleSheet.id = "spinner-css";
        styleSheet.innerText = `@keyframes spin { 100% { transform: rotate(360deg); } }`;
        document.head.appendChild(styleSheet);
    }
});

// Certificate Modal Functions
function openCertModal(imageSrc) { const modal = document.getElementById('certModal'); if(modal) { document.getElementById('certImage').src = imageSrc; modal.classList.add('active'); } }
function closeCertModal() { const modal = document.getElementById('certModal'); if(modal) { modal.classList.remove('active'); setTimeout(() => { document.getElementById('certImage').src = ''; }, 300); } }
