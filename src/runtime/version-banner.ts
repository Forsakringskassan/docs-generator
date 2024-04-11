const banner = document.querySelector<HTMLDialogElement>("#version-banner");

if (banner) {
    document.addEventListener("DOMContentLoaded", () => {
        if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
            return;
        }

        if (!window.location.pathname.startsWith("/latest")) {
            banner.style.display = "block";
        }
    });
}
